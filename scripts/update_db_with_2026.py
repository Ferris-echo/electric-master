import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
WEB_DIR = os.path.join(BASE_DIR, 'web')

def update_db():
    db_path = os.path.join(DATA_DIR, 'questions_db.json')
    paper2026_path = os.path.join(DATA_DIR, 'paper_2026.json')

    with open(db_path, 'r', encoding='utf-8') as f:
        papers = json.load(f)

    with open(paper2026_path, 'r', encoding='utf-8') as f:
        paper_2026 = json.load(f)

    # Filter out existing paper_2026 if present
    papers = [p for p in papers if p['id'] != 'paper_2026']
    papers.append(paper_2026)

    # Write to questions_db.json
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(papers, f, ensure_ascii=False, indent=2)

    # Write to data/questions_db.js
    with open(os.path.join(DATA_DIR, 'questions_db.js'), 'w', encoding='utf-8') as f:
        f.write('window.EXAM_PAPERS = ' + json.dumps(papers, ensure_ascii=False, indent=2) + ';\n')

    # Write to web/questions_db.js
    with open(os.path.join(WEB_DIR, 'questions_db.js'), 'w', encoding='utf-8') as f:
        f.write('window.EXAM_PAPERS = ' + json.dumps(papers, ensure_ascii=False, indent=2) + ';\n')

    print(f"Updated questions_db.json and questions_db.js with {len(papers)} papers:")
    total_q = 0
    for p in papers:
        print(f"  - {p['id']}: {p['name']} ({p['total']} Qs)")
        total_q += p['total']
    print(f"Total questions in database: {total_q}")

if __name__ == '__main__':
    update_db()
