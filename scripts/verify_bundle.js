const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');

// 1. Verify EXAM_PAPERS inlined
const match = html.match(/window\.EXAM_PAPERS\s*=\s*(\[[\s\S]*?\]);/);
if (!match) {
    console.error('FAIL: window.EXAM_PAPERS not found');
    process.exit(1);
}
const papers = JSON.parse(match[1]);
console.log('Total papers in bundle:', papers.length);
let totalQ = 0;
papers.forEach(p => {
    console.log(`- [${p.id}] ${p.name}: ${p.questions.length} questions`);
    totalQ += p.questions.length;
});
if (totalQ !== 1630) {
    console.error('FAIL: expected 1630 questions, got', totalQ);
    process.exit(1);
}
console.log('PASS: Exact 1630 questions verified across 8 papers!');

// 2. Check 2026 3-day papers isolation & question types
const simDateIds = ['paper_2026_1021', 'paper_2026_1022', 'paper_2026_1023'];
for (const pid of simDateIds) {
    const p = papers.find(item => item.id === pid);
    if (!p) {
        console.error(`FAIL: ${pid} not found in database`);
        process.exit(1);
    }
    const choices = p.questions.filter(q => q.type === 'choice');
    const multiples = p.questions.filter(q => q.type === 'multiple');
    const judges = p.questions.filter(q => q.type === 'judge');
    console.log(`${pid} breakdown: choice=${choices.length}, multiple=${multiples.length}, judge=${judges.length}`);
    if (choices.length !== 150 || multiples.length !== 20 || judges.length !== 40) {
        console.error(`FAIL: incorrect question counts in ${pid}`);
        process.exit(1);
    }
    // Check multiple options
    const m0 = multiples[0];
    if (m0.options.length < 4 || !m0.answer) {
        console.error(`FAIL: multiple question invalid in ${pid}`);
        process.exit(1);
    }
}
console.log('PASS: All 3 2026 mock exam papers have exact 150 single + 20 multi + 40 judge questions!');

// 3. Verify HTML components
const requiredElements = [
    'id="modal-welcome-date"',
    'data-sim-date="1021"',
    'data-sim-date="1022"',
    'data-sim-date="1023"',
    'id="btn-reselect-sim-date"',
    'id="btn-header-recite-toggle"',
    'id="btn-mobile-recite"',
    'data-module-id="paper_2026_all"',
    'data-module-id="paper_2026_choice"',
    'data-module-id="paper_2026_multiple"',
    'data-module-id="paper_2026_judge"',
    'data-module-id="paper_2026_exam"'
];

for (const elem of requiredElements) {
    if (!html.includes(elem)) {
        console.error('FAIL: missing required HTML element: ' + elem);
        process.exit(1);
    }
}
console.log('PASS: All required interactive elements present in bundle!');

// 4. Verify quick peek answer button in JS
if (!html.includes('btn-quick-peek-answer')) {
    console.error('FAIL: missing btn-quick-peek-answer logic in bundle');
    process.exit(1);
}
console.log('PASS: btn-quick-peek-answer button integrated in bundle!');

console.log('==================================================');
console.log('🎉 ALL 1630-QUESTION BUNDLE VERIFICATION CHECKS PASSED!');
console.log('==================================================');
