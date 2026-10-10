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
    t = re.sub(r'[\r\n]+', ' ', t)
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
    processed_paras = []
    
    for p in ps:
        # replace img tags with semantic placeholders
        for img in p.find_all('img'):
            src = img.get('src')
            if not src or 'image001' in src:
                img.decompose()
                continue
            base_img = os.path.basename(src)
            src_path = os.path.join(files_dir, base_img)
            if os.path.exists(src_path):
                dest_name = f"{paper_id}_{base_img}"
                dest_path = os.path.join(IMG_DIR, dest_name)
                shutil.copy2(src_path, dest_path)
                
                w = int(img.get('width', 0) or 0)
                h = int(img.get('height', 0) or 0)
                # 电气原理图/梯形图大图：h >= 40 且 (w >= 90 或以 jpg 格式存储)
                # 公式/符号小图：h < 40（即使 w 较宽也是单行公式）
                is_circuit = (h >= 40 and (w >= 90 or base_img.endswith('.jpg')))
                img_rel = f"data/images/{dest_name}"
                
                if is_circuit:
                    img.replace_with(f" __CIRCUIT_IMG:{img_rel}__ ")
                else:
                    img.replace_with(f" __INLINE_IMG:{img_rel}__ ")
                    
        txt = clean_txt(p.get_text())
        processed_paras.append(txt)

    # Group by question number
    start_collecting = False
    is_judge = False
    questions_raw = {}
    current_q_num = None
    current_texts = []
    
    for txt in processed_paras:
        if '单项选择' in txt:
            start_collecting = True
            is_judge = False
            continue
        if '判断题' in txt:
            is_judge = True
            continue
        if not start_collecting:
            continue
            
        m = re.match(r'^(\d{1,3})[、\.\s](.*)', txt, re.S)
        if m:
            num = int(m.group(1))
            if (not is_judge and 1 <= num <= 160) or (is_judge and 161 <= num <= 200):
                if current_q_num is not None:
                    questions_raw[current_q_num] = current_texts
                current_q_num = num
                current_texts = [m.group(2).strip()]
                continue
                
        if current_q_num is not None and txt:
            current_texts.append(txt)

    if current_q_num is not None:
        questions_raw[current_q_num] = current_texts

    questions = []
    for idx in range(1, 201):
        texts = questions_raw.get(idx, [])
        ans = answers.get(idx, '')
        is_j = (idx >= 161)
        full_text = '\n'.join(texts).strip()
        
        # 1. 抽取所有电气大原理图 (如果有)
        circuit_imgs = re.findall(r'__CIRCUIT_IMG:(.*?)__', full_text)
        # 从文字流中剔除电路大图标记，避免污染选项或题干排版
        cleaned_text = re.sub(r'__CIRCUIT_IMG:.*?__', '', full_text).strip()
        
        # 2. 将行内公式图片标记替换为自适应 HTML 标签
        def replace_inline(t):
            return re.sub(
                r'__INLINE_IMG:(.*?)__',
                r'<img class="inline-formula" src="\1" alt="电气符号" />',
                t
            )
            
        if is_j:
            content = replace_inline(cleaned_text)
            content = re.sub(r'^[（\(]\s*[）\)]\s*', '', content).strip()
            norm_ans = '√' if ans in ['√', '对', 'A'] else '×'
            q_obj = {
                "index": idx,
                "type": "judge",
                "score": 0.5,
                "content": content,
                "options": ["正确 (√)", "错误 (×)"],
                "answer": norm_ans,
                "images": circuit_imgs
            }
        else:
            stem, opts = extract_options(cleaned_text)
            stem = replace_inline(stem)
            clean_opts = [replace_inline(opt) for opt in opts]
            if not clean_opts:
                clean_opts = ["A、", "B、", "C、", "D、"]
            q_obj = {
                "index": idx,
                "type": "choice",
                "score": 0.5,
                "content": stem,
                "options": clean_opts,
                "answer": ans,
                "images": circuit_imgs
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
    print("Building precise question bank...")
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
        
    web_dir = os.path.join(os.path.dirname(__file__), 'web')
    os.makedirs(web_dir, exist_ok=True)
    web_js = os.path.join(web_dir, 'questions_db.js')
    with open(web_js, 'w', encoding='utf-8') as f:
        f.write('window.EXAM_PAPERS = ' + json.dumps(papers, ensure_ascii=False, indent=2) + ';\n')
        
    for sub in ['images', os.path.join('data', 'images')]:
        web_img_dir = os.path.join(web_dir, sub)
        if os.path.exists(web_img_dir):
            shutil.rmtree(web_img_dir)
        shutil.copytree(IMG_DIR, web_img_dir)
        
    print(f"Build complete! Total papers: {len(papers)}")
    for p in papers:
        circuit_count = sum(len(q['images']) for q in p['questions'])
        inline_opts = sum(1 for q in p['questions'] if any('inline-formula' in opt for opt in q['options']))
        print(f"  {p['id']}: {p['name']} -> {p['total']} Qs (Circuit Diagrams: {circuit_count}, Option Formula Qs: {inline_opts})")

if __name__ == '__main__':
    build_all()
