/**
 * 高级电工理论考试刷题核心引擎 (全功能终极全能版 4.0)
 * 核心特性：
 * 1. 各模块完全独立做题进度：全部(1000题)/单选(800题)/判断(200题)/5套真题分卷独立题号记忆、独立作答、独立统计
 * 2. 电路图专业级全功能视口：支持手机双指捏合无级缩放、笔记本触控板手势缩放(Pinch)、鼠标滚轮缩放、拖拽平移、双击重置
 * 3. 手机端大拇指左右滑动手势切题：左滑下一题，右滑上一题，单手刷题丝滑流畅
 * 4. 三大护眼阅读主题：经典浅白 / 护眼暖黄纸质 / 深色夜间模式，自由切换
 * 5. 字号无级调节：标准 / 大字 / 特大字，关照全年龄考生
 * 6. 答对自动翻页自定义开关：800ms 舒适微延时，可随时关闭完全手动控制；答错绝对不跳转
 * 7. 题号抽屉三态过滤器：全部题号 / 仅看未答 / 仅看错题
 * 8. 考点定向搜题：预置 PLC、晶闸管、电机调速、机床排故等热门考点标签一键检索
 * 9. 纯纯离线可运行，零外部网络依赖，数据完整持久化
 */
(function() {
    'use strict';

    // --- Lucide-style SVG 图标库 ---
    const Icons = {
        Lightning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        BookOpen: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
        CheckCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
        XCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
        RefreshCw: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,
        Trash2: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
        Trash: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
        AlertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
        Award: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
        Sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
        Download: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        Folder: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>`,
        FileText: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
        Grid: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
        Search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
        Star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        StarFilled: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#eab308" stroke="#ca8a04" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        Menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
        Eye: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
        Timer: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        X: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
    };

    function getIcon(name, className = '') {
        const raw = Icons[name];
        if (!raw) return '';
        return raw.replace('%CLASS%', className);
    }

    function safeSetHtml(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }

    // --- 全局飘浮 Toast 提示 ---
    let toastTimer = null;
    function showToast(msg) {
        const box = document.getElementById('toast-container');
        const content = document.getElementById('toast-content');
        if (!box || !content) return;
        content.innerHTML = `<span>${msg}</span>`;
        box.classList.remove('hidden');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            box.classList.add('hidden');
        }, 2200);
    }

    // --- 题库解析与扁平化 (1000 题完整收录) ---
    const rawPapers = window.EXAM_PAPERS || [];
    const all1000Questions = [];
    rawPapers.forEach((paper) => {
        paper.questions.forEach((q) => {
            all1000Questions.push({
                ...q,
                id: `${paper.id}_${q.index}`,
                paperId: paper.id,
                paperName: paper.name,
                globalIndex: all1000Questions.length + 1
            });
        });
    });

    // --- 状态定义 (各模块完全独立进度架构) ---
    const state = {
        activeModuleId: 'full_all',
        
        // 独立游标：记录用户在各个模块当前做到第几题
        moduleCursors: {
            'full_all': 0,
            'full_choice': 0,
            'full_judge': 0,
            'paper_2024': 0,
            'paper_1': 0,
            'paper_2': 0,
            'paper_3': 0,
            'paper_4': 0,
            'wrong': 0,
            'favorite': 0
        },

        // 独立答题记录：各个模块互不干扰！
        moduleAnswers: {
            'full_all': {},
            'full_choice': {},
            'full_judge': {},
            'paper_2024': {},
            'paper_1': {},
            'paper_2': {},
            'paper_3': {},
            'paper_4': {}
        },

        // 全局错题集与收藏集
        wrongQuestions: new Set(),
        favoriteQuestions: new Set(),

        reciteMode: false,
        autoAdvance: true, // 答对自动翻页开关 (默认开启)
        theme: 'light',    // 'light' | 'eye-care' | 'dark'
        fontSize: 'normal',// 'normal' | 'large' | 'huge'
        drawerFilter: 'all', // 'all' | 'unanswered' | 'wrong'

        // 考试模式专属临时会话
        examState: {
            activeQuestions: [],
            answers: {},
            secondsLeft: 7200,
            totalSeconds: 7200,
            timerInterval: null,
            isSubmitted: false
        }
    };

    // --- 本地持久化储存 ---
    const STORAGE_KEY_CURSORS = 'electrician_module_cursors_v4';
    const STORAGE_KEY_ANSWERS = 'electrician_module_answers_v4';
    const STORAGE_KEY_WRONGS  = 'electrician_user_wrongs_v4';
    const STORAGE_KEY_FAVS    = 'electrician_user_favs_v4';
    const STORAGE_KEY_RECITE  = 'electrician_recite_mode_v4';
    const STORAGE_KEY_AUTOADV = 'electrician_auto_advance_v4';
    const STORAGE_KEY_THEME   = 'electrician_theme_v4';
    const STORAGE_KEY_FONTSIZE= 'electrician_fontsize_v4';
    const STORAGE_KEY_ACTIVE_MODULE = 'electrician_active_module_v4';

    function loadSavedData() {
        try {
            const cursors = localStorage.getItem(STORAGE_KEY_CURSORS);
            if (cursors) Object.assign(state.moduleCursors, JSON.parse(cursors));

            const answers = localStorage.getItem(STORAGE_KEY_ANSWERS);
            if (answers) {
                const parsed = JSON.parse(answers);
                Object.keys(parsed).forEach(k => {
                    state.moduleAnswers[k] = parsed[k] || {};
                });
            }

            const wr = localStorage.getItem(STORAGE_KEY_WRONGS);
            if (wr) state.wrongQuestions = new Set(JSON.parse(wr));

            const fav = localStorage.getItem(STORAGE_KEY_FAVS);
            if (fav) state.favoriteQuestions = new Set(JSON.parse(fav));

            const rc = localStorage.getItem(STORAGE_KEY_RECITE);
            if (rc) state.reciteMode = JSON.parse(rc);

            const adv = localStorage.getItem(STORAGE_KEY_AUTOADV);
            if (adv !== null) state.autoAdvance = JSON.parse(adv);

            const th = localStorage.getItem(STORAGE_KEY_THEME);
            if (th) state.theme = th;

            const fs = localStorage.getItem(STORAGE_KEY_FONTSIZE);
            if (fs) state.fontSize = fs;

            const activeMod = localStorage.getItem(STORAGE_KEY_ACTIVE_MODULE);
            if (activeMod && (state.moduleCursors[activeMod] !== undefined || activeMod.startsWith('paper_'))) {
                state.activeModuleId = activeMod;
            }
        } catch(e) {
            console.error('Storage load error:', e);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY_CURSORS, JSON.stringify(state.moduleCursors));
            localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(state.moduleAnswers));
            localStorage.setItem(STORAGE_KEY_WRONGS, JSON.stringify([...state.wrongQuestions]));
            localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify([...state.favoriteQuestions]));
            localStorage.setItem(STORAGE_KEY_RECITE, JSON.stringify(state.reciteMode));
            localStorage.setItem(STORAGE_KEY_AUTOADV, JSON.stringify(state.autoAdvance));
            localStorage.setItem(STORAGE_KEY_THEME, state.theme);
            localStorage.setItem(STORAGE_KEY_FONTSIZE, state.fontSize);
            localStorage.setItem(STORAGE_KEY_ACTIVE_MODULE, state.activeModuleId);
        } catch(e) {
            console.error('Storage save error:', e);
        }
    }

    // --- 主题应用 ---
    function applyTheme(theme) {
        state.theme = theme;
        document.body.setAttribute('data-theme', theme);
        document.querySelectorAll('.theme-btn').forEach(btn => {
            const btnTheme = btn.getAttribute('data-theme');
            if (btnTheme === theme) {
                btn.className = "theme-btn px-2 py-1 rounded text-[11px] font-bold transition active:scale-95 bg-white text-blue-700 shadow-sm";
            } else {
                btn.className = "theme-btn px-2 py-1 rounded text-[11px] font-bold transition active:scale-95 text-gray-600 hover:text-gray-900";
            }
        });
        saveState();
    }

    // --- 字号应用 ---
    function applyFontSize(size) {
        state.fontSize = size;
        document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-huge');
        document.body.classList.add(`font-size-${size}`);
        document.querySelectorAll('.fontsize-btn').forEach(btn => {
            const btnSize = btn.getAttribute('data-fontsize');
            if (btnSize === size) {
                btn.className = "fontsize-btn px-2.5 py-1 rounded text-[11px] font-bold transition active:scale-95 bg-white text-blue-700 shadow-sm";
            } else {
                btn.className = "fontsize-btn px-2.5 py-1 rounded text-[11px] font-bold transition active:scale-95 text-gray-600 hover:text-gray-900";
            }
        });
        saveState();
    }

    // --- 获取当前模块的题目列表 ---
    function getModuleQuestions(moduleId) {
        if (moduleId === 'full_all') {
            return all1000Questions;
        } else if (moduleId === 'full_choice') {
            return all1000Questions.filter(q => q.type === 'choice');
        } else if (moduleId === 'full_judge') {
            return all1000Questions.filter(q => q.type === 'judge');
        } else if (moduleId.startsWith('paper_')) {
            return all1000Questions.filter(q => q.paperId === moduleId);
        } else if (moduleId === 'wrong') {
            return all1000Questions.filter(q => state.wrongQuestions.has(q.id));
        } else if (moduleId === 'favorite') {
            return all1000Questions.filter(q => state.favoriteQuestions.has(q.id));
        } else if (moduleId === 'exam_random' || moduleId === 'quick_quiz') {
            return state.examState.activeQuestions;
        }
        return all1000Questions;
    }

    function getActiveQuestions() {
        return getModuleQuestions(state.activeModuleId);
    }

    function getCurrentIndex() {
        const total = getActiveQuestions().length;
        if (total === 0) return 0;
        let idx = state.moduleCursors[state.activeModuleId];
        if (idx === undefined || idx < 0) idx = 0;
        if (idx >= total) idx = total - 1;
        state.moduleCursors[state.activeModuleId] = idx;
        return idx;
    }

    function setCurrentIndex(newIdx) {
        const total = getActiveQuestions().length;
        if (total === 0) {
            state.moduleCursors[state.activeModuleId] = 0;
            return;
        }
        state.moduleCursors[state.activeModuleId] = Math.max(0, Math.min(newIdx, total - 1));
        saveState();
    }

    function getCurrentAnswersMap() {
        if (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz') {
            return state.examState.answers;
        }
        if (!state.moduleAnswers[state.activeModuleId]) {
            state.moduleAnswers[state.activeModuleId] = {};
        }
        return state.moduleAnswers[state.activeModuleId];
    }

    function getPaperTitleInfo(paperId, rawName) {
        if (paperId === 'paper_2024') {
            return {
                badge: '2024模拟卷',
                title: '2024最新模拟卷',
                sub: '2024年11月高级电工理论考试模拟卷',
                color: 'text-blue-600 bg-blue-50'
            };
        }
        if (paperId === 'paper_1') {
            return {
                badge: '真题试卷一',
                title: '官方真题 · 试卷一',
                sub: '维修电工高级理论知识试卷 (一)',
                color: 'text-indigo-600 bg-indigo-50'
            };
        }
        if (paperId === 'paper_2') {
            return {
                badge: '真题试卷二',
                title: '官方真题 · 试卷二',
                sub: '维修电工高级理论知识试卷 (二)',
                color: 'text-emerald-600 bg-emerald-50'
            };
        }
        if (paperId === 'paper_3') {
            return {
                badge: '真题试卷三',
                title: '官方真题 · 试卷三',
                sub: '维修电工高级理论知识试卷 (三)',
                color: 'text-purple-600 bg-purple-50'
            };
        }
        if (paperId === 'paper_4') {
            return {
                badge: '真题试卷四',
                title: '官方真题 · 试卷四',
                sub: '维修电工高级理论知识试卷 (四)',
                color: 'text-cyan-600 bg-cyan-50'
            };
        }
        return {
            badge: '官方真题',
            title: rawName,
            sub: rawName,
            color: 'text-gray-600 bg-gray-50'
        };
    }

    function initIcons() {
        safeSetHtml('icon-lightning', getIcon('Lightning', 'w-6 h-6 text-yellow-400'));
        safeSetHtml('icon-lightning-mobile', getIcon('Lightning', 'w-5 h-5 text-yellow-300'));
        safeSetHtml('icon-search-mobile', getIcon('Search', 'w-5 h-5'));
        safeSetHtml('icon-menu-mobile', getIcon('Menu', 'w-5 h-5'));
        safeSetHtml('icon-close-sidebar', getIcon('X', 'w-5 h-5'));
        safeSetHtml('icon-search-btn', getIcon('Search', 'w-3.5 h-3.5'));
        safeSetHtml('icon-export', getIcon('Download', 'w-3.5 h-3.5'));
        safeSetHtml('icon-folder-all', getIcon('BookOpen', 'w-4 h-4 text-blue-600'));
        safeSetHtml('icon-folder-choice', getIcon('Folder', 'w-4 h-4 text-indigo-600'));
        safeSetHtml('icon-folder-judge', getIcon('Folder', 'w-4 h-4 text-cyan-600'));
        safeSetHtml('icon-award', getIcon('Award', 'w-5 h-5'));
        safeSetHtml('icon-sparkles', getIcon('Sparkles', 'w-4 h-4'));
        safeSetHtml('icon-alert-circle', getIcon('AlertCircle', 'w-4 h-4'));
        safeSetHtml('icon-star', getIcon('Star', 'w-4 h-4'));
        safeSetHtml('icon-eye', getIcon('Eye', 'w-4 h-4'));
        safeSetHtml('icon-refresh', getIcon('RefreshCw', 'w-3.5 h-3.5'));
        safeSetHtml('icon-trash', getIcon('Trash2', 'w-3.5 h-3.5'));
        safeSetHtml('icon-grid-btn', getIcon('Grid', 'w-4 h-4'));
        safeSetHtml('icon-timer', getIcon('Timer', 'w-4 h-4'));
        safeSetHtml('icon-grid-title', getIcon('Grid', 'w-5 h-5 text-blue-600'));
        safeSetHtml('icon-close-grid', getIcon('X', 'w-5 h-5'));
    }

    function updateAllModuleProgresses() {
        const fullModules = [
            { id: 'full_all', textId: 'prog-text-full-all', pctId: 'prog-pct-full-all', barId: 'prog-bar-full-all', total: 1000 },
            { id: 'full_choice', textId: 'prog-text-full-choice', pctId: 'prog-pct-full-choice', barId: 'prog-bar-full-choice', total: 800 },
            { id: 'full_judge', textId: 'prog-text-full-judge', pctId: 'prog-pct-full-judge', barId: 'prog-bar-full-judge', total: 200 }
        ];

        fullModules.forEach(m => {
            const answers = state.moduleAnswers[m.id] || {};
            const doneCount = Object.keys(answers).length;
            const pct = Math.round((doneCount / m.total) * 100);

            const elText = document.getElementById(m.textId);
            const elPct = document.getElementById(m.pctId);
            const elBar = document.getElementById(m.barId);

            if (elText) elText.textContent = `已刷 ${doneCount} / ${m.total} 题`;
            if (elPct) elPct.textContent = `${pct}%`;
            if (elBar) elBar.style.width = `${pct}%`;
        });

        const elWrong = document.getElementById('sidebar-wrong-count');
        if (elWrong) elWrong.textContent = `${state.wrongQuestions.size} 道待复习`;

        const elFav = document.getElementById('sidebar-fav-count');
        if (elFav) elFav.textContent = `${state.favoriteQuestions.size} 道重点题`;
    }

    function renderPapersList() {
        const container = document.getElementById('paper-list-container');
        if (!container) return;

        container.innerHTML = rawPapers.map((p) => {
            const isSelected = (state.activeModuleId === p.id);
            const activeClass = isSelected ? 'active ring-2 ring-blue-500/20' : '';
            const info = getPaperTitleInfo(p.id, p.name);
            
            const answers = state.moduleAnswers[p.id] || {};
            const doneCount = Object.keys(answers).length;
            const pct = Math.round((doneCount / 200) * 100);

            return `
                <button class="nav-item-btn w-full text-left p-3 rounded-2xl flex flex-col gap-1.5 transition-all border border-gray-100/80 bg-white hover:bg-slate-50 ${activeClass}" data-module-id="${p.id}">
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center gap-2 min-w-0">
                            <span class="p-1.5 rounded-lg ${info.color} flex-shrink-0">
                                ${getIcon('FileText', 'w-3.5 h-3.5')}
                            </span>
                            <span class="font-bold text-xs text-gray-800 leading-snug truncate">${info.title}</span>
                        </div>
                        <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold flex-shrink-0">200题</span>
                    </div>

                    <div class="text-[11px] text-gray-400 leading-tight pl-7 pr-1">
                        ${info.sub}
                    </div>

                    <div class="pl-7 pr-1 pt-0.5 w-full">
                        <div class="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                            <span>已刷 ${doneCount} / 200 题</span>
                            <span class="font-bold text-gray-500">${pct}%</span>
                        </div>
                        <div class="mini-progress-track w-full">
                            <div class="mini-progress-fill" style="width: ${pct}%"></div>
                        </div>
                    </div>
                </button>
            `;
        }).join('');

        container.querySelectorAll('button').forEach(btn => {
            btn.onclick = () => {
                const moduleId = btn.getAttribute('data-module-id');
                switchModule(moduleId);
                closeMobileSidebar();
            };
        });
    }

    function switchModule(newModuleId) {
        if (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz') {
            stopExamTimer();
        }

        state.activeModuleId = newModuleId;
        saveState();
        renderApp();
    }

    function startRandomExam(isQuick = false) {
        const allChoices = all1000Questions.filter(q => q.type === 'choice');
        const allJudges = all1000Questions.filter(q => q.type === 'judge');

        function shuffle(arr) {
            const a = [...arr];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        if (isQuick) {
            state.examState.activeQuestions = [...shuffle(allChoices).slice(0, 40), ...shuffle(allJudges).slice(0, 10)];
            state.examState.totalSeconds = 1800;
            state.activeModuleId = 'quick_quiz';
        } else {
            state.examState.activeQuestions = [...shuffle(allChoices).slice(0, 160), ...shuffle(allJudges).slice(0, 40)];
            state.examState.totalSeconds = 7200;
            state.activeModuleId = 'exam_random';
        }

        state.examState.answers = {};
        state.examState.isSubmitted = false;
        state.examState.secondsLeft = state.examState.totalSeconds;
        state.moduleCursors[state.activeModuleId] = 0;

        startExamTimer();
        renderApp();
    }

    function startExamTimer() {
        clearInterval(state.examState.timerInterval);
        updateTimerDisplay();

        state.examState.timerInterval = setInterval(() => {
            state.examState.secondsLeft--;
            updateTimerDisplay();
            if (state.examState.secondsLeft <= 0) {
                clearInterval(state.examState.timerInterval);
                alert('考试时间到！系统已为您自动交卷。');
                submitExam();
            }
        }, 1000);
    }

    function stopExamTimer() {
        clearInterval(state.examState.timerInterval);
        const timerBox = document.getElementById('exam-timer-box');
        const submitBtn = document.getElementById('btn-header-submit-exam');
        if (timerBox) timerBox.classList.add('hidden');
        if (submitBtn) submitBtn.classList.add('hidden');
    }

    function updateTimerDisplay() {
        const timerBox = document.getElementById('exam-timer-box');
        const timerText = document.getElementById('exam-timer-clock');
        const submitBtn = document.getElementById('btn-header-submit-exam');

        if (timerBox) {
            timerBox.classList.remove('hidden');
            timerBox.classList.add('flex');
        }
        if (submitBtn) submitBtn.classList.remove('hidden');

        const m = Math.floor(state.examState.secondsLeft / 60);
        const s = state.examState.secondsLeft % 60;
        if (timerText) {
            timerText.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
    }

    function submitExam() {
        stopExamTimer();
        state.examState.isSubmitted = true;

        const qs = state.examState.activeQuestions;
        let correctCount = 0;
        let wrongCount = 0;

        qs.forEach(q => {
            const userAns = state.examState.answers[q.id];
            if (userAns === q.answer) {
                correctCount++;
            } else {
                wrongCount++;
                if (userAns) {
                    state.wrongQuestions.add(q.id);
                }
            }
        });

        saveState();

        const totalScore = (state.activeModuleId === 'quick_quiz') ? (correctCount * 2) : (correctCount * 0.5);
        const fullScore = 100;
        const isPass = totalScore >= 60;

        document.getElementById('result-exam-title').textContent = (state.activeModuleId === 'quick_quiz') ? '碎片快速自测 (50题)' : '全真模拟考试 (200题)';
        document.getElementById('result-score-val').textContent = totalScore.toFixed(1);
        document.getElementById('result-full-score').textContent = `${fullScore} 分`;
        document.getElementById('result-correct-count').textContent = `${correctCount} 题`;
        document.getElementById('result-wrong-count').textContent = `${wrongCount} 题`;

        const badgeIcon = document.getElementById('result-badge-icon');
        const passPill = document.getElementById('result-pass-pill');
        if (isPass) {
            badgeIcon.textContent = '🎉';
            passPill.className = 'mt-3 px-4 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200';
            passPill.textContent = '考试及格 · 恭喜通过！';
        } else {
            badgeIcon.textContent = '💪';
            passPill.className = 'mt-3 px-4 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200';
            passPill.textContent = '成绩未达及格线，建议复习错题本！';
        }

        const elapsedSec = state.examState.totalSeconds - state.examState.secondsLeft;
        const eM = Math.floor(elapsedSec / 60);
        const eS = elapsedSec % 60;
        document.getElementById('result-time-text').textContent = `耗时：${eM}分${eS}秒`;

        document.getElementById('result-modal').classList.remove('hidden');
        renderApp();
    }

    // --- 页面整体渲染调度 ---
    function renderApp() {
        const activeQuestions = getActiveQuestions();
        const total = activeQuestions.length;
        const curIdx = getCurrentIndex();

        // 导航高亮态
        document.querySelectorAll('.nav-item-btn').forEach(btn => {
            const m = btn.getAttribute('data-mode');
            const f = btn.getAttribute('data-filter');
            const modId = btn.getAttribute('data-module-id');

            if (modId) {
                if (modId === state.activeModuleId) btn.classList.add('active');
                else btn.classList.remove('active');
            } else if (m === 'full') {
                if (state.activeModuleId === `full_${f}`) btn.classList.add('active');
                else btn.classList.remove('active');
            } else if (m === 'exam-random') {
                if (state.activeModuleId === 'exam_random') btn.classList.add('active');
                else btn.classList.remove('active');
            } else if (m === 'quick-quiz') {
                if (state.activeModuleId === 'quick_quiz') btn.classList.add('active');
                else btn.classList.remove('active');
            }
        });

        // 错题本与收藏夹按钮高亮
        const btnWrong = document.getElementById('btn-nav-wrong');
        const btnFav = document.getElementById('btn-nav-fav');
        if (state.activeModuleId === 'wrong') {
            btnWrong.classList.add('bg-orange-100', 'text-orange-800', 'font-bold');
        } else {
            btnWrong.classList.remove('bg-orange-100', 'text-orange-800', 'font-bold');
        }
        if (state.activeModuleId === 'favorite') {
            btnFav.classList.add('bg-yellow-100', 'text-yellow-800', 'font-bold');
        } else {
            btnFav.classList.remove('bg-yellow-100', 'text-yellow-800', 'font-bold');
        }

        renderPapersList();
        updateAllModuleProgresses();

        // 顶部标题胶囊徽章
        const moduleBadge = document.getElementById('badge-current-module');
        if (moduleBadge) {
            if (state.activeModuleId === 'full_all') {
                moduleBadge.textContent = '全部题库刷题 (1000题)';
                moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-700 shadow-sm';
            } else if (state.activeModuleId === 'full_choice') {
                moduleBadge.textContent = '单选题专练 (800题)';
                moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-700 shadow-sm';
            } else if (state.activeModuleId === 'full_judge') {
                moduleBadge.textContent = '判断题专练 (200题)';
                moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-100 text-cyan-800 shadow-sm';
            } else if (state.activeModuleId.startsWith('paper_')) {
                const info = getPaperTitleInfo(state.activeModuleId, '');
                moduleBadge.textContent = `${info.title} (200题)`;
                moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-green-100 text-green-700 shadow-sm';
            } else if (state.activeModuleId === 'exam_random') {
                moduleBadge.textContent = '全真模拟考场 (200题 · 限时120分)';
                moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 shadow-sm';
            } else if (state.activeModuleId === 'quick_quiz') {
                moduleBadge.textContent = '碎片快速自测 (50题 · 限时30分)';
                moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-orange-700 shadow-sm';
            } else if (state.activeModuleId === 'wrong') {
                moduleBadge.textContent = '错题回顾本';
                moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 shadow-sm';
            } else if (state.activeModuleId === 'favorite') {
                moduleBadge.textContent = '重点收藏夹';
                moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-yellow-100 text-yellow-800 shadow-sm';
            }
        }

        const curQnumEl = document.getElementById('text-current-qnum');
        const totQnumEl = document.getElementById('text-total-qnum');
        const pBar = document.getElementById('progress-bar');
        if (curQnumEl) curQnumEl.textContent = total > 0 ? (curIdx + 1) : 0;
        if (totQnumEl) totQnumEl.textContent = total;
        if (pBar) {
            const pPct = total > 0 ? Math.round(((curIdx + 1) / total) * 100) : 0;
            pBar.style.width = `${pPct}%`;
        }

        const reciteBadge = document.getElementById('badge-recite-status');
        if (reciteBadge) {
            const isExam = (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz');
            if (state.reciteMode && !isExam) {
                reciteBadge.classList.remove('hidden');
            } else {
                reciteBadge.classList.add('hidden');
            }
        }

        renderQuestionCard();
    }

    // --- 核心题目卡片渲染 ---
    function renderQuestionCard() {
        const container = document.getElementById('question-scroll-area');
        if (!container) return;

        const activeQuestions = getActiveQuestions();
        const total = activeQuestions.length;
        const curIdx = getCurrentIndex();

        if (total === 0) {
            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-gray-500 text-center p-8 animate-q-card">
                    <div class="mb-4">${getIcon('Award', 'w-16 h-16 text-yellow-500')}</div>
                    <p class="text-xl font-bold text-gray-800">当前分类暂无题目</p>
                    <p class="text-sm mt-1 text-gray-400">太棒了！所有题目均已掌握或列表为空。</p>
                    <button id="btn-empty-back-full" class="q-bounce-btn mt-5 px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 font-bold text-sm">
                        返回全部题库刷题
                    </button>
                </div>
            `;
            const backBtn = document.getElementById('btn-empty-back-full');
            if (backBtn) backBtn.onclick = () => switchModule('full_all');
            return;
        }

        const q = activeQuestions[curIdx];
        const answersMap = getCurrentAnswersMap();
        const selectedKey = answersMap[q.id];
        const isExamMode = (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz');
        const isExamOngoing = (isExamMode && !state.examState.isSubmitted);
        const hasAnswered = !!selectedKey;
        const isFeedback = hasAnswered && !isExamOngoing;
        const isCorrect = (selectedKey === q.answer);
        const isFav = state.favoriteQuestions.has(q.id);

        // 1. 电路图 / 原理图渲染 (统一置于顶栏轻提示，不再在每张图下冗余堆砌文字)
        let circuitImgHtml = '';
        const imgs = (q.images && q.images.length > 0) ? q.images : (q.image ? [q.image] : []);
        if (imgs.length > 0) {
            circuitImgHtml = `
                <div class="my-4 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                    <div class="flex items-center gap-2 mb-2.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                        <span>⚡ 电气原理图</span>
                        <span class="text-[11px] text-slate-500 dark:text-slate-400 font-normal">（点击图片可全屏无级缩放 / 触控板平移查看）</span>
                    </div>
                    <div class="flex flex-wrap gap-3">
                        ${imgs.map((imgSrc, i) => `
                            <div class="circuit-img-container cursor-zoom-in" data-img-src="${imgSrc}" title="点击放大图片">
                                <img src="${imgSrc}" alt="电路原理图" loading="lazy" />
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // 2. 选项列表渲染
        let optionsToRender = [];
        if (q.type === 'choice') {
            optionsToRender = (q.options && q.options.length > 0) ? q.options : ['A. 暂缺选项', 'B. 暂缺选项', 'C. 暂缺选项', 'D. 暂缺选项'];
        } else {
            optionsToRender = ['A. 正确', 'B. 错误'];
        }

        const optionsHtml = optionsToRender.map((optText, optIdx) => {
            let key = '';
            let displayText = optText;
            if (q.type === 'judge') {
                key = optText.includes('正确') ? '√' : '×';
                displayText = optText.includes('正确') ? '正确' : (optText.includes('错误') ? '错误' : optText);
            } else {
                const match = optText.trim().match(/^([A-Da-d])[、.．:：\s]/);
                const letters = ['A', 'B', 'C', 'D'];
                key = match ? match[1].toUpperCase() : (letters[optIdx] || 'A');
                // 剥离选项文字前缀中重复的 A、 / B、 / C、 / D、，避免与左侧徽章重复
                displayText = optText.replace(/^[A-Da-d][、.．:：\s]\s*/, '').trim();
            }

            const isSelected = (selectedKey === key);
            const isStandardAnswer = (q.answer === key);

            let btnClass = "w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group relative overflow-hidden q-bounce-btn ";
            let badgeClass = "w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold flex-shrink-0 transition-all ";
            let iconHtml = "";

            if (state.reciteMode && !isExamMode) {
                if (isStandardAnswer) {
                    btnClass += "border-green-500 bg-green-50 text-green-900 font-semibold shadow-sm";
                    badgeClass += "bg-green-600 text-white shadow-sm";
                    iconHtml = getIcon('CheckCircle', 'w-6 h-6 text-green-600 relative z-10 flex-shrink-0');
                } else {
                    btnClass += "border-gray-100 opacity-60 text-gray-500";
                    badgeClass += "bg-gray-100 text-gray-400";
                }
            } else if (isFeedback) {
                if (isStandardAnswer) {
                    btnClass += "border-green-500 bg-green-50 text-green-900 font-semibold shadow-sm";
                    if (isSelected) btnClass += " animate-q-correct";
                    badgeClass += "bg-green-600 text-white shadow-sm";
                    if (isSelected) badgeClass += " animate-q-badge";
                    iconHtml = getIcon('CheckCircle', 'w-6 h-6 text-green-600 relative z-10 flex-shrink-0');
                } else if (isSelected && !isStandardAnswer) {
                    btnClass += "border-red-500 bg-red-50 text-red-900 font-semibold shadow-sm animate-q-wrong";
                    badgeClass += "bg-red-600 text-white shadow-sm animate-q-badge";
                    iconHtml = getIcon('XCircle', 'w-6 h-6 text-red-600 relative z-10 flex-shrink-0');
                } else {
                    btnClass += "border-gray-100 opacity-50 text-gray-500";
                    badgeClass += "bg-gray-100 text-gray-400";
                }
            } else {
                if (isSelected) {
                    btnClass += "border-blue-600 bg-blue-50 text-blue-900 font-semibold shadow-sm animate-q-correct";
                    badgeClass += "bg-blue-600 text-white shadow-sm animate-q-badge";
                } else {
                    btnClass += "border-gray-100 hover:border-blue-300 hover:bg-slate-50 text-gray-700";
                    badgeClass += "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-700";
                }
            }

            return `
                <button class="option-btn ${btnClass}" data-key="${key}">
                    <span class="flex items-center relative z-10 flex-1">
                        <span class="${badgeClass}">${key}</span>
                        <span class="q-option-text text-base md:text-lg text-gray-800 leading-relaxed font-normal">${displayText}</span>
                    </span>
                    ${iconHtml}
                </button>
            `;
        }).join('');

        // 3. 答案解析横幅
        let feedbackBannerHtml = '';
        if (state.reciteMode || isFeedback) {
            const isBannerCorrect = isCorrect || state.reciteMode;
            const bannerBg = isBannerCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800';
            const bannerTitle = isBannerCorrect ? (state.reciteMode ? '考点标准答案' : '回答正确！') : '回答错误！';
            const bannerIcon = isBannerCorrect ? getIcon('CheckCircle', 'w-5 h-5 text-green-600') : getIcon('XCircle', 'w-5 h-5 text-red-600');

            let removeWrongBtn = '';
            if (state.wrongQuestions.has(q.id)) {
                removeWrongBtn = `
                    <button id="btn-remove-from-wrong" class="q-bounce-btn text-xs flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-red-50 text-red-600 transition shadow-sm font-bold whitespace-nowrap">
                        ${getIcon('Trash', 'w-3.5 h-3.5')} 从错题本移出
                    </button>
                `;
            }

            feedbackBannerHtml = `
                <div class="mt-6 p-5 rounded-2xl border ${bannerBg} animate-q-banner flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                        <div class="font-black flex items-center gap-2 mb-1 text-base">
                            ${bannerIcon} <span>${bannerTitle}</span>
                        </div>
                        <div class="text-sm pl-7">
                            标准答案：<span class="font-black text-2xl text-green-700 mr-3">${q.answer}</span>
                            <span class="text-xs opacity-75">来源：${q.paperName || '高级维修电工真题题库'}</span>
                        </div>
                    </div>
                    ${removeWrongBtn}
                </div>
            `;
        }

        // 4. 组装整张题目卡片
        container.innerHTML = `
            <div class="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative animate-q-card">
                
                <!-- 卡片顶栏 -->
                <div class="p-6 md:p-8">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-1 rounded-md text-xs font-black ${q.type === 'judge' ? 'bg-cyan-100 text-cyan-800' : 'bg-blue-100 text-blue-800'}">
                                ${q.type === 'judge' ? '判断题 (0.5分)' : '单选题 (0.5分)'}
                            </span>
                            <span class="text-xs text-gray-400 font-medium hidden sm:inline">
                                来源：${q.paperName || '高级维修电工题库'}
                            </span>
                        </div>

                        <!-- 收藏本题按钮 (Q 弹星星) -->
                        <button id="btn-toggle-favorite" class="q-bounce-btn flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition ${isFav ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-q-star' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}">
                            ${isFav ? getIcon('StarFilled', 'w-4 h-4') : getIcon('Star', 'w-4 h-4')}
                            <span>${isFav ? '已收藏' : '收藏本题'}</span>
                        </button>
                    </div>

                    <!-- 题干正文 -->
                    <h2 class="q-title-text text-lg md:text-xl font-bold text-gray-800 leading-relaxed mb-4">
                        <span class="text-blue-600 font-black mr-1">${curIdx + 1}.</span> ${q.content}
                    </h2>

                    <!-- 附带电路图 -->
                    ${circuitImgHtml}

                    <!-- 选项列表 -->
                    <div class="space-y-3 mt-6">
                        ${optionsHtml}
                    </div>

                    <!-- 答案反馈横幅 -->
                    ${feedbackBannerHtml}
                </div>

                <!-- 卡片底栏 (切题控制) -->
                <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <button id="btn-prev-q" class="q-bounce-btn px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition ${curIdx > 0 ? 'bg-white text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}" ${curIdx === 0 ? 'disabled' : ''}>
                        ‹ 上一题
                    </button>

                    <span class="text-xs text-gray-400 hidden sm:inline">
                        快捷键：键盘 1/2/3/4 或 A/B/C/D 选答，← / → 切题，手机屏幕可直接左右划动切题
                    </span>

                    <div class="flex items-center gap-2">
                        ${isExamMode && !state.examState.isSubmitted ? `
                            <button id="btn-exam-submit-card" class="q-bounce-btn px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md transition">
                                提交试卷
                            </button>
                        ` : ''}

                        <button id="btn-next-q" class="q-bounce-btn px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition ${curIdx < total - 1 ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' : 'text-gray-300 bg-gray-200 cursor-not-allowed'}" ${curIdx >= total - 1 ? 'disabled' : ''}>
                            下一题 ›
                        </button>
                    </div>
                </div>

            </div>
        `;

        bindQuestionCardEvents(q, curIdx, total);
    }

    function bindQuestionCardEvents(q, curIdx, total) {
        const container = document.getElementById('question-scroll-area');

        // 选项点击
        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => {
                const key = btn.getAttribute('data-key');
                handleOptionSelect(q, key);
            };
        });

        // 上下题
        const btnPrev = document.getElementById('btn-prev-q');
        const btnNext = document.getElementById('btn-next-q');
        if (btnPrev && curIdx > 0) {
            btnPrev.onclick = () => {
                setCurrentIndex(curIdx - 1);
                renderApp();
            };
        }
        if (btnNext && curIdx < total - 1) {
            btnNext.onclick = () => {
                setCurrentIndex(curIdx + 1);
                renderApp();
            };
        }

        // 模考交卷
        const btnSubmitCard = document.getElementById('btn-exam-submit-card');
        if (btnSubmitCard) {
            btnSubmitCard.onclick = () => {
                if (confirm('确认交卷并生成成绩单吗？')) submitExam();
            };
        }

        // 收藏
        const btnFav = document.getElementById('btn-toggle-favorite');
        if (btnFav) {
            btnFav.onclick = () => {
                if (state.favoriteQuestions.has(q.id)) {
                    state.favoriteQuestions.delete(q.id);
                    showToast('已取消收藏');
                } else {
                    state.favoriteQuestions.add(q.id);
                    showToast('⭐ 已收入重点收藏夹');
                }
                saveState();
                renderQuestionCard();
                updateAllModuleProgresses();
            };
        }

        // 从错题本移出
        const btnRemoveWrong = document.getElementById('btn-remove-from-wrong');
        if (btnRemoveWrong) {
            btnRemoveWrong.onclick = () => {
                state.wrongQuestions.delete(q.id);
                saveState();
                updateAllModuleProgresses();
                showToast('已移出错题本');
                if (state.activeModuleId === 'wrong') {
                    renderApp();
                } else {
                    renderQuestionCard();
                }
            };
        }

        // 电路图点击放大唤起全功能视口
        container.querySelectorAll('.circuit-img-container').forEach(wrap => {
            wrap.onclick = () => {
                const src = wrap.getAttribute('data-img-src');
                openLightbox(src);
            };
        });
    }

    // --- 选项选定逻辑 ---
    function handleOptionSelect(q, key) {
        const isExamMode = (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz');

        // 1. 模拟考场模式
        if (isExamMode) {
            if (state.examState.isSubmitted) return;
            state.examState.answers[q.id] = key;
            renderQuestionCard();
            return;
        }

        // 2. 普通刷题模式
        const currentAnswers = getCurrentAnswersMap();
        if (currentAnswers[q.id]) {
            return; // 已作答过，不可重复选择
        }

        currentAnswers[q.id] = key;

        // 错题消灭机制
        if (key !== q.answer) {
            state.wrongQuestions.add(q.id);
        } else if (state.activeModuleId === 'wrong') {
            state.wrongQuestions.delete(q.id);
            showToast('🎉 成功攻克！已从错题本移出');
        }

        saveState();
        renderQuestionCard();
        updateAllModuleProgresses();

        // 答对后翻页逻辑 (如果开启了自动翻题开关，则在 800ms 后翻题；关闭则绝不翻题)
        if (key === q.answer && state.autoAdvance) {
            const total = getActiveQuestions().length;
            const curIdx = getCurrentIndex();
            if (curIdx < total - 1) {
                setTimeout(() => {
                    const latestTotal = getActiveQuestions().length;
                    const latestCur = getCurrentIndex();
                    if (latestCur === curIdx && latestCur < latestTotal - 1) {
                        setCurrentIndex(latestCur + 1);
                        renderApp();
                    }
                }, 800);
            }
        }
        // 答错 (key !== q.answer) 时完全停留在当前题，供仔细审题
    }

    // --- 题号导航抽屉 (支持全量/未答/错题过滤) ---
    function openGridModal() {
        const modal = document.getElementById('grid-modal');
        if (!modal) return;
        renderGridButtons();
        modal.classList.remove('hidden');
    }

    function closeGridModal() {
        const modal = document.getElementById('grid-modal');
        if (modal) modal.classList.add('hidden');
    }

    function renderGridButtons() {
        const container = document.getElementById('grid-buttons-container');
        if (!container) return;

        const activeQuestions = getActiveQuestions();
        const answersMap = getCurrentAnswersMap();
        const isExamMode = (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz');
        const isExamOngoing = (isExamMode && !state.examState.isSubmitted);
        const curIdx = getCurrentIndex();

        let correct = 0;
        let wrong = 0;
        let answered = 0;

        activeQuestions.forEach(q => {
            const ans = answersMap[q.id];
            if (ans) {
                answered++;
                if (ans === q.answer) correct++;
                else wrong++;
            }
        });

        safeSetHtml('drawer-stat-correct', correct);
        safeSetHtml('drawer-stat-wrong', wrong);
        safeSetHtml('drawer-stat-unanswered', activeQuestions.length - answered);
        safeSetHtml('drawer-stat-total', activeQuestions.length);

        // 依据当前抽屉过滤器过滤
        let filteredItems = activeQuestions.map((q, idx) => ({ q, idx }));
        if (state.drawerFilter === 'unanswered') {
            filteredItems = filteredItems.filter(item => !answersMap[item.q.id]);
        } else if (state.drawerFilter === 'wrong') {
            filteredItems = filteredItems.filter(item => {
                const ans = answersMap[item.q.id];
                return ans && ans !== item.q.answer;
            });
        }

        // 更新过滤器胶囊按钮样式
        document.querySelectorAll('.grid-filter-btn').forEach(btn => {
            const f = btn.getAttribute('data-filter');
            if (f === state.drawerFilter) {
                btn.className = "grid-filter-btn px-3 py-1 rounded-full transition active:scale-95 bg-blue-600 text-white shadow-sm";
            } else {
                btn.className = "grid-filter-btn px-3 py-1 rounded-full transition active:scale-95 bg-gray-200 text-gray-700 hover:bg-gray-300";
            }
        });

        if (filteredItems.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-gray-400 text-sm">
                    ${state.drawerFilter === 'unanswered' ? '🎉 太棒了！当前模块所有题目均已作答！' : '当前无符合条件的题目'}
                </div>
            `;
            return;
        }

        const cols = activeQuestions.length > 200 ? 'grid-cols-6 sm:grid-cols-8' : 'grid-cols-5 sm:grid-cols-6';
        container.innerHTML = `
            <div class="grid ${cols} gap-2.5">
                ${filteredItems.map(item => {
                    const { q, idx } = item;
                    const ans = answersMap[q.id];
                    let btnClass = "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 q-bounce-btn ";
                    
                    if (idx === curIdx) {
                        btnClass += "border-blue-600 ring-2 ring-blue-200 animate-q-pulse ";
                    } else {
                        btnClass += "border-transparent ";
                    }

                    if (!ans) {
                        btnClass += "bg-gray-100 text-gray-500 hover:bg-gray-200";
                    } else if (isExamOngoing) {
                        btnClass += "bg-blue-600 text-white shadow-sm";
                    } else if (ans === q.answer) {
                        btnClass += "bg-green-100 text-green-700 border-green-300 font-black";
                    } else {
                        btnClass += "bg-red-100 text-red-700 border-red-300 font-black";
                    }

                    return `
                        <button class="grid-num-btn ${btnClass}" data-index="${idx}">
                            ${idx + 1}
                        </button>
                    `;
                }).join('')}
            </div>
        `;

        container.querySelectorAll('.grid-num-btn').forEach(btn => {
            btn.onclick = () => {
                const targetIdx = parseInt(btn.getAttribute('data-index'), 10);
                setCurrentIndex(targetIdx);
                closeGridModal();
                renderApp();
            };
        });
    }

    // --- 题库搜题弹窗 ---
    function openSearchModal() {
        const modal = document.getElementById('search-modal');
        const input = document.getElementById('search-input');
        if (!modal || !input) return;

        modal.classList.remove('hidden');
        input.value = '';
        input.focus();
        renderSearchResults('');
    }

    function closeSearchModal() {
        const modal = document.getElementById('search-modal');
        if (modal) modal.classList.add('hidden');
    }

    function renderSearchResults(kw) {
        const list = document.getElementById('search-results-list');
        if (!list) return;

        const cleanKw = kw.trim();
        if (!cleanKw) {
            list.innerHTML = `<div class="text-center text-gray-400 py-10 text-sm">输入关键词或点击上方热门考点搜索全部 1000 道题库</div>`;
            return;
        }

        const hits = all1000Questions.filter(q => 
            q.content.includes(cleanKw) || (q.options && q.options.some(opt => opt.includes(cleanKw)))
        );

        if (hits.length === 0) {
            list.innerHTML = `<div class="text-center text-gray-400 py-10 text-sm">未找到包含 "${cleanKw}" 的相关题目</div>`;
            return;
        }

        list.innerHTML = hits.slice(0, 50).map(q => {
            const highlighted = q.content.split(cleanKw).join(`<mark class="bg-amber-200 text-amber-900 px-0.5 rounded font-bold">${cleanKw}</mark>`);
            return `
                <div class="search-result-item p-3.5 bg-gray-50 rounded-2xl hover:bg-blue-50 cursor-pointer border border-gray-100 transition q-bounce-btn" data-global-index="${q.globalIndex}">
                    <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>${q.paperName} · 第 ${q.index} 题 (${q.type === 'choice' ? '单选' : '判断'})</span>
                        <span class="text-green-600 font-bold">答案：${q.answer}</span>
                    </div>
                    <div class="text-sm font-medium text-gray-800 leading-relaxed">${highlighted}</div>
                </div>
            `;
        }).join('');

        list.querySelectorAll('.search-result-item').forEach(item => {
            item.onclick = () => {
                const gIdx = parseInt(item.getAttribute('data-global-index'), 10) - 1;
                closeSearchModal();
                state.activeModuleId = 'full_all';
                setCurrentIndex(gIdx);
                renderApp();
            };
        });
    }

    // --- 电路图专业视口：支持双指捏合无级缩放、笔记本触控板 Pinch 手势、滚轮与拖拽平移 ---
    const zoomState = {
        scale: 1,
        translateX: 0,
        translateY: 0,
        isDragging: false,
        startX: 0,
        startY: 0,
        initialPinchDist: 0,
        initialPinchScale: 1
    };

    function applyZoomTransform() {
        const img = document.getElementById('lightbox-img');
        const textScale = document.getElementById('text-zoom-scale');
        if (!img) return;
        img.style.transform = `translate(${zoomState.translateX}px, ${zoomState.translateY}px) scale(${zoomState.scale})`;
        if (textScale) {
            textScale.textContent = `${Math.round(zoomState.scale * 100)}%`;
        }
    }

    function resetZoom() {
        zoomState.scale = 1;
        zoomState.translateX = 0;
        zoomState.translateY = 0;
        applyZoomTransform();
    }

    function openLightbox(src) {
        const modal = document.getElementById('lightbox-modal');
        const img = document.getElementById('lightbox-img');
        if (!modal || !img) return;
        img.src = src;
        resetZoom();
        modal.classList.remove('hidden');
    }

    function closeLightbox() {
        const modal = document.getElementById('lightbox-modal');
        if (modal) modal.classList.add('hidden');
        resetZoom();
    }

    function initLightboxGestures() {
        const viewport = document.getElementById('lightbox-viewport');
        if (!viewport) return;

        // 1. 电脑鼠标滚轮 & 笔记本触控板双指缩放手势 (Trackpad Pinch Gesture)
        viewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            // 现代 Windows 与 Mac 笔记本触控板 pinch-to-zoom 会触发 wheel 且 e.ctrlKey = true
            const isTrackpadPinch = e.ctrlKey;
            let zoomFactor;
            if (isTrackpadPinch) {
                zoomFactor = 1 - e.deltaY * 0.015;
            } else {
                zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
            }
            zoomState.scale = Math.max(0.35, Math.min(zoomState.scale * zoomFactor, 6.0));
            applyZoomTransform();
        }, { passive: false });

        // 2. 鼠标按住拖拽平移
        viewport.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            zoomState.isDragging = true;
            zoomState.startX = e.clientX - zoomState.translateX;
            zoomState.startY = e.clientY - zoomState.translateY;
        });
        window.addEventListener('mousemove', (e) => {
            if (!zoomState.isDragging) return;
            zoomState.translateX = e.clientX - zoomState.startX;
            zoomState.translateY = e.clientY - zoomState.startY;
            applyZoomTransform();
        });
        window.addEventListener('mouseup', () => {
            zoomState.isDragging = false;
        });

        // 3. 手机端双指捏合无级缩放与单指拖动平移
        viewport.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                zoomState.initialPinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                zoomState.initialPinchScale = zoomState.scale;
            } else if (e.touches.length === 1) {
                zoomState.isDragging = true;
                zoomState.startX = e.touches[0].clientX - zoomState.translateX;
                zoomState.startY = e.touches[0].clientY - zoomState.translateY;
            }
        }, { passive: true });

        viewport.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && zoomState.initialPinchDist > 0) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                const ratio = currentDist / zoomState.initialPinchDist;
                zoomState.scale = Math.max(0.35, Math.min(zoomState.initialPinchScale * ratio, 6.0));
                applyZoomTransform();
            } else if (e.touches.length === 1 && zoomState.isDragging) {
                zoomState.translateX = e.touches[0].clientX - zoomState.startX;
                zoomState.translateY = e.touches[0].clientY - zoomState.startY;
                applyZoomTransform();
            }
        }, { passive: true });

        viewport.addEventListener('touchend', () => {
            zoomState.isDragging = false;
        });

        // 4. 双击快速切换 2.2x 放大与 1.0x 恢复
        viewport.addEventListener('dblclick', () => {
            if (zoomState.scale < 1.4) {
                zoomState.scale = 2.2;
            } else {
                zoomState.scale = 1.0;
                zoomState.translateX = 0;
                zoomState.translateY = 0;
            }
            applyZoomTransform();
        });

        // 5. 悬浮按钮组控制
        const btnIn = document.getElementById('btn-zoom-in');
        const btnOut = document.getElementById('btn-zoom-out');
        const btnReset = document.getElementById('btn-zoom-reset');
        const btnActual = document.getElementById('btn-zoom-actual');
        const btnClose = document.getElementById('btn-close-lightbox');

        if (btnIn) btnIn.onclick = () => { zoomState.scale = Math.min(zoomState.scale * 1.25, 6.0); applyZoomTransform(); };
        if (btnOut) btnOut.onclick = () => { zoomState.scale = Math.max(zoomState.scale * 0.8, 0.35); applyZoomTransform(); };
        if (btnReset) btnReset.onclick = resetZoom;
        if (btnActual) btnActual.onclick = () => { zoomState.scale = 1.0; zoomState.translateX = 0; zoomState.translateY = 0; applyZoomTransform(); };
        if (btnClose) btnClose.onclick = closeLightbox;
    }

    // --- 手机端大拇指左右滑动手势切题 (Swipe Gestures) ---
    function initSwipeGestures() {
        const scrollArea = document.getElementById('question-scroll-area');
        if (!scrollArea) return;

        let startX = 0;
        let startY = 0;

        scrollArea.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
        }, { passive: true });

        scrollArea.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                const dx = e.changedTouches[0].clientX - startX;
                const dy = e.changedTouches[0].clientY - startY;

                // 水平位移 > 50px 且水平方向意图显著大于垂直方向 (避免与上下滚动冲突)
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.35) {
                    const total = getActiveQuestions().length;
                    const curIdx = getCurrentIndex();
                    if (dx < 0 && curIdx < total - 1) {
                        // 向左划动 -> 切到下一题
                        setCurrentIndex(curIdx + 1);
                        renderApp();
                    } else if (dx > 0 && curIdx > 0) {
                        // 向右划动 -> 切到上一题
                        setCurrentIndex(curIdx - 1);
                        renderApp();
                    }
                }
            }
        }, { passive: true });
    }

    // --- 移动端侧边栏切换 ---
    function openMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-sidebar-overlay');
        if (sidebar && overlay) {
            sidebar.classList.remove('hidden');
            sidebar.classList.add('fixed', 'inset-y-0', 'left-0', 'z-40', 'flex');
            overlay.classList.remove('hidden');
        }
    }
    function closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-sidebar-overlay');
        if (sidebar && overlay) {
            sidebar.classList.add('hidden');
            sidebar.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-40');
            overlay.classList.remove('hidden');
            overlay.classList.add('hidden');
        }
    }

    // --- 备份导出 ---
    function exportBackup() {
        const backupData = {
            version: '4.0',
            exportDate: new Date().toISOString(),
            moduleCursors: state.moduleCursors,
            moduleAnswers: state.moduleAnswers,
            wrongQuestions: [...state.wrongQuestions],
            favoriteQuestions: [...state.favoriteQuestions],
            theme: state.theme,
            fontSize: state.fontSize,
            autoAdvance: state.autoAdvance
        };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `高级电工刷题进度备份_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // =========================================================================
    // 跨设备双向同步与备份导入恢复核心引擎 (Zero-Server, LZ-String + QR Code)
    // =========================================================================
    let pendingSyncData = null;
    let qrCodeInstance = null;

    function getProgressStats(customAnswers, customWrongs, customFavs) {
        const answers = customAnswers || state.moduleAnswers;
        const wrongs = customWrongs || state.wrongQuestions;
        const favs = customFavs || state.favoriteQuestions;

        const answeredSet = new Set();
        if (answers && typeof answers === 'object') {
            Object.values(answers).forEach(mod => {
                if (mod && typeof mod === 'object') {
                    Object.keys(mod).forEach(qId => answeredSet.add(qId));
                }
            });
        }

        const wrongCount = (wrongs instanceof Set) ? wrongs.size : (Array.isArray(wrongs) ? wrongs.length : 0);
        const favCount = (favs instanceof Set) ? favs.size : (Array.isArray(favs) ? favs.length : 0);

        return {
            answeredCount: answeredSet.size,
            wrongCount: wrongCount,
            favCount: favCount
        };
    }

    function generateSyncData() {
        return {
            v: '4.0',
            ts: Date.now(),
            moduleCursors: state.moduleCursors,
            moduleAnswers: state.moduleAnswers,
            wrongQuestions: Array.from(state.wrongQuestions),
            favoriteQuestions: Array.from(state.favoriteQuestions),
            theme: state.theme,
            fontSize: state.fontSize,
            autoAdvance: state.autoAdvance
        };
    }

    function generateSyncToken() {
        const data = generateSyncData();
        const jsonStr = JSON.stringify(data);
        if (typeof LZString !== 'undefined' && LZString.compressToEncodedURIComponent) {
            return LZString.compressToEncodedURIComponent(jsonStr);
        }
        return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    }

    function generateSyncUrl() {
        const token = generateSyncToken();
        const cleanUrl = window.location.href.split('#')[0];
        return `${cleanUrl}#sync=${token}`;
    }

    function decodeSyncToken(token) {
        if (!token) return null;
        let raw = token.trim();
        if (raw.includes('#sync=')) {
            raw = raw.split('#sync=')[1];
        } else if (raw.startsWith('#')) {
            raw = raw.replace(/^#+/, '');
        }
        if (raw.startsWith('sync=')) {
            raw = raw.substring(5);
        }

        let jsonStr = null;
        if (typeof LZString !== 'undefined' && LZString.decompressFromEncodedURIComponent) {
            try {
                jsonStr = LZString.decompressFromEncodedURIComponent(raw);
            } catch(e) {
                console.error('LZString decompress error:', e);
            }
        }

        if (!jsonStr) {
            try {
                jsonStr = decodeURIComponent(escape(atob(raw)));
            } catch(e) {}
        }

        if (!jsonStr && raw.startsWith('{') && raw.endsWith('}')) {
            jsonStr = raw;
        }

        if (!jsonStr) return null;

        try {
            const parsed = JSON.parse(jsonStr);
            return parsed;
        } catch(e) {
            console.error('Failed to parse sync json:', e);
            return null;
        }
    }

    function isMobileDevice() {
        const ua = navigator.userAgent || '';
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
        const isSmallScreen = window.innerWidth <= 768;
        const hasTouch = (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
        return isMobileUA || (hasTouch && isSmallScreen) || isSmallScreen;
    }

    function setSyncModalMode(mode) {
        const isMobileMode = (mode === 'mobile');
        const tabPc = document.getElementById('tab-sync-pc');
        const tabMobile = document.getElementById('tab-sync-mobile');
        const viewPc = document.getElementById('view-sync-pc');
        const viewMobile = document.getElementById('view-sync-mobile');

        if (tabPc && tabMobile && viewPc && viewMobile) {
            if (isMobileMode) {
                tabMobile.className = "flex-1 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1 bg-white text-purple-700 shadow-sm font-black";
                tabPc.className = "flex-1 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1 text-gray-500 hover:text-gray-900 font-bold";
                viewMobile.classList.remove('hidden');
                viewPc.classList.add('hidden');
            } else {
                tabPc.className = "flex-1 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1 bg-white text-blue-700 shadow-sm font-black";
                tabMobile.className = "flex-1 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1 text-gray-500 hover:text-gray-900 font-bold";
                viewPc.classList.remove('hidden');
                viewMobile.classList.add('hidden');
            }
        }
    }

    function renderSyncQrCode(url) {
        const wrapper = document.getElementById('sync-qrcode-wrapper');
        const wrapperMobile = document.getElementById('sync-qrcode-wrapper-mobile');
        
        if (wrapper) wrapper.innerHTML = '';
        if (wrapperMobile) wrapperMobile.innerHTML = '';

        if (typeof QRCode !== 'undefined') {
            if (wrapper) {
                qrCodeInstance = new QRCode(wrapper, {
                    text: url,
                    width: 180,
                    height: 180,
                    colorDark: '#1e293b',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.L
                });
            }
            if (wrapperMobile) {
                new QRCode(wrapperMobile, {
                    text: url,
                    width: 150,
                    height: 150,
                    colorDark: '#1e293b',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.L
                });
            }
        } else {
            if (wrapper) wrapper.innerHTML = `<div class="p-4 text-xs text-red-500 text-center font-bold">二维码组件加载中，请稍候...</div>`;
        }
    }

    function openSyncModal() {
        const modal = document.getElementById('sync-modal');
        if (!modal) return;

        const syncUrl = generateSyncUrl();
        renderSyncQrCode(syncUrl);

        const stats = getProgressStats();
        const statStr = `已刷 ${stats.answeredCount} 题 · 错题 ${stats.wrongCount} 道 · 收藏 ${stats.favCount} 道`;
        const summaryEl = document.getElementById('sync-stats-summary');
        if (summaryEl) summaryEl.textContent = statStr;
        const mobileSummaryEl = document.getElementById('sync-mobile-stats-summary');
        if (mobileSummaryEl) mobileSummaryEl.textContent = `手机当前进度：${statStr}`;

        const tokenInput = document.getElementById('input-sync-token');
        if (tokenInput) tokenInput.value = '';
        const tokenInputMobile = document.getElementById('input-mobile-sync-token');
        if (tokenInputMobile) tokenInputMobile.value = '';

        // 智能设备判断与模式优先推荐
        const isMob = isMobileDevice();
        const indicator = document.getElementById('sync-device-indicator');
        const badgePc = document.getElementById('badge-rec-pc');
        const badgeMob = document.getElementById('badge-rec-mobile');

        if (isMob) {
            if (indicator) indicator.innerHTML = '<span>📱 识别为手机端 · 推荐一键复制发到微信</span>';
            if (badgeMob) badgeMob.classList.remove('hidden');
            if (badgePc) badgePc.classList.add('hidden');
            setSyncModalMode('mobile');
        } else {
            if (indicator) indicator.innerHTML = '<span>💻 识别为电脑端 · 推荐手机扫码秒接力</span>';
            if (badgePc) badgePc.classList.remove('hidden');
            if (badgeMob) badgeMob.classList.add('hidden');
            setSyncModalMode('pc');
        }

        modal.classList.remove('hidden');
    }

    function closeSyncModal() {
        const modal = document.getElementById('sync-modal');
        if (modal) modal.classList.add('hidden');
    }

    function promptSyncConfirmation(data, sourceTitle = '跨设备同步') {
        if (!data) return;
        pendingSyncData = data;

        const modal = document.getElementById('sync-confirm-modal');
        const descEl = document.getElementById('sync-confirm-desc');
        if (!modal) return;

        const stats = getProgressStats(data.moduleAnswers, data.wrongQuestions, data.favoriteQuestions);
        if (descEl) {
            descEl.innerHTML = `数据来源：<strong>${sourceTitle}</strong><br/>包含已做题目：<strong class="text-blue-600 font-bold">${stats.answeredCount}</strong> 道 · 错题本：<strong class="text-orange-600 font-bold">${stats.wrongCount}</strong> 道 · 重点收藏：<strong class="text-yellow-600 font-bold">${stats.favCount}</strong> 道`;
        }

        modal.classList.remove('hidden');
    }

    function closeSyncConfirmModal() {
        pendingSyncData = null;
        const modal = document.getElementById('sync-confirm-modal');
        if (modal) modal.classList.add('hidden');
    }

    function applySyncMerge(mode = 'merge') {
        if (!pendingSyncData) return;
        const incoming = pendingSyncData;

        if (mode === 'overwrite') {
            // 完全覆盖
            if (incoming.moduleAnswers) {
                state.moduleAnswers = JSON.parse(JSON.stringify(incoming.moduleAnswers));
            }
            if (incoming.moduleCursors) {
                Object.assign(state.moduleCursors, incoming.moduleCursors);
            }
            if (incoming.wrongQuestions) {
                state.wrongQuestions = new Set(incoming.wrongQuestions);
            }
            if (incoming.favoriteQuestions) {
                state.favoriteQuestions = new Set(incoming.favoriteQuestions);
            }
            if (incoming.theme) applyTheme(incoming.theme);
            if (incoming.fontSize) applyFontSize(incoming.fontSize);
            if (incoming.autoAdvance !== undefined) state.autoAdvance = incoming.autoAdvance;

            saveState();
            renderApp();
            closeSyncConfirmModal();
            closeSyncModal();
            showToast('✅ 进度已完全覆盖！');
        } else {
            // 智能合并 (Smart Merge)
            // 1. 各模块答题记录取并集叠加
            if (incoming.moduleAnswers) {
                Object.keys(incoming.moduleAnswers).forEach(mod => {
                    if (!state.moduleAnswers[mod]) {
                        state.moduleAnswers[mod] = {};
                    }
                    Object.assign(state.moduleAnswers[mod], incoming.moduleAnswers[mod]);
                });
            }

            // 2. 各模块游标进度取最大值
            if (incoming.moduleCursors) {
                Object.keys(incoming.moduleCursors).forEach(mod => {
                    const cur = state.moduleCursors[mod] || 0;
                    const inc = incoming.moduleCursors[mod] || 0;
                    state.moduleCursors[mod] = Math.max(cur, inc);
                });
            }

            // 3. 错题集与收藏集取 Set 并集
            if (Array.isArray(incoming.wrongQuestions)) {
                incoming.wrongQuestions.forEach(id => state.wrongQuestions.add(id));
            }
            if (Array.isArray(incoming.favoriteQuestions)) {
                incoming.favoriteQuestions.forEach(id => state.favoriteQuestions.add(id));
            }

            saveState();
            renderApp();
            closeSyncConfirmModal();
            closeSyncModal();
            showToast('🎉 智能合并成功！已汇聚两端做题进度与错题');
        }
    }

    function checkUrlSyncHash() {
        const hash = window.location.hash;
        if (hash && hash.includes('sync=')) {
            const parsed = decodeSyncToken(hash);
            if (parsed) {
                // 清理 URL hash，防止用户刷新网页时重复弹窗
                try {
                    history.replaceState(null, '', window.location.pathname + window.location.search);
                } catch(e) {
                    window.location.hash = '';
                }
                promptSyncConfirmation(parsed, '手机微信扫码 / 链接同步');
            } else {
                showToast('⚠️ 同步链接已失效或数据不完整');
            }
        }
    }

    function handleFileImport(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const content = evt.target.result;
                const data = JSON.parse(content);
                if (!data.moduleAnswers && !data.moduleCursors && !data.wrongQuestions) {
                    alert('无效的备份文件：未识别到做题进度数据。');
                    return;
                }
                promptSyncConfirmation(data, `本地备份文件 (${file.name})`);
            } catch(err) {
                alert('备份文件解析失败，请确保导入的是有效的 JSON 备份文件！');
            }
            e.target.value = '';
        };
        reader.readAsText(file);
    }

    function copySyncUrlToClipboard() {
        const syncUrl = generateSyncUrl();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(syncUrl).then(() => {
                showToast('📋 已复制专属同步链接！发到微信电脑端打开即可同步');
            }).catch(() => {
                copySyncFallback(syncUrl);
            });
        } else {
            copySyncFallback(syncUrl);
        }
    }

    function copySyncFallback(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showToast('📋 已复制专属同步链接！发到微信点开即可');
        } catch(e) {
            prompt('请长按复制下方同步链接：', text);
        }
        document.body.removeChild(ta);
    }

    // --- 全局事件绑定 ---
    function bindEvents() {
        // 1. 全部题库 3 个独立专练
        document.querySelectorAll('[data-mode="full"]').forEach(btn => {
            btn.onclick = () => {
                const filter = btn.getAttribute('data-filter') || 'all';
                switchModule(`full_${filter}`);
                closeMobileSidebar();
            };
        });

        // 2. 模拟考场与快速自测
        const btnExamRandom = document.querySelector('[data-mode="exam-random"]');
        if (btnExamRandom) {
            btnExamRandom.onclick = () => {
                if (confirm('即将进入全真模拟考场：共 200 题，限时 120 分钟，交卷后公布成绩，准备好了吗？')) {
                    startRandomExam(false);
                    closeMobileSidebar();
                }
            };
        }
        const btnQuickQuiz = document.querySelector('[data-mode="quick-quiz"]');
        if (btnQuickQuiz) {
            btnQuickQuiz.onclick = () => {
                startRandomExam(true);
                closeMobileSidebar();
            };
        }

        // 3. 错题本与收藏夹
        const btnNavWrong = document.getElementById('btn-nav-wrong');
        if (btnNavWrong) {
            btnNavWrong.onclick = () => {
                if (state.wrongQuestions.size === 0) {
                    alert('太棒了！当前错题本为空，继续保持！');
                    return;
                }
                switchModule('wrong');
                closeMobileSidebar();
            };
        }
        const btnNavFav = document.getElementById('btn-nav-fav');
        if (btnNavFav) {
            btnNavFav.onclick = () => {
                if (state.favoriteQuestions.size === 0) {
                    alert('当前收藏夹为空！在刷题时点击右上角星星即可收藏重难点题目。');
                    return;
                }
                switchModule('favorite');
                closeMobileSidebar();
            };
        }

        // 4. 阅读主题切换
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.onclick = () => {
                const t = btn.getAttribute('data-theme');
                applyTheme(t);
            };
        });

        // 5. 字号调节切换
        document.querySelectorAll('.fontsize-btn').forEach(btn => {
            btn.onclick = () => {
                const s = btn.getAttribute('data-fontsize');
                applyFontSize(s);
            };
        });

        // 6. 答对自动翻题开关
        const toggleAutoAdv = document.getElementById('toggle-autoadvance-mode');
        if (toggleAutoAdv) {
            toggleAutoAdv.checked = state.autoAdvance;
            toggleAutoAdv.onchange = (e) => {
                state.autoAdvance = e.target.checked;
                saveState();
                showToast(state.autoAdvance ? '已开启答对自动翻题 (0.8s)' : '已关闭自动翻题，保持手动控制');
            };
        }

        // 7. 背题模式开关
        const toggleRecite = document.getElementById('toggle-recite-mode');
        if (toggleRecite) {
            toggleRecite.checked = state.reciteMode;
            toggleRecite.onchange = (e) => {
                state.reciteMode = e.target.checked;
                saveState();
                renderApp();
            };
        }

        // 8. 备份导出与本地恢复导入
        const btnExport = document.getElementById('btn-export-backup');
        if (btnExport) btnExport.onclick = exportBackup;

        const btnImport = document.getElementById('btn-import-backup');
        const fileImportInput = document.getElementById('file-import-input');
        if (btnImport && fileImportInput) {
            btnImport.onclick = () => fileImportInput.click();
            fileImportInput.onchange = handleFileImport;
        }

        // 8.1 跨设备无缝双向同步 (手机扫码 / 电脑互传)
        const btnDeviceSync = document.getElementById('btn-device-sync');
        if (btnDeviceSync) {
            btnDeviceSync.onclick = () => {
                openSyncModal();
                closeMobileSidebar();
            };
        }

        const btnMobileSync = document.getElementById('btn-mobile-sync');
        if (btnMobileSync) btnMobileSync.onclick = openSyncModal;

        const btnCloseSync = document.getElementById('btn-close-sync-modal');
        if (btnCloseSync) btnCloseSync.onclick = closeSyncModal;

        const syncModal = document.getElementById('sync-modal');
        if (syncModal) {
            syncModal.onclick = (e) => {
                if (e.target.id === 'sync-modal') closeSyncModal();
            };
        }

        const tabSyncPc = document.getElementById('tab-sync-pc');
        if (tabSyncPc) tabSyncPc.onclick = () => setSyncModalMode('pc');

        const tabSyncMobile = document.getElementById('tab-sync-mobile');
        if (tabSyncMobile) tabSyncMobile.onclick = () => setSyncModalMode('mobile');

        const btnCopySync = document.getElementById('btn-copy-sync-url');
        if (btnCopySync) btnCopySync.onclick = copySyncUrlToClipboard;

        const btnMobileCopySync = document.getElementById('btn-mobile-copy-url');
        if (btnMobileCopySync) btnMobileCopySync.onclick = copySyncUrlToClipboard;

        function handleTokenApply(inputEl) {
            if (!inputEl) return;
            const val = inputEl.value.trim();
            if (!val) {
                alert('请先粘贴包含 #sync= 的同步链接或口令码！');
                return;
            }
            const parsed = decodeSyncToken(val);
            if (!parsed) {
                alert('无法解析该同步口令，请检查是否完整复制！');
                return;
            }
            promptSyncConfirmation(parsed, '微信口令手动同步');
        }

        const btnApplyToken = document.getElementById('btn-apply-sync-token');
        const inputSyncToken = document.getElementById('input-sync-token');
        if (btnApplyToken && inputSyncToken) {
            btnApplyToken.onclick = () => handleTokenApply(inputSyncToken);
        }

        const btnMobileApplyToken = document.getElementById('btn-mobile-apply-token');
        const inputMobileSyncToken = document.getElementById('input-mobile-sync-token');
        if (btnMobileApplyToken && inputMobileSyncToken) {
            btnMobileApplyToken.onclick = () => handleTokenApply(inputMobileSyncToken);
        }

        // 8.2 同步数据确认框 (智能合并 vs 完全覆盖)
        const btnSmartMerge = document.getElementById('btn-action-smart-merge');
        if (btnSmartMerge) btnSmartMerge.onclick = () => applySyncMerge('merge');

        const btnOverwrite = document.getElementById('btn-action-overwrite');
        if (btnOverwrite) btnOverwrite.onclick = () => applySyncMerge('overwrite');

        const btnCancelSyncConfirm = document.getElementById('btn-cancel-sync-confirm');
        if (btnCancelSyncConfirm) btnCancelSyncConfirm.onclick = closeSyncConfirmModal;

        const syncConfirmModal = document.getElementById('sync-confirm-modal');
        if (syncConfirmModal) {
            syncConfirmModal.onclick = (e) => {
                if (e.target.id === 'sync-confirm-modal') closeSyncConfirmModal();
            };
        }

        // 9. 重置当前专练进度
        const btnResetCurrent = document.getElementById('btn-reset-current');
        if (btnResetCurrent) {
            btnResetCurrent.onclick = () => {
                let moduleName = '当前专练';
                if (state.activeModuleId === 'full_all') moduleName = '全部题目全刷';
                else if (state.activeModuleId === 'full_choice') moduleName = '单选题专练';
                else if (state.activeModuleId === 'full_judge') moduleName = '判断题专练';
                else if (state.activeModuleId.startsWith('paper_')) {
                    const info = getPaperTitleInfo(state.activeModuleId, '');
                    moduleName = info.title;
                }

                if (confirm(`确认清空【${moduleName}】的独立做题进度吗？其他专练与错题本不受影响。`)) {
                    state.moduleAnswers[state.activeModuleId] = {};
                    state.moduleCursors[state.activeModuleId] = 0;
                    saveState();
                    renderApp();
                }
            };
        }

        // 10. 清空所有数据
        const btnClearAll = document.getElementById('btn-clear-all-data');
        if (btnClearAll) {
            btnClearAll.onclick = () => {
                if (confirm('警告：此操作将清空所有模块的做题记录、题号进度、错题本与收藏夹！确认执行吗？')) {
                    localStorage.clear();
                    state.moduleCursors = {
                        'full_all': 0, 'full_choice': 0, 'full_judge': 0,
                        'paper_2024': 0, 'paper_1': 0, 'paper_2': 0, 'paper_3': 0, 'paper_4': 0,
                        'wrong': 0, 'favorite': 0
                    };
                    state.moduleAnswers = {
                        'full_all': {}, 'full_choice': {}, 'full_judge': {},
                        'paper_2024': {}, 'paper_1': {}, 'paper_2': {}, 'paper_3': {}, 'paper_4': {}
                    };
                    state.wrongQuestions.clear();
                    state.favoriteQuestions.clear();
                    state.activeModuleId = 'full_all';
                    saveState();
                    renderApp();
                }
            };
        }

        // 11. 题号抽屉弹窗与过滤器
        const btnOpenGrid = document.getElementById('btn-open-grid-modal');
        if (btnOpenGrid) btnOpenGrid.onclick = openGridModal;
        const btnCloseGrid = document.getElementById('btn-close-grid-modal');
        if (btnCloseGrid) btnCloseGrid.onclick = closeGridModal;
        const gridModal = document.getElementById('grid-modal');
        if (gridModal) {
            gridModal.onclick = (e) => {
                if (e.target.id === 'grid-modal') closeGridModal();
            };
        }

        document.querySelectorAll('.grid-filter-btn').forEach(btn => {
            btn.onclick = () => {
                state.drawerFilter = btn.getAttribute('data-filter') || 'all';
                renderGridButtons();
            };
        });

        // 12. 搜索弹窗与考点热词胶囊
        const btnQuickSearch = document.getElementById('btn-quick-search');
        if (btnQuickSearch) btnQuickSearch.onclick = openSearchModal;
        const btnMobileSearch = document.getElementById('btn-mobile-search');
        if (btnMobileSearch) btnMobileSearch.onclick = openSearchModal;
        const btnCloseSearch = document.getElementById('btn-close-search');
        if (btnCloseSearch) btnCloseSearch.onclick = closeSearchModal;
        const searchModal = document.getElementById('search-modal');
        if (searchModal) {
            searchModal.onclick = (e) => {
                if (e.target.id === 'search-modal') closeSearchModal();
            };
        }
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.oninput = (e) => renderSearchResults(e.target.value);
        }

        document.querySelectorAll('.topic-chip').forEach(chip => {
            chip.onclick = () => {
                const kw = chip.getAttribute('data-kw');
                if (searchInput) {
                    searchInput.value = kw;
                    renderSearchResults(kw);
                }
            };
        });

        // 13. 成绩单弹窗
        const btnHeaderSubmit = document.getElementById('btn-header-submit-exam');
        if (btnHeaderSubmit) {
            btnHeaderSubmit.onclick = () => {
                if (confirm('确认交卷并生成最终成绩单吗？')) submitExam();
            };
        }
        const btnResultReview = document.getElementById('btn-result-review');
        if (btnResultReview) {
            btnResultReview.onclick = () => {
                document.getElementById('result-modal').classList.add('hidden');
                renderApp();
            };
        }
        const btnResultClose = document.getElementById('btn-result-close');
        if (btnResultClose) {
            btnResultClose.onclick = () => {
                document.getElementById('result-modal').classList.add('hidden');
                switchModule('full_all');
            };
        }

        // 14. 移动端菜单
        const btnMobileMenu = document.getElementById('btn-mobile-menu');
        if (btnMobileMenu) btnMobileMenu.onclick = openMobileSidebar;
        const btnCloseSidebarMobile = document.getElementById('btn-close-sidebar-mobile');
        if (btnCloseSidebarMobile) btnCloseSidebarMobile.onclick = closeMobileSidebar;
        const sidebarOverlay = document.getElementById('mobile-sidebar-overlay');
        if (sidebarOverlay) sidebarOverlay.onclick = closeMobileSidebar;

        // 15. 键盘快捷键 (← / → 切题，1/2/3/4 或 A/B/C/D 答题)
        window.addEventListener('keydown', (e) => {
            const sm = document.getElementById('search-modal');
            const lm = document.getElementById('lightbox-modal');
            if (sm && !sm.classList.contains('hidden')) return;
            if (lm && !lm.classList.contains('hidden')) {
                if (e.key === 'Escape') closeLightbox();
                return;
            }

            const total = getActiveQuestions().length;
            const curIdx = getCurrentIndex();

            if (e.key === 'ArrowLeft') {
                if (curIdx > 0) {
                    setCurrentIndex(curIdx - 1);
                    renderApp();
                }
            } else if (e.key === 'ArrowRight') {
                if (curIdx < total - 1) {
                    setCurrentIndex(curIdx + 1);
                    renderApp();
                }
            } else if (['1', '2', '3', '4', 'a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
                const q = getActiveQuestions()[curIdx];
                if (!q) return;
                let k = '';
                if (['1', 'a', 'A'].includes(e.key)) k = (q.type === 'choice' ? 'A' : '√');
                else if (['2', 'b', 'B'].includes(e.key)) k = (q.type === 'choice' ? 'B' : '×');
                else if (['3', 'c', 'C'].includes(e.key)) k = 'C';
                else if (['4', 'd', 'D'].includes(e.key)) k = 'D';
                if (k) handleOptionSelect(q, k);
            }
        });

        // 16. 初始化手势引擎
        initLightboxGestures();
        initSwipeGestures();
    }

    // --- 启动启动链 ---
    loadSavedData();
    initIcons();
    bindEvents();
    applyTheme(state.theme);
    applyFontSize(state.fontSize);
    renderApp();
    checkUrlSyncHash();
    window.addEventListener('hashchange', checkUrlSyncHash);

})();
