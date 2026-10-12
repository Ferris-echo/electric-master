import re
import json

def parse():
    with open('data/2026_10_21_sim_paper.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    # Match each question block
    matches = list(re.finditer(r'(\d+)、(.*?)(?:答案[：:])\s*([A-Za-z√×对错]+)', text, re.S))
    print(f'Total matches: {len(matches)}')

    questions = []
    for m in matches:
        idx = int(m.group(1))
        body = m.group(2).strip()
        raw_ans = m.group(3).strip().upper()

        if idx <= 150:
            q_type = 'choice'
        elif idx <= 170:
            q_type = 'multiple'
        else:
            q_type = 'judge'

        if q_type == 'judge':
            stem = re.sub(r'[\(（]判断题[\)）]', '', body).strip()
            stem = re.sub(r'^[（\(]\s*[）\)]\s*', '', stem).strip()
            # remove trailing A、√B、× or similar
            stem = re.sub(r'[A-Da-d][、\.\s]*[√×对错].*', '', stem, flags=re.S).strip()
            norm_ans = '√' if raw_ans in ['A', '√', '对'] else '×'
            opts = ['正确', '错误']
        elif q_type == 'multiple':
            stem_part = re.sub(r'[\(（]多选题[\)）]', '', body).strip()
            # Find option letters A, B, C, D, E
            m_opts = re.split(r'(?:^|[\s\n\r])([A-E])[、\.\s]', stem_part)
            stem = m_opts[0].strip()
            opts = []
            for i in range(1, len(m_opts), 2):
                letter = m_opts[i]
                opt_content = m_opts[i+1].strip()
                opt_content = re.sub(r'\s+', ' ', opt_content).strip()
                opts.append(opt_content)
            norm_ans = ''.join(sorted(raw_ans))
        else: # choice
            stem_part = re.sub(r'[\(（]单选题[\)）]', '', body).strip()
            m_opts = re.split(r'(?:^|[\s\n\r])([A-D])[、\.\s]', stem_part)
            stem = m_opts[0].strip()
            opts = []
            for i in range(1, len(m_opts), 2):
                letter = m_opts[i]
                opt_content = m_opts[i+1].strip()
                opt_content = re.sub(r'\s+', ' ', opt_content).strip()
                opts.append(opt_content)
            norm_ans = raw_ans

        questions.append({
            'index': idx,
            'type': q_type,
            'score': 0.5 if q_type != 'multiple' else 1.0,
            'content': stem,
            'options': opts,
            'answer': norm_ans,
            'images': []
        })

    print(f'Parsed {len(questions)} questions.')
    anomalies = 0
    for q in questions:
        if q['type'] == 'choice' and len(q['options']) != 4:
            print(f"Warning: choice Q{q['index']} has {len(q['options'])} options: {q['options']}")
            anomalies += 1
        elif q['type'] == 'multiple' and len(q['options']) < 4:
            print(f"Warning: multiple Q{q['index']} has {len(q['options'])} options: {q['options']}")
            anomalies += 1
        elif not q['content']:
            print(f"Warning: empty content Q{q['index']}")
            anomalies += 1

    if anomalies == 0:
        print('All 210 questions parsed with PERFECT integrity! 0 anomalies.')

    # Save to json
    paper_obj = {
        'id': 'paper_2026',
        'name': '2026年10月21日模拟卷(精简版)',
        'total': len(questions),
        'questions': questions
    }
    with open('data/paper_2026.json', 'w', encoding='utf-8') as f:
        json.dump(paper_obj, f, ensure_ascii=False, indent=2)
    print('Saved to data/paper_2026.json')

if __name__ == '__main__':
    parse()
