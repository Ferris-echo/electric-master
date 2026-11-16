const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const WEB_DIR = path.join(ROOT_DIR, 'web');

const rawText = fs.readFileSync(path.join(DATA_DIR, '2026_kpy_paper.txt'), 'utf8').replace(/\r\n/g, '\n');

const splitMarker = '## 二、多选题';
const splitIdx = rawText.indexOf(splitMarker);
if (splitIdx === -1) throw new Error('Missing multiple choice section');

const singleSection = rawText.slice(0, splitIdx);
const multiSection = rawText.slice(splitIdx);

function parseSection(sectionText, expectedType, expectedCount) {
    // Strip section heading line
    const lines = sectionText.split('\n').filter(l => !l.trim().startsWith('## '));
    const cleanText = lines.join('\n');

    // Split by question start: line starting with "<num>. "
    const blocks = cleanText.split(/(?:^|\n)(?=\d+\.\s)/).map(b => b.trim()).filter(Boolean);
    if (blocks.length !== expectedCount) {
        throw new Error(`Expected ${expectedCount} ${expectedType} questions, got ${blocks.length}`);
    }

    const parsed = [];
    blocks.forEach((block, i) => {
        const expectedNum = i + 1;
        const numMatch = block.match(/^(\d+)\.\s*([\s\S]*)$/);
        if (!numMatch) throw new Error(`Failed to match number in block: ${block.slice(0, 40)}`);
        const num = parseInt(numMatch[1], 10);
        if (num !== expectedNum) {
            throw new Error(`Expected question number ${expectedNum}, got ${num}`);
        }
        const rest = numMatch[2].trim();

        // Extract answer line
        const ansMatch = rest.match(/(?:\*\*)?参考答案[：:]\s*([A-Za-z]+)(?:\*\*)?\s*$/);
        if (!ansMatch) {
            throw new Error(`Missing answer in ${expectedType} Q${num}: ${rest}`);
        }
        const answer = ansMatch[1].trim().toUpperCase().split('').sort().join('');
        const bodyBeforeAns = rest.slice(0, ansMatch.index).trim();

        // Split stem and options A. B. C. D. (E.)
        const optParts = bodyBeforeAns.split(/\n(?=[A-E]\.\s*)/);
        const stem = optParts[0].trim();
        const options = optParts.slice(1).map(o => o.replace(/^[A-E]\.\s*/, '').trim());

        if (options.length < 4 || options.length > 5) {
            throw new Error(`Invalid options count (${options.length}) in ${expectedType} Q${num}`);
        }
        options.forEach((o, oi) => {
            if (!o) throw new Error(`Empty option ${oi} in ${expectedType} Q${num}`);
        });

        // Verify every letter in answer corresponds to a valid option index
        for (const ch of answer) {
            const idx = ch.charCodeAt(0) - 65;
            if (idx < 0 || idx >= options.length) {
                throw new Error(`Answer letter '${ch}' out of range (${options.length} opts) in ${expectedType} Q${num}`);
            }
        }

        parsed.push({
            num,
            type: expectedType,
            score: expectedType === 'multiple' ? 1.0 : 0.5,
            content: stem,
            options,
            answer,
            images: []
        });
    });

    return parsed;
}

const choices = parseSection(singleSection, 'choice', 131);
const multiples = parseSection(multiSection, 'multiple', 45);

const allQuestions = [...choices, ...multiples].map((q, idx) => ({
    index: idx + 1,
    type: q.type,
    score: q.score,
    content: q.content,
    options: q.options,
    answer: q.answer,
    images: q.images
}));

const paperObj = {
    id: 'paper_2026_kpy',
    name: '考评员理论模拟卷',
    total: allQuestions.length,
    questions: allQuestions
};

fs.writeFileSync(path.join(DATA_DIR, 'paper_2026_kpy.json'), JSON.stringify(paperObj, null, 2), 'utf8');

// Sync into questions_db.json, data/questions_db.js, web/questions_db.js
const dbPath = path.join(DATA_DIR, 'questions_db.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
db = db.filter(p => p.id !== 'paper_2026_kpy');
db.push(paperObj);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
const jsContent = 'window.EXAM_PAPERS = ' + JSON.stringify(db, null, 2) + ';\n';
fs.writeFileSync(path.join(DATA_DIR, 'questions_db.js'), jsContent, 'utf8');
fs.writeFileSync(path.join(WEB_DIR, 'questions_db.js'), jsContent, 'utf8');

const totalQ = db.reduce((s, p) => s + p.questions.length, 0);
console.log(`SUCCESS! Parsed paper_2026_kpy (${allQuestions.length} Qs: ${choices.length} choice + ${multiples.length} multiple).`);
console.log(`Database updated! Total papers: ${db.length}, Total questions: ${totalQ}`);
