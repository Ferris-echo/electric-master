const fs = require('fs');
const vm = require('vm');

// Also read questions_db.json directly
const papers = JSON.parse(fs.readFileSync('data/questions_db.json', 'utf8'));
console.log('Successfully loaded questions_db.json. Total papers:', papers.length);

const appJs = fs.readFileSync('web/app.js', 'utf8');
const start = appJs.indexOf('// --- 计算机程序代码块与高亮格式化核心引擎 ---');
const end = appJs.indexOf('// --- 错题本单独删除单题记录核心逻辑 ---');
const fnCode = appJs.slice(start, end);

// Sandbox context
const sandbox = {
    state: {
        activeModuleId: '',
        selectedSimDate: null,
        sessionQuestions: [],
        currentQuestionIndex: -1
    },
    window: {},
    navigator: { clipboard: { writeText: () => Promise.resolve() } },
    showToast: () => {}
};

vm.createContext(sandbox);
vm.runInContext(fnCode, sandbox);

console.log('Testing rendering across all papers...');

// 1. Check options in all papers: none should have code tags or backticks
let totalOptionsTested = 0;
papers.forEach(p => {
    p.questions.forEach(q => {
        (q.options || []).forEach(opt => {
            totalOptionsTested++;
            if (opt.includes('`') || opt.includes('code-card') || opt.includes('q-inline-code')) {
                throw new Error(`Option in ${p.id} Q${q.index} contains code formatting: ${opt}`);
            }
        });
    });
});
console.log(`PASS: All ${totalOptionsTested} options across all papers are clean text!`);

// 2. Check other papers: NONE should render code-card-wrapper
papers.filter(p => p.id !== 'paper_2026_1028').forEach(p => {
    sandbox.state.activeModuleId = p.id;
    p.questions.forEach(q => {
        const qObj = { ...q, paperId: p.id };
        const rendered = sandbox.formatQuestionContent(q.content, qObj);
        if (rendered.includes('code-card-wrapper')) {
            throw new Error(`Leak detected! Paper ${p.id} Q${q.index} rendered code-card-wrapper!`);
        }
    });
});
console.log('PASS: Zero code cards in any other paper (paper_1~4, 2024, 1021, 1022, 1023)!');

// 3. Check paper_2026_1028: EXACTLY the 13 questions have code-card-wrapper
const p1028 = papers.find(p => p.id === 'paper_2026_1028');
sandbox.state.activeModuleId = 'paper_2026_1028';
const expectedCodeQs = [16, 47, 50, 58, 72, 100, 105, 116, 124, 130, 132, 141, 150];
const actualCodeQs = [];

p1028.questions.forEach(q => {
    const qObj = { ...q, paperId: 'paper_2026_1028' };
    const rendered = sandbox.formatQuestionContent(q.content, qObj);
    if (rendered.includes('code-card-wrapper')) {
        actualCodeQs.push(q.index);
    }
});

console.log('Actual code questions in 1028:', actualCodeQs);
console.log('Expected code questions in 1028:', expectedCodeQs);

if (JSON.stringify(actualCodeQs) !== JSON.stringify(expectedCodeQs)) {
    throw new Error(`Mismatch in 1028 code questions! Expected: ${expectedCodeQs}, Actual: ${actualCodeQs}`);
}
console.log('PASS: EXACTLY the 13 genuine code questions in 10.28 have code cards, and 0 others!');

console.log('====================================================');
console.log('ALL STRICT SPECIFICATION VALIDATIONS SUCCEEDED! 🚀');
console.log('====================================================');
