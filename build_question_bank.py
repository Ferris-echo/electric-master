import os
import re
import shutil
import json
from bs4 import BeautifulSoup

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
IMG_DIR = os.path.join(DATA_DIR, 'images')
os.makedirs(IMG_DIR, exist_ok=True)

def parse_answer_file(fname):
    path = os.path.join('_extracted', fname)
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    ans = {}
    for m in re.finditer(r'(\d{1,3})[、\.\s]+([A-D√×对错])', text):
        ans[int(m.group(1))] = m.group(2)
    return ans

def clean_txt(t):
    t = t.replace('\xa0', ' ').replace('\u3000', ' ').replace('\t', ' ')
    t = re.sub(r' +', ' ', t)
    return t.strip()

def extract_options(text):
    """
    Extracts sequential A、, B、, C、, D、 options.
    Returns (stem, options_list)
    """
    mA = re.search(r'(?:^|[\s\n\r])A[、\.\s]', text)
    if not mA:
        return text.strip(), []
    stem = text[:mA.start()].strip()
    restA = text[mA.start():]
    
    mB = re.search(r'(?:^|[\s\n\r])B[、\.\s]', restA)
    if not mB:
        return stem, [clean_txt(restA)]
    optA = clean_txt(restA[:mB.start()])
    restB = restA[mB.start():]
    
    mC = re.search(r'(?:^|[\s\n\r])C[、\.\s]', restB)
    if not mC:
        return stem, [optA, clean_txt(restB)]
    optB = clean_txt(restB[:mC.start()])
    restC = restB[mC.start():]
    
    mD = re.search(r'(?:^|[\s\n\r])D[、\.\s]', restC)
    if not mD:
        return stem, [optA, optB, clean_txt(restC)]
    optC = clean_txt(restC[:mD.start()])
    optD = clean_txt(restC[mD.start():])
    
    # Ensure options have letter prefix
    opts = [optA, optB, optC, optD]
    letters = ['A', 'B', 'C', 'D']
    clean_opts = []
    for i, opt in enumerate(opts):
        if not re.match(r'^[A-D][、\.]', opt):
            opt = f"{letters[i]}、{opt}"
        clean_opts.append(opt)
        
    return stem, clean_opts

def parse_html_paper(html_fname, ans_fname, paper_id, paper_name):
    html_path = os.path.join('_html_export', html_fname)
    files_dir = os.path.join('_html_export', os.path.splitext(html_fname)[0] + '.files')
    answers = parse_answer_file(ans_fname)
    
    with open(html_path, 'r', encoding='gbk', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    ps = soup.find_all('p')
    paragraphs = []
    for p in ps:
        raw_text = clean_txt(p.get_text())
        imgs = []
        for img in p.find_all('img'):
            src = img.get('src')
            if src and 'image001' not in src:
                base_img = os.path.basename(src)
                src_path = os.path.join(files_dir, base_img)
                if os.path.exists(src_path):
                    dest_name = f"{paper_id}_{base_img}"
                    dest_path = os.path.join(IMG_DIR, dest_name)
                    shutil.copy2(src_path, dest_path)
                    imgs.append(f"data/images/{dest_name}")
        paragraphs.append({'text': raw_text, 'imgs': imgs})

    start_collecting = False
    is_judge = False
    questions_raw = {}
    current_q_num = None
    current_paras = []
    
    for p in paragraphs:
        text = p['text']
        if '单项选择' in text:
            start_collecting = True
            is_judge = False
            continue
        if '判断题' in text:
            is_judge = True
            continue
        if not start_collecting:
            continue
            
        m = re.match(r'^(\d{1,3})[、\.\s](.*)', text, re.S)
        if m:
            num = int(m.group(1))
            if (not is_judge and 1 <= num <= 160) or (is_judge and 161 <= num <= 200):
                if current_q_num is not None:
                    questions_raw[current_q_num] = current_paras
                current_q_num = num
                rest = m.group(2).strip()
                current_paras = [{'text': rest, 'imgs': p['imgs']}]
                continue
                
        if current_q_num is not None:
            current_paras.append(p)

    if current_q_num is not None:
        questions_raw[current_q_num] = current_paras

    questions = []
    for idx in range(1, 201):
        paras = questions_raw.get(idx, [])
        ans = answers.get(idx, '')
        is_j = (idx >= 161)
        
        all_text = '\n'.join([p['text'] for p in paras if p['text']]).strip()
        all_imgs = []
        for p in paras:
            all_imgs.extend(p['imgs'])
            
        if is_j:
            content = all_text
            content = re.sub(r'^[（\(]\s*[）\)]\s*', '', content).strip()
            norm_ans = '√' if ans in ['√', '对', 'A'] else '×'
            q_obj = {
                "index": idx,
                "type": "judge",
                "score": 0.5,
                "content": content,
                "options": ["正确 (√)", "错误 (×)"],
                "answer": norm_ans,
                "images": all_imgs
            }
        else:
            stem, opts = extract_options(all_text)
            if not opts:
                opts = ["A、", "B、", "C、", "D、"]
            q_obj = {
                "index": idx,
                "type": "choice",
                "score": 0.5,
                "content": stem,
                "options": opts,
                "answer": ans,
                "images": all_imgs
            }
        questions.append(q_obj)

    return {
        "id": paper_id,
        "name": paper_name,
        "total": len(questions),
        "questions": questions
    }

def parse_2024_sim_paper():
    path = os.path.join('_extracted', '2024年11月8日电工高级工理论考试模拟卷.txt')
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    positions = []
    curr_pos = 0
    for i in range(1, 201):
        m = re.search(r'(?:^|\n|\r|[^\d])' + str(i) + r'[、\.]', text[curr_pos:])
        if not m:
            break
        actual_pos = curr_pos + m.start()
        if m.group(0)[0] in '\n\r ' or not m.group(0)[0].isdigit():
            actual_pos += 1
        positions.append((i, actual_pos))
        curr_pos = actual_pos + len(str(i)) + 1

    questions = []
    for idx in range(len(positions)):
        i, pos = positions[idx]
        end_pos = positions[idx+1][1] if idx + 1 < len(positions) else len(text)
        block = text[pos:end_pos].strip()
        block = re.sub(r'^\d{1,3}\s*[、\.]\s*', '', block).strip()
        
        ans_m = re.search(r'答案[：:]\s*([A-D√×])', block)
        ans = ans_m.group(1) if ans_m else ''
        block_clean = re.sub(r'答案[：:]\s*[A-D√×].*', '', block, flags=re.S).strip()
        
        is_j = (i >= 161)
        if is_j:
            content = re.sub(r'\(判断题\)', '', block_clean).strip()
            content = re.sub(r'^[（\(]\s*[）\)]\s*', '', content)
            content = re.sub(r'[A-D][、\.\s][√×对错].*', '', content, flags=re.S).strip()
            norm_ans = '√' if ans in ['A', '√'] else '×'
            q_obj = {
                "index": i,
                "type": "judge",
                "score": 0.5,
                "content": content,
                "options": ["正确 (√)", "错误 (×)"],
                "answer": norm_ans,
                "images": []
            }
        else:
            block_clean = re.sub(r'\(单选题\)', '', block_clean).strip()
            stem, opts = extract_options(block_clean)
            if not opts:
                opts = ["A、", "B、", "C、", "D、"]
            elif len(opts) == 3 and i == 156:
                opts.append("D、0.4s")
            q_obj = {
                "index": i,
                "type": "choice",
                "score": 0.5,
                "content": stem,
                "options": opts,
                "answer": ans,
                "images": []
            }
        questions.append(q_obj)

    return {
        "id": "paper_2024",
        "name": "2024年11月电工高级工理论考试模拟卷",
        "total": len(questions),
        "questions": questions
    }

def build_all():
    papers = []
    
    p1 = parse_html_paper('试卷正文.html', '答案.txt', 'paper_1', '维修电工高级理论知识试卷(一)')
    papers.append(p1)
    
    p2 = parse_html_paper('试卷正文(1).html', '答案(1).txt', 'paper_2', '维修电工高级理论知识试卷(二)')
    papers.append(p2)
    
    p3 = parse_html_paper('试卷正文(2).html', '答案(2).txt', 'paper_3', '维修电工高级理论知识试卷(三)')
    papers.append(p3)
    
    p4 = parse_html_paper('维修电工高级理论试卷正文.html', '维修电工高级理论答案.txt', 'paper_4', '维修电工高级理论知识试卷(四)')
    papers.append(p4)
    
    p5 = parse_2024_sim_paper()
    papers.append(p5)
    
    out_json = os.path.join(DATA_DIR, 'questions_db.json')
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(papers, f, ensure_ascii=False, indent=2)
        
    out_js = os.path.join(DATA_DIR, 'questions_db.js')
    with open(out_js, 'w', encoding='utf-8') as f:
        f.write('window.EXAM_PAPERS = ' + json.dumps(papers, ensure_ascii=False, indent=2) + ';\n')
        
    print(f"Build complete! Total papers: {len(papers)}")
    for p in papers:
        print(f"  {p['id']}: {p['name']} -> {p['total']} questions (images in paper: {sum(len(q['images']) for q in p['questions'])})")

if __name__ == '__main__':
    build_all()
