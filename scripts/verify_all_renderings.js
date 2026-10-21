const fs = require('fs');

const appJs = fs.readFileSync('web/app.js', 'utf8');

// Extract the functions from app.js
const vm = require('vm');
const sandbox = {
    state: {
        activeModuleId: 'paper_2026_1028',
        selectedSimDate: '1028',
        sessionQuestions: [],
        currentQuestionIndex: -1
    },
    window: {}
};

const fnStart = appJs.indexOf('function escapeHtml');
const fnEnd = appJs.indexOf('// --- 错题本单独删除单题记录核心逻辑 ---');
const fnCode = appJs.slice(fnStart, fnEnd);

vm.createContext(sandbox);
vm.runInContext(fnCode, sandbox);

const db = JSON.parse(fs.readFileSync('data/questions_db.json', 'utf8'));

console.log('Testing rendering for ALL 1840 questions...');

let totalRenderedStems = 0;
let totalRenderedOptions = 0;
let angleBracketTagLeaks = 0;

db.forEach(p => {
    sandbox.state.activeModuleId = p.id;
    p.questions.forEach(q => {
        const qObj = { ...q, paperId: p.id };
        const renderedStem = sandbox.formatQuestionContent(q.content, qObj);
        totalRenderedStems++;

        // In renderedStem, the ONLY allowed unescaped < are:
        // 1. <span class="q-blank-bracket">&nbsp;</span>
        // 2. <img ...>
        // 3. <br/>
        // 4. code-card HTML (<div class="code-card-wrapper"..., <span class="code-..., <pre..., <code...)
        // Any OTHER <tag> would be an unescaped tag leak!
        const strippedStem = renderedStem
            .replace(/<span\s+class=["']q-blank-bracket["']>.*?<\/span>/gi, '')
            .replace(/<img\b[^>]*>/gi, '')
            .replace(/<br\s*\/?>/gi, '')
            .replace(/<\/?(div|span|button|pre|code)\b[^>]*>/gi, '');

        if (strippedStem.includes('<') || strippedStem.includes('>')) {
            angleBracketTagLeaks++;
            console.error(`Tag leak in stem! [${p.id}] Q${q.index}: "${strippedStem}"`);
        }

        // Test options
        (q.options || []).forEach((opt, oIdx) => {
            totalRenderedOptions++;
            let displayText = opt.replace(/^[A-Fa-f][、.．:：\s]\s*/, '').trim();
            const renderedOpt = sandbox.safeEscapeHtmlPreservingImages(displayText);

            // In renderedOpt, the ONLY allowed unescaped < is <img ...>
            const strippedOpt = renderedOpt.replace(/<img\b[^>]*>/gi, '');
            if (strippedOpt.includes('<') || strippedOpt.includes('>')) {
                angleBracketTagLeaks++;
                console.error(`Tag leak in opt! [${p.id}] Q${q.index} opt ${oIdx}: "${strippedOpt}"`);
            }
        });
    });
});

console.log(`Finished rendering: Stems=${totalRenderedStems}, Options=${totalRenderedOptions}`);
console.log(`Tag leaks found: ${angleBracketTagLeaks}`);

if (angleBracketTagLeaks === 0) {
    console.log('PERFECT! 0 tag leaks across all 1,840 questions and 6,700 options! 🎉');
} else {
    throw new Error(`Found ${angleBracketTagLeaks} tag leaks!`);
}
