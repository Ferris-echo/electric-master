const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');

// 1. Verify EXAM_PAPERS inlined
const match = html.match(/window\.EXAM_PAPERS\s*=\s*(\[[\s\S]*?\]);/);
if (!match) {
    console.error('FAIL: window.EXAM_PAPERS not found');
    process.exit(1);
}
const papers = JSON.parse(match[1]);
console.log('Total papers:', papers.length);
let totalQ = 0;
papers.forEach(p => {
    console.log(`- ${p.id} (${p.name}): ${p.questions.length} questions`);
    totalQ += p.questions.length;
});
if (totalQ !== 1210) {
    console.error('FAIL: expected 1210 questions, got', totalQ);
    process.exit(1);
}

// 2. Check paper_2026 isolation & question types
const p2026 = papers.find(p => p.id === 'paper_2026');
if (!p2026) {
    console.error('FAIL: paper_2026 not found');
    process.exit(1);
}
const choices = p2026.questions.filter(q => q.type === 'choice');
const multiples = p2026.questions.filter(q => q.type === 'multiple');
const judges = p2026.questions.filter(q => q.type === 'judge');
console.log(`2026 breakdown: choice=${choices.length}, multiple=${multiples.length}, judge=${judges.length}`);
if (choices.length !== 150 || multiples.length !== 20 || judges.length !== 40) {
    console.error('FAIL: incorrect 2026 question counts');
    process.exit(1);
}

// Check sample multiple question
const sampleMulti = multiples[0];
console.log('Sample multiple question:', sampleMulti.index, sampleMulti.content, 'Ans:', sampleMulti.answer, 'Opts:', sampleMulti.options.length);

// 3. Verify HTML buttons
const requiredModIds = ['paper_2026_all', 'paper_2026_choice', 'paper_2026_multiple', 'paper_2026_judge', 'paper_2026_exam'];
for (const id of requiredModIds) {
    if (!html.includes('data-module-id="' + id + '"')) {
        console.error('FAIL: missing button data-module-id=' + id);
        process.exit(1);
    }
}
console.log('All required HTML entrypoints verified!');
console.log('ALL VERIFICATION CHECKS PASSED!');
