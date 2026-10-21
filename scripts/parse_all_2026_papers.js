const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const WEB_DIR = path.join(ROOT_DIR, 'web');

const PAPERS_CONFIG = [
  {
    file: '2026_10_21_sim_paper.txt',
    id: 'paper_2026_1021',
    name: '2026年10月21日模拟卷(精简版)',
    date: '1021'
  },
  {
    file: '2026_10_22_sim_paper.txt',
    id: 'paper_2026_1022',
    name: '2026年10月22日模拟卷(精简版)',
    date: '1022'
  },
  {
    file: '2026_10_23_sim_paper.txt',
    id: 'paper_2026_1023',
    name: '2026年10月23日模拟卷(精简版)',
    date: '1023'
  },
  {
    file: '2026_10_28_sim_paper.txt',
    id: 'paper_2026_1028',
    name: '2026年10月28日模拟卷(精简版)',
    date: '1028'
  }
];

function parsePaper(cfg) {
  const filePath = path.join(DATA_DIR, cfg.file);
  let text = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Fix typo in 10-23 Q105: missing "D、" before "以上都是"
  text = text.replace(/C、电压负反馈过强等[\s\n]*以上都是/, 'C、电压负反馈过强等\nD、以上都是');

  const re = /(\d+)[、\.]([\s\S]*?)(?:答案[：:])\s*([A-Za-z√×对错]+)/g;
  let m;
  const questions = [];

  while ((m = re.exec(text)) !== null) {
    const idx = parseInt(m[1], 10);
    const body = m[2].trim();
    const rawAns = m[3].trim().toUpperCase();

    let qType = 'choice';
    if (idx > 170) qType = 'judge';
    else if (idx > 150) qType = 'multiple';

    let content = '';
    let opts = [];
    let normAns = rawAns;

    if (qType === 'judge') {
      let stem = body.replace(/[\(（]判断题[\)）]/g, '').trim();
      stem = stem.replace(/^[（\(]\s*[）\)]\s*/, '').trim();
      stem = stem.replace(/[A-Da-d][、\.\s]*[√×对错].*$/s, '').trim();
      content = stem;
      opts = ['正确', '错误'];
      normAns = (['A', '√', '对'].includes(rawAns)) ? '√' : '×';
    } else if (qType === 'multiple') {
      let stemPart = body.replace(/[\(（]多选题[\)）]/g, '').trim();
      const parts = stemPart.split(/(?:^|[\s\n\r])([A-E])[、\.\s]/);
      content = parts[0].trim();
      for (let i = 1; i < parts.length; i += 2) {
        opts.push(parts[i + 1].trim().replace(/\s+/g, ' '));
      }
      normAns = rawAns.split('').sort().join('');
    } else {
      let stemPart = body.replace(/[\(（]单选题[\)）]/g, '').trim();
      const parts = stemPart.split(/(?:^|[\s\n\r])([A-D])[、\.\s]/);
      content = parts[0].trim();
      for (let i = 1; i < parts.length; i += 2) {
        opts.push(parts[i + 1].trim().replace(/\s+/g, ' '));
      }
      normAns = rawAns;
    }

    questions.push({
      index: idx,
      type: qType,
      score: qType === 'multiple' ? 1.0 : 0.5,
      content: content,
      options: opts,
      answer: normAns,
      images: []
    });
  }

  if (questions.length !== 210) {
    throw new Error(`Paper ${cfg.id} expected 210 questions, got ${questions.length}`);
  }

  return {
    id: cfg.id,
    name: cfg.name,
    total: questions.length,
    questions: questions
  };
}

function main() {
  console.log('Parsing 2026 mock exam papers...');
  const newPapers = PAPERS_CONFIG.map(cfg => {
    const paper = parsePaper(cfg);
    console.log(`Parsed ${paper.id}: ${paper.name} (${paper.total} Qs)`);
    // Save individual paper JSON
    fs.writeFileSync(
      path.join(DATA, `${paper.id}.json`),
      JSON.stringify(paper, null, 2),
      'utf8'
    );
    return paper;
  });

  // Read existing questions_db.json
  const dbPath = path.join(DATA_DIR, 'questions_db.json');
  let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // Keep only paper_1 through paper_5 (历年1000题)
  db = db.filter(p => !p.id.startsWith('paper_2026'));

  // Add the 3 new papers
  newPapers.forEach(p => db.push(p));

  // Write questions_db.json
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

  // Write data/questions_db.js
  const jsContent = 'window.EXAM_PAPERS = ' + JSON.stringify(db, null, 2) + ';\n';
  fs.writeFileSync(path.join(DATA_DIR, 'questions_db.js'), jsContent, 'utf8');

  // Write web/questions_db.js
  fs.writeFileSync(path.join(WEB_DIR, 'questions_db.js'), jsContent, 'utf8');

  const totalQuestions = db.reduce((sum, p) => sum + p.total, 0);
  console.log(`Database successfully updated! Total papers: ${db.length}, Total questions: ${totalQuestions}`);
  db.forEach(p => {
    console.log(`  - [${p.id}] ${p.name}: ${p.total} Qs`);
  });
}

const DATA = DATA_DIR;
main();
