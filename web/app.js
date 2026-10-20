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

    // --- 题库解析与扁平化 (1000 题完整收录 + 2026年 10月21/22/23日 三天考前精简特训卷各 210 题，全库总计 1630 题) ---
    const rawPapers = window.EXAM_PAPERS || [];
    const all1000Questions = [];
    const sim2026QuestionsByDate = {
        '1021': [],
        '1022': [],
        '1023': []
    };
    const allQuestionsPool = [];

    const SIM_DATES = {
        '1021': { id: 'paper_2026_1021', date: '1021', name: '10月21日', title: '2026年10月21日模拟卷(精简版)', total: 210 },
        '1022': { id: 'paper_2026_1022', date: '1022', name: '10月22日', title: '2026年10月22日模拟卷(精简版)', total: 210 },
        '1023': { id: 'paper_2026_1023', date: '1023', name: '10月23日', title: '2026年10月23日模拟卷(精简版)', total: 210 }
    };

    rawPapers.forEach((paper) => {
        paper.questions.forEach((q) => {
            const item = {
                ...q,
                id: `${paper.id}_${q.index}`,
                paperId: paper.id,
                paperName: paper.name,
                globalIndex: allQuestionsPool.length + 1
            };
            allQuestionsPool.push(item);

            if (paper.id === 'paper_2026_1021' || paper.id === 'paper_2026') {
                sim2026QuestionsByDate['1021'].push(item);
            } else if (paper.id === 'paper_2026_1022') {
                sim2026QuestionsByDate['1022'].push(item);
            } else if (paper.id === 'paper_2026_1023') {
                sim2026QuestionsByDate['1023'].push(item);
            } else {
                all1000Questions.push(item);
            }
        });
    });

    function getSim2026Questions(dateKey = null) {
        const key = dateKey || state.selectedSimDate || '1021';
        return sim2026QuestionsByDate[key] || sim2026QuestionsByDate['1021'] || [];
    }

    // 针对 2026 精简题库按日期隔离的存储 key 辅助方法
    function getModuleCursorKey(modId) {
        if (modId && modId.startsWith('paper_2026_')) {
            return `${modId}_${state.selectedSimDate || '1021'}`;
        }
        return modId;
    }

    function getModuleAnswerKey(modId) {
        if (modId && modId.startsWith('paper_2026_')) {
            return `${modId}_${state.selectedSimDate || '1021'}`;
        }
        return modId;
    }

    // --- 状态定义 (各模块完全独立进度架构) ---
    const state = {
        activeModuleId: 'full_all',
        selectedSimDate: '1021', // '1021' | '1022' | '1023'
        recentModuleId: 'paper_2026_all', // 记录最近练习过的试卷模块
        recentSimDate: '1021',           // 记录最近练习的考期
        orderMode: 'seq',                // 'seq' (正常顺序) | 'shuffle' (题型内乱序)
        moduleShuffleMaps: {},           // 各模块乱序映射缓存 [modKey]: [qId1, qId2, ...] (持久化防止刷题中途跳动)
        quickPeekMap: {},                // 单题速查答案状态映射 [qId]: boolean
        
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
            'paper_2026_all_1021': 0, 'paper_2026_choice_1021': 0, 'paper_2026_multiple_1021': 0, 'paper_2026_judge_1021': 0, 'paper_2026_exam_1021': 0,
            'paper_2026_all_1022': 0, 'paper_2026_choice_1022': 0, 'paper_2026_multiple_1022': 0, 'paper_2026_judge_1022': 0, 'paper_2026_exam_1022': 0,
            'paper_2026_all_1023': 0, 'paper_2026_choice_1023': 0, 'paper_2026_multiple_1023': 0, 'paper_2026_judge_1023': 0, 'paper_2026_exam_1023': 0,
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
            'paper_4': {},
            'paper_2026_all_1021': {}, 'paper_2026_choice_1021': {}, 'paper_2026_multiple_1021': {}, 'paper_2026_judge_1021': {},
            'paper_2026_all_1022': {}, 'paper_2026_choice_1022': {}, 'paper_2026_multiple_1022': {}, 'paper_2026_judge_1022': {},
            'paper_2026_all_1023': {}, 'paper_2026_choice_1023': {}, 'paper_2026_multiple_1023': {}, 'paper_2026_judge_1023': {}
        },

        // 全局错题集与收藏集
        wrongQuestions: new Set(),
        favoriteQuestions: new Set(),
        wrongSessionList: null, // 错题本当前轮次练习题目列表缓存，防止刷题中途因答对移出导致列表动态坍缩与跳题

        // 多选题当前暂存勾选集合
        multiDraft: new Set(),

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
    const STORAGE_KEY_ORDER_MODE = 'electrician_order_mode_v4';
    const STORAGE_KEY_SHUFFLE_MAPS = 'electrician_module_shuffle_maps_v4';
    const STORAGE_KEY_RECENT_MODULE = 'electrician_recent_module_v4';
    const STORAGE_KEY_RECENT_SIM_DATE = 'electrician_recent_sim_date_v4';

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

            // 读取已选考期
            const simDate = localStorage.getItem('electrician_sim_date_v4');
            if (simDate && ['1021', '1022', '1023'].includes(simDate)) {
                state.selectedSimDate = simDate;
                state.recentSimDate = simDate;
            } else {
                state.selectedSimDate = '1021';
                state.recentSimDate = '1021';
            }

            const recDate = localStorage.getItem(STORAGE_KEY_RECENT_SIM_DATE);
            if (recDate && ['1021', '1022', '1023'].includes(recDate)) {
                state.recentSimDate = recDate;
            }

            const recMod = localStorage.getItem(STORAGE_KEY_RECENT_MODULE);
            if (recMod) {
                state.recentModuleId = recMod;
            }

            const order = localStorage.getItem(STORAGE_KEY_ORDER_MODE);
            if (order === 'shuffle' || order === 'seq') {
                state.orderMode = order;
            }

            const maps = localStorage.getItem(STORAGE_KEY_SHUFFLE_MAPS);
            if (maps) {
                try {
                    state.moduleShuffleMaps = JSON.parse(maps) || {};
                } catch(e) {}
            }

            // 旧版 2026 单卷数据平滑迁移至 1021 考期
            if (state.moduleAnswers['paper_2026_all'] && !state.moduleAnswers['paper_2026_all_1021']) {
                state.moduleAnswers['paper_2026_all_1021'] = state.moduleAnswers['paper_2026_all'];
                if (state.moduleCursors['paper_2026_all']) {
                    state.moduleCursors['paper_2026_all_1021'] = state.moduleCursors['paper_2026_all'];
                }
            }
            if (state.moduleAnswers['paper_2026_choice'] && !state.moduleAnswers['paper_2026_choice_1021']) {
                state.moduleAnswers['paper_2026_choice_1021'] = state.moduleAnswers['paper_2026_choice'];
            }
            if (state.moduleAnswers['paper_2026_multiple'] && !state.moduleAnswers['paper_2026_multiple_1021']) {
                state.moduleAnswers['paper_2026_multiple_1021'] = state.moduleAnswers['paper_2026_multiple'];
            }
            if (state.moduleAnswers['paper_2026_judge'] && !state.moduleAnswers['paper_2026_judge_1021']) {
                state.moduleAnswers['paper_2026_judge_1021'] = state.moduleAnswers['paper_2026_judge'];
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
                state.recentModuleId = activeMod;
            }
            if (state.activeModuleId === 'wrong') {
                state.wrongSessionList = allQuestionsPool.filter(q => state.wrongQuestions.has(q.id));
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
            localStorage.setItem(STORAGE_KEY_ORDER_MODE, state.orderMode || 'seq');
            localStorage.setItem(STORAGE_KEY_SHUFFLE_MAPS, JSON.stringify(state.moduleShuffleMaps || {}));
            localStorage.setItem(STORAGE_KEY_RECENT_MODULE, state.recentModuleId || 'paper_2026_all');
            localStorage.setItem(STORAGE_KEY_RECENT_SIM_DATE, state.recentSimDate || '1021');
            localStorage.setItem('electrician_sim_date_v4', state.selectedSimDate || '1021');
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

    // --- 加密级真随机数生成器 (杜绝伪随机数确定性与重复分布) ---
    function getSecureRandomInt(max) {
        if (max <= 1) return 0;
        if (window.crypto && window.crypto.getRandomValues) {
            const buf = new Uint32Array(1);
            window.crypto.getRandomValues(buf);
            return buf[0] % max;
        }
        return Math.floor(Math.random() * max);
    }

    // --- Fisher-Yates 现代真随机打乱算法 ---
    function shuffleArray(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = getSecureRandomInt(i + 1);
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // --- 题型内分组乱序核心算法 (铁律约束：严格保持 单选 ➔ 多选 ➔ 判断 的题型先后大类顺序) ---
    function shuffleQuestionsGrouped(questions) {
        const choices = [];
        const multiples = [];
        const judges = [];
        const others = [];

        questions.forEach(q => {
            if (q.type === 'choice') choices.push(q);
            else if (q.type === 'multiple') multiples.push(q);
            else if (q.type === 'judge') judges.push(q);
            else others.push(q);
        });

        return [
            ...shuffleArray(choices),
            ...shuffleArray(multiples),
            ...shuffleArray(judges),
            ...shuffleArray(others)
        ];
    }

    // --- 获取指定模块原始顺序题目列表 ---
    function getRawModuleQuestions(moduleId) {
        if (moduleId === 'full_all') {
            return all1000Questions;
        } else if (moduleId === 'full_choice') {
            return all1000Questions.filter(q => q.type === 'choice');
        } else if (moduleId === 'full_judge') {
            return all1000Questions.filter(q => q.type === 'judge');
        } else if (moduleId === 'paper_2026_all' || moduleId === 'paper_2026') {
            return getSim2026Questions();
        } else if (moduleId === 'paper_2026_choice') {
            return getSim2026Questions().filter(q => q.type === 'choice');
        } else if (moduleId === 'paper_2026_multiple') {
            return getSim2026Questions().filter(q => q.type === 'multiple');
        } else if (moduleId === 'paper_2026_judge') {
            return getSim2026Questions().filter(q => q.type === 'judge');
        } else if (moduleId.startsWith('paper_2026_10')) {
            const dateKey = moduleId.replace('paper_2026_', '');
            return getSim2026Questions(dateKey);
        } else if (moduleId.startsWith('paper_')) {
            return all1000Questions.filter(q => q.paperId === moduleId);
        } else if (moduleId === 'wrong') {
            if (Array.isArray(state.wrongSessionList)) {
                return state.wrongSessionList;
            }
            return allQuestionsPool.filter(q => state.wrongQuestions.has(q.id));
        } else if (moduleId === 'favorite') {
            return allQuestionsPool.filter(q => state.favoriteQuestions.has(q.id));
        } else if (moduleId === 'exam_random' || moduleId === 'quick_quiz' || moduleId === 'paper_2026_exam') {
            return state.examState.activeQuestions;
        }
        return all1000Questions;
    }

    // 为某模块重新生成真随机分组乱序映射并持久化 (每次均强制重新真随机打乱)
    function regenerateModuleShuffle(moduleId) {
        const raw = getRawModuleQuestions(moduleId);
        if (raw.length <= 1) return raw;
        const shuffled = shuffleQuestionsGrouped(raw);
        const mapKey = getModuleCursorKey(moduleId);
        state.moduleShuffleMaps[mapKey] = shuffled.map(q => q.id);
        saveState();
        return shuffled;
    }

    // --- 获取当前模块的题目列表 (支持顺序/乱序无缝切换与持久缓存) ---
    function getModuleQuestions(moduleId) {
        const raw = getRawModuleQuestions(moduleId);
        const isExam = (moduleId === 'exam_random' || moduleId === 'quick_quiz' || moduleId === 'paper_2026_exam');
        if (isExam || moduleId === 'wrong' || moduleId === 'favorite' || raw.length <= 1) {
            return raw;
        }

        // 顺序模式：直接返回原卷序号
        if (state.orderMode !== 'shuffle') {
            return raw;
        }

        // 乱序模式：优先从持久化缓存读取映射，保证做题刷新绝不乱跳
        const mapKey = getModuleCursorKey(moduleId);
        let ids = state.moduleShuffleMaps[mapKey];
        if (!ids || ids.length !== raw.length) {
            const shuffled = shuffleQuestionsGrouped(raw);
            ids = shuffled.map(q => q.id);
            state.moduleShuffleMaps[mapKey] = ids;
            saveState();
        }

        const qMap = new Map();
        raw.forEach(q => qMap.set(q.id, q));
        const list = ids.map(id => qMap.get(id)).filter(Boolean);
        return list.length === raw.length ? list : raw;
    }

    // --- 顺序 / 乱序 状态同步与交互 ---
    function syncOrderModeUI() {
        const isShuffle = (state.orderMode === 'shuffle');
        
        // 桌面/移动端顶栏状态按钮
        const headerBtn = document.getElementById('btn-header-order-toggle');
        const headerIcon = document.getElementById('header-order-icon');
        const headerText = document.getElementById('header-order-text');
        if (headerBtn) {
            if (isShuffle) {
                headerBtn.className = 'q-bounce-btn flex-shrink-0 inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold transition border border-purple-400 bg-purple-600 text-white shadow-sm shadow-purple-200 cursor-pointer whitespace-nowrap';
                if (headerIcon) headerIcon.textContent = '🔀';
                if (headerText) headerText.textContent = '乱序';
                headerBtn.title = '当前为题型内真随机乱序刷题，点击切换为原卷顺序';
            } else {
                headerBtn.className = 'q-bounce-btn flex-shrink-0 inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold transition border border-gray-200 bg-gray-50 hover:bg-purple-50 hover:text-purple-900 text-gray-700 shadow-sm cursor-pointer whitespace-nowrap';
                if (headerIcon) headerIcon.textContent = '📋';
                if (headerText) headerText.textContent = '顺序';
                headerBtn.title = '当前为原卷顺序刷题，点击切换为题型内乱序';
            }
        }

        // 兼容旧移动端按钮标识 (若存在)
        const mobileBtn = document.getElementById('btn-mobile-order');
        const mobileIcon = document.getElementById('mobile-order-icon');
        const mobileText = document.getElementById('mobile-order-text');
        if (mobileBtn) {
            if (isShuffle) {
                mobileBtn.className = 'p-2 bg-purple-600 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm transition';
                if (mobileIcon) mobileIcon.textContent = '🔀';
                if (mobileText) mobileText.textContent = '乱序';
            } else {
                mobileBtn.className = 'p-2 hover:bg-blue-600 rounded-lg text-white font-bold text-xs flex items-center gap-1 transition';
                if (mobileIcon) mobileIcon.textContent = '📋';
                if (mobileText) mobileText.textContent = '顺序';
            }
        }
    }

    // --- 顺序切换智能处理 (未做题直接切换归零，已做题弹窗询问是否保留做题记录) ---
    let pendingTargetOrderMode = null;

    function handleOrderToggleClick(forcedMode = null) {
        const isExam = (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz' || state.activeModuleId === 'paper_2026_exam');
        if (isExam || state.activeModuleId === 'wrong' || state.activeModuleId === 'favorite') {
            showToast('ℹ️ 当前特殊模式不支持切换刷题顺序');
            return;
        }

        const currentMode = state.orderMode || 'seq';
        const targetMode = forcedMode || (currentMode === 'shuffle' ? 'seq' : 'shuffle');
        if (targetMode === currentMode) return;

        const ansMap = getCurrentAnswersMap();
        const answeredCount = Object.keys(ansMap).length;

        // 如果用户在当前卷完全没有做过任何题 (0题)，无需弹窗，直接丝滑切换到第 1 题
        if (answeredCount === 0) {
            executeDirectOrderSwitch(targetMode);
            return;
        }

        // 如果已有作答记录，弹出智能选择对话框询问用户意图
        pendingTargetOrderMode = targetMode;
        openSwitchOrderModal(targetMode, answeredCount);
    }

    function executeDirectOrderSwitch(targetMode) {
        state.orderMode = targetMode;
        const mapKey = getModuleCursorKey(state.activeModuleId);

        if (targetMode === 'shuffle') {
            // 真随机：清除旧映射并重新生成全新乱序
            delete state.moduleShuffleMaps[mapKey];
            regenerateModuleShuffle(state.activeModuleId);
        }

        // 游标稳稳归零从第 1 题开始
        setCurrentIndex(0);
        saveState();
        syncOrderModeUI();
        renderApp();

        if (targetMode === 'shuffle') {
            showToast('🔀 已开启真随机乱序刷题 (保留单选→多选→判断题型顺序)');
        } else {
            showToast('📋 已切换为顺序刷题 (按官方原卷 1~210 序号排列)');
        }
    }

    function openSwitchOrderModal(targetMode, doneCount) {
        const modal = document.getElementById('modal-switch-order');
        if (!modal) return;

        const iconEl = document.getElementById('switch-order-icon');
        const titleEl = document.getElementById('switch-order-title');
        const countEl = document.getElementById('switch-order-done-count');
        const opt1Title = document.getElementById('switch-order-opt1-title');
        const opt1Badge = document.getElementById('switch-order-opt1-badge');
        const opt1Desc = document.getElementById('switch-order-opt1-desc');
        const opt2Title = document.getElementById('switch-order-opt2-title');
        const opt2Badge = document.getElementById('switch-order-opt2-badge');
        const opt2Desc = document.getElementById('switch-order-opt2-desc');

        if (countEl) countEl.textContent = doneCount;

        if (targetMode === 'shuffle') {
            if (iconEl) iconEl.textContent = '🔀';
            if (titleEl) titleEl.textContent = '切换为乱序刷题';
            if (opt1Title) opt1Title.textContent = '清空记录，从头乱序 (推荐)';
            if (opt1Badge) opt1Badge.textContent = '全新真随机';
            if (opt1Desc) opt1Desc.textContent = '清空当前卷答题历史，全卷各题型内部真随机打乱，从第 1 题全新开始。';
            if (opt2Title) opt2Title.textContent = '保留已做记录，仅打乱后续未做题目';
            if (opt2Badge) opt2Badge.textContent = '无缝衔接';
            if (opt2Desc) opt2Desc.textContent = `保留已做的 ${doneCount} 道题及答题对错，仅将后续未做的题目真随机打乱，直接无缝继续刷题！`;
        } else {
            if (iconEl) iconEl.textContent = '📋';
            if (titleEl) titleEl.textContent = '切换为顺序刷题';
            if (opt1Title) opt1Title.textContent = '清空记录，从头顺序 (推荐)';
            if (opt1Badge) opt1Badge.textContent = '原卷 1~210 序号';
            if (opt1Desc) opt1Desc.textContent = '清空当前卷答题历史，恢复官方原卷 1~210 序号排列，从第 1 题全新开始。';
            if (opt2Title) opt2Title.textContent = '保留已做记录，后续未做题恢复原卷顺序';
            if (opt2Badge) opt2Badge.textContent = '顺次排列';
            if (opt2Desc) opt2Desc.textContent = `保留已做的 ${doneCount} 道题及答题对错，后续未做的题目按官方原题序号排列，直接无缝继续刷题！`;
        }

        modal.classList.remove('hidden');
    }

    function closeSwitchOrderModal() {
        const modal = document.getElementById('modal-switch-order');
        if (modal) modal.classList.add('hidden');
        pendingTargetOrderMode = null;
    }

    // 弹窗选项一：清空本卷，从第 1 题开始全新模式
    function executeSwitchOrderRestart() {
        if (!pendingTargetOrderMode) return;
        const targetMode = pendingTargetOrderMode;
        closeSwitchOrderModal();

        const ansKey = getModuleAnswerKey(state.activeModuleId);
        state.moduleAnswers[ansKey] = {};
        state.multiDraft.clear();

        state.orderMode = targetMode;
        const mapKey = getModuleCursorKey(state.activeModuleId);

        if (targetMode === 'shuffle') {
            delete state.moduleShuffleMaps[mapKey];
            regenerateModuleShuffle(state.activeModuleId);
        }

        setCurrentIndex(0);
        saveState();
        syncOrderModeUI();
        updateAllModuleProgresses();
        renderApp();

        const modeName = (targetMode === 'shuffle' ? '真随机乱序' : '原卷顺序');
        showToast(`🔄 已清空本卷答题历史，切换为【${modeName}】，从第 1 题全新开始！`);
    }

    // 弹窗选项二：保留已做记录，仅对后续未做题目真随机打乱/恢复原序
    function executeSwitchOrderKeep() {
        if (!pendingTargetOrderMode) return;
        const targetMode = pendingTargetOrderMode;
        closeSwitchOrderModal();

        const modId = state.activeModuleId;
        const rawQuestions = getRawModuleQuestions(modId);
        const ansKey = getModuleAnswerKey(modId);
        const ansMap = state.moduleAnswers[ansKey] || {};
        const doneCount = Object.keys(ansMap).length;

        if (targetMode === 'shuffle') {
            // 铁律：各大题型大类顺序（单选 ➔ 多选 ➔ 判断 ➔ 其他）严格保序！
            // 在各大题型内部：已做题目保存在前，未做题目真随机打乱在后！
            const choicesDone = [];
            const choicesUndone = [];
            const multiplesDone = [];
            const multiplesUndone = [];
            const judgesDone = [];
            const judgesUndone = [];
            const othersDone = [];
            const othersUndone = [];

            rawQuestions.forEach(q => {
                const isDone = Boolean(ansMap[q.id]);
                if (q.type === 'choice') {
                    if (isDone) choicesDone.push(q);
                    else choicesUndone.push(q);
                } else if (q.type === 'multiple') {
                    if (isDone) multiplesDone.push(q);
                    else multiplesUndone.push(q);
                } else if (q.type === 'judge') {
                    if (isDone) judgesDone.push(q);
                    else judgesUndone.push(q);
                } else {
                    if (isDone) othersDone.push(q);
                    else othersUndone.push(q);
                }
            });

            const newOrder = [
                ...choicesDone,
                ...shuffleArray(choicesUndone),
                ...multiplesDone,
                ...shuffleArray(multiplesUndone),
                ...judgesDone,
                ...shuffleArray(judgesUndone),
                ...othersDone,
                ...shuffleArray(othersUndone)
            ];

            const mapKey = getModuleCursorKey(modId);
            state.moduleShuffleMaps[mapKey] = newOrder.map(q => q.id);
            state.orderMode = 'shuffle';

            // 游标精准定位到整个序列中第一道未作答的题目，丝滑继续
            const firstUndoneIdx = newOrder.findIndex(q => !ansMap[q.id]);
            const targetCursor = firstUndoneIdx >= 0 ? firstUndoneIdx : 0;
            setCurrentIndex(targetCursor);

            saveState();
            syncOrderModeUI();
            renderApp();
            showToast(`⚡ 已保留 ${doneCount} 道已做题，后续未做题已真随机打乱！第 ${targetCursor + 1} 题继续作答`);
        } else {
            // 切换为顺序模式，但保留已做答题记录
            state.orderMode = 'seq';
            const firstUndoneIdx = rawQuestions.findIndex(q => !ansMap[q.id]);
            const targetCursor = firstUndoneIdx >= 0 ? firstUndoneIdx : 0;
            setCurrentIndex(targetCursor);

            saveState();
            syncOrderModeUI();
            renderApp();
            showToast(`📋 已保留 ${doneCount} 道已做题，后续未做题恢复原卷顺序！第 ${targetCursor + 1} 题继续作答`);
        }
    }

    // 兼容旧接口别名
    function toggleOrderMode(forcedMode = null) {
        handleOrderToggleClick(forcedMode);
    }

    function getActiveQuestions() {
        return getModuleQuestions(state.activeModuleId);
    }

    function getCurrentIndex() {
        const total = getActiveQuestions().length;
        if (total === 0) return 0;
        const cKey = getModuleCursorKey(state.activeModuleId);
        let idx = state.moduleCursors[cKey];
        if (idx === undefined || idx < 0) idx = 0;
        if (idx >= total) idx = total - 1;
        state.moduleCursors[cKey] = idx;
        return idx;
    }

    function setCurrentIndex(newIdx) {
        const total = getActiveQuestions().length;
        const cKey = getModuleCursorKey(state.activeModuleId);
        if (total === 0) {
            state.moduleCursors[cKey] = 0;
            return;
        }
        state.moduleCursors[cKey] = Math.max(0, Math.min(newIdx, total - 1));
        saveState();
    }

    function getCurrentAnswersMap() {
        if (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz' || state.activeModuleId === 'paper_2026_exam') {
            return state.examState.answers;
        }
        const aKey = getModuleAnswerKey(state.activeModuleId);
        if (!state.moduleAnswers[aKey]) {
            state.moduleAnswers[aKey] = {};
        }
        return state.moduleAnswers[aKey];
    }

    function getPaperTitleInfo(paperId, rawName) {
        if (paperId && (paperId.startsWith('paper_2026') || paperId === 'paper_2026_all')) {
            const datePart = paperId.includes('1022') ? '1022' : (paperId.includes('1023') ? '1023' : (state.selectedSimDate || '1021'));
            const dateCfg = SIM_DATES[datePart] || SIM_DATES['1021'];
            return {
                badge: `${dateCfg.name}精简卷`,
                title: dateCfg.title,
                sub: `${dateCfg.title} (精炼210题)`,
                color: 'text-amber-800 bg-amber-50'
            };
        }
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
        safeSetHtml('icon-folder-2026-all', getIcon('BookOpen', 'w-4 h-4 text-blue-600'));
        safeSetHtml('icon-timer-2026', getIcon('Timer', 'w-3.5 h-3.5 text-orange-600'));
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

        // 2026 精简题库进度更新
        const p2026Modules = [
            { id: 'paper_2026_all', textId: 'prog-text-paper-2026-all', pctId: 'prog-pct-paper-2026-all', barId: 'prog-bar-paper-2026-all', total: 210 },
            { id: 'paper_2026_choice', pctId: 'prog-pct-paper-2026-choice', total: 150 },
            { id: 'paper_2026_multiple', pctId: 'prog-pct-paper-2026-multiple', total: 20 },
            { id: 'paper_2026_judge', pctId: 'prog-pct-paper-2026-judge', total: 40 }
        ];

        p2026Modules.forEach(m => {
            const answerKey = getModuleAnswerKey(m.id);
            const answers = state.moduleAnswers[answerKey] || {};
            const doneCount = Object.keys(answers).length;
            const pct = Math.round((doneCount / m.total) * 100);

            if (m.textId) {
                const elText = document.getElementById(m.textId);
                if (elText) elText.textContent = `已刷 ${doneCount} / ${m.total} 题`;
            }
            if (m.pctId) {
                const elPct = document.getElementById(m.pctId);
                if (elPct) {
                    if (m.id === 'paper_2026_all') elPct.textContent = `${pct}%`;
                    else elPct.textContent = `${doneCount}/${m.total}`;
                }
            }
            if (m.barId) {
                const elBar = document.getElementById(m.barId);
                if (elBar) elBar.style.width = `${pct}%`;
            }
        });

        // 渲染考前冲刺日期药丸高亮
        const curDate = state.selectedSimDate || '1021';
        document.querySelectorAll('.sim-date-tab-btn').forEach(btn => {
            const btnDate = btn.getAttribute('data-sim-date');
            if (btnDate === curDate) {
                btn.className = "sim-date-tab-btn sim-date-tab-active py-1 px-1 rounded-lg text-xs font-bold text-center flex flex-col items-center justify-center transition cursor-pointer";
            } else {
                btn.className = "sim-date-tab-btn sim-date-tab-inactive py-1 px-1 rounded-lg text-xs font-bold text-center flex flex-col items-center justify-center transition cursor-pointer";
            }
        });
        const dateCfg = SIM_DATES[curDate] || SIM_DATES['1021'];
        const allText = document.getElementById('title-sim-all-text');
        if (allText) allText.textContent = `${dateCfg.name}特训全刷`;
        const examText = document.getElementById('title-sim-exam-text');
        if (examText) examText.textContent = `${dateCfg.name}精简模考`;

        const elWrong = document.getElementById('sidebar-wrong-count');
        if (elWrong) elWrong.textContent = `${state.wrongQuestions.size} 道待复习`;

        const btnSidebarClear = document.getElementById('btn-sidebar-clear-wrong');
        if (btnSidebarClear) {
            if (state.wrongQuestions.size > 0) {
                btnSidebarClear.classList.remove('hidden');
            } else {
                btnSidebarClear.classList.add('hidden');
            }
        }

        const elFav = document.getElementById('sidebar-fav-count');
        if (elFav) elFav.textContent = `${state.favoriteQuestions.size} 道重点题`;
    }

    function renderPapersList() {
        const container = document.getElementById('paper-list-container');
        if (!container) return;

        // 历年分卷只展示属于 1000 题体系的原卷（排除独立精简版 paper_2026）
        const fivePapers = rawPapers.filter(p => !p.id.startsWith('paper_2026'));

        container.innerHTML = fivePapers.map((p) => {
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
        if (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz' || state.activeModuleId === 'paper_2026_exam') {
            stopExamTimer();
        }

        if (state.activeModuleId === 'wrong' && newModuleId !== 'wrong') {
            state.wrongSessionList = null;
        }

        state.activeModuleId = newModuleId;
        state.multiDraft.clear();

        if (newModuleId === 'wrong') {
            state.wrongSessionList = allQuestionsPool.filter(q => state.wrongQuestions.has(q.id));
            state.moduleCursors['wrong'] = 0;
            state.moduleAnswers['wrong'] = {};
        }

        // 记忆最近刷过的常规练习试卷
        if (newModuleId !== 'exam_random' && newModuleId !== 'quick_quiz' && newModuleId !== 'paper_2026_exam' && newModuleId !== 'wrong' && newModuleId !== 'favorite') {
            state.recentModuleId = newModuleId;
            state.recentSimDate = state.selectedSimDate || '1021';
        }

        // 若用户切换到了历年分卷，自动展开手风琴
        if (newModuleId && newModuleId.startsWith('paper_') && !newModuleId.startsWith('paper_2026_')) {
            const details = document.getElementById('details-papers-list');
            if (details) details.open = true;
        }

        saveState();
        syncOrderModeUI();
        renderApp();
    }

    function start2026Exam() {
        state.examState.activeQuestions = [...getSim2026Questions()];
        state.examState.totalSeconds = 7200; // 120分钟 (2小时)
        state.examState.secondsLeft = 7200;
        state.examState.answers = {};
        state.examState.isSubmitted = false;
        state.activeModuleId = 'paper_2026_exam';
        state.moduleCursors['paper_2026_exam'] = 0;
        state.multiDraft.clear();

        startExamTimer();
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
        state.multiDraft.clear();

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
        let earnedRaw = 0;
        let totalRaw = 0;

        qs.forEach(q => {
            const userAns = state.examState.answers[q.id];
            const qScore = (typeof q.score === 'number') ? q.score : 0.5;
            totalRaw += qScore;
            if (userAns === q.answer) {
                correctCount++;
                earnedRaw += qScore;
            } else {
                wrongCount++;
                if (userAns) {
                    state.wrongQuestions.add(q.id);
                }
            }
        });

        saveState();

        let totalScore = 0;
        if (state.activeModuleId === 'quick_quiz') {
            totalScore = correctCount * 2;
        } else if (state.activeModuleId === 'exam_random') {
            totalScore = correctCount * 0.5;
        } else if (state.activeModuleId === 'paper_2026_exam') {
            totalScore = totalRaw > 0 ? (earnedRaw / totalRaw) * 100 : 0;
        } else {
            totalScore = totalRaw > 0 ? (earnedRaw / totalRaw) * 100 : 0;
        }

        const fullScore = 100;
        const isPass = totalScore >= 60;

        let examTitle = '全真模拟考试 (200题)';
        if (state.activeModuleId === 'quick_quiz') {
            examTitle = '碎片快速自测 (50题)';
        } else if (state.activeModuleId === 'paper_2026_exam') {
            examTitle = '2026考前精简全真模考 (210题)';
        }

        document.getElementById('result-exam-title').textContent = examTitle;
        document.getElementById('result-score-val').textContent = totalScore.toFixed(1);
        document.getElementById('result-full-score').textContent = (state.activeModuleId === 'paper_2026_exam')
            ? `100 分 (卷面实得 ${earnedRaw.toFixed(1)} / ${totalRaw.toFixed(1)} 分)`
            : `${fullScore} 分`;
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

        // 顶部标题胶囊徽章 (精简考卷名称，严格保全外框胶囊完整形状与圆角)
        const moduleBadge = document.getElementById('badge-current-module');
        const paperBtn = document.getElementById('btn-mobile-paper-selector');
        if (moduleBadge) {
            const dateCfg = SIM_DATES[state.selectedSimDate || '1021'] || SIM_DATES['1021'];
            let titleText = '电工刷题';
            let btnClass = 'flex-shrink-0 inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-black transition cursor-pointer shadow-xs whitespace-nowrap ';

            if (state.activeModuleId === 'paper_2026_all') {
                titleText = `${dateCfg.name}特训卷`;
                btnClass += 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/80';
            } else if (state.activeModuleId === 'paper_2026_choice') {
                titleText = `${dateCfg.name}·单选`;
                btnClass += 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200/80';
            } else if (state.activeModuleId === 'paper_2026_multiple') {
                titleText = `${dateCfg.name}·多选`;
                btnClass += 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200/80';
            } else if (state.activeModuleId === 'paper_2026_judge') {
                titleText = `${dateCfg.name}·判断`;
                btnClass += 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200/80';
            } else if (state.activeModuleId === 'paper_2026_exam') {
                titleText = `${dateCfg.name}模考`;
                btnClass += 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/80';
            } else if (state.activeModuleId === 'full_all') {
                titleText = '历年1000题';
                btnClass += 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/80';
            } else if (state.activeModuleId === 'full_choice') {
                titleText = '单选题专练';
                btnClass += 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200/80';
            } else if (state.activeModuleId === 'full_judge') {
                titleText = '判断题专练';
                btnClass += 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200/80';
            } else if (state.activeModuleId === 'paper_2024') {
                titleText = '2024真题卷';
                btnClass += 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80';
            } else if (state.activeModuleId.startsWith('paper_')) {
                const pNum = state.activeModuleId.replace('paper_', '');
                const numMap = { '1': '一', '2': '二', '3': '三', '4': '四' };
                titleText = `真题卷(${numMap[pNum] || pNum})`;
                btnClass += 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80';
            } else if (state.activeModuleId === 'exam_random') {
                titleText = '全真模拟考';
                btnClass += 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/80';
            } else if (state.activeModuleId === 'quick_quiz') {
                titleText = '快速自测';
                btnClass += 'bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200/80';
            } else if (state.activeModuleId === 'wrong') {
                titleText = '错题回顾本';
                btnClass += 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/80';
            } else if (state.activeModuleId === 'favorite') {
                titleText = '重点收藏夹';
                btnClass += 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200/80';
            }

            moduleBadge.textContent = titleText;
            moduleBadge.className = 'truncate inline-block align-middle';
            if (paperBtn) {
                paperBtn.className = btnClass;
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

        const btnHeaderReset = document.getElementById('btn-header-reset-current');
        if (btnHeaderReset) {
            if (state.activeModuleId === 'wrong') {
                btnHeaderReset.innerHTML = `<span>🧹</span><span class="whitespace-nowrap">清空错题</span>`;
                btnHeaderReset.title = "清空错题本全部记录";
            } else {
                btnHeaderReset.innerHTML = `<span>🔄</span><span class="whitespace-nowrap">重做本卷</span>`;
                btnHeaderReset.title = "清空本套试卷记录，重新开始刷题";
            }
        }

        renderQuestionCard();
    }

    // 题干格式化：将空括号 ( ) 或 （ ） 优雅转换为带宽敞填空槽与底线的标准大括号
    function formatQuestionContent(text) {
        if (!text || typeof text !== 'string') return '';
        return text.replace(/[（(]\s*[）)]/g, '（<span class="q-blank-bracket">&nbsp;</span>）');
    }

    // --- 错题本单独删除单题记录核心逻辑 ---
    function removeSingleWrongQuestion(questionId) {
        if (!state.wrongQuestions.has(questionId) && state.activeModuleId !== 'wrong') {
            return;
        }

        // 1. 从全局错题库集合中彻底剔除
        state.wrongQuestions.delete(questionId);

        // 2. 若当前正在“错题回顾本”模块中练习，同步维护当前轮次题目列表与缓存游标
        if (state.activeModuleId === 'wrong') {
            if (state.wrongSessionList) {
                state.wrongSessionList = state.wrongSessionList.filter(item => item.id !== questionId);
            }
            if (state.moduleAnswers['wrong']) {
                delete state.moduleAnswers['wrong'][questionId];
            }

            saveState();
            updateAllModuleProgresses();

            const remainingList = getActiveQuestions();
            const total = remainingList.length;

            if (total === 0) {
                showToast('🎉 太棒了！错题已全部清空！');
                renderApp();
                return;
            }

            // 安全调整题号游标：若删除的是最后一题，游标前移；否则留在原索引（自然展示下一道错题）
            let curIdx = getCurrentIndex();
            if (curIdx >= total) {
                curIdx = Math.max(0, total - 1);
                setCurrentIndex(curIdx);
            }

            showToast('🗑️ 已从错题本移出该题记录');
            renderApp();
        } else {
            // 在常规试卷练习中移出之前收录的错题
            saveState();
            updateAllModuleProgresses();
            showToast('🗑️ 已从错题本移出该题记录');
            renderQuestionCard();
        }
    }

    // --- 错题本一键清空全部记录核心逻辑 ---
    function clearAllWrongQuestions() {
        const count = state.wrongQuestions.size;
        if (count === 0) {
            showToast('ℹ️ 错题本当前没有任何错题记录，无需清空');
            return;
        }

        const confirmed = confirm(`⚠️ 确认清空错题本中的全部 ${count} 道错题记录吗？\n\n清空后错题记录将被移除，您可以在刷题练习中随时重新收录。`);
        if (!confirmed) return;

        // 1. 清空全局错题库
        state.wrongQuestions.clear();

        // 2. 重置错题本专练轮次与游标
        state.wrongSessionList = [];
        if (state.moduleAnswers['wrong']) {
            state.moduleAnswers['wrong'] = {};
        }
        state.moduleCursors['wrong'] = 0;

        saveState();
        updateAllModuleProgresses();
        closeGridModal();

        showToast(`🧹 已清空错题本全部 ${count} 道错题记录！`);

        if (state.activeModuleId === 'wrong') {
            renderApp();
        } else {
            renderQuestionCard();
        }
    }

    // --- 核心题目卡片渲染 ---
    function renderQuestionCard() {
        const container = document.getElementById('question-scroll-area');
        if (!container) return;

        const activeQuestions = getActiveQuestions();
        const total = activeQuestions.length;
        const curIdx = getCurrentIndex();

        if (total === 0) {
            const isWrongMod = (state.activeModuleId === 'wrong');
            const isFavMod = (state.activeModuleId === 'favorite');
            let emptyIcon = getIcon('Award', 'w-16 h-16 text-yellow-500');
            let emptyTitle = '当前分类暂无题目';
            let emptyDesc = '太棒了！所有题目均已掌握或列表为空。';
            if (isWrongMod) {
                emptyIcon = '<span class="text-5xl">🎉</span>';
                emptyTitle = '错题本已全部清空！';
                emptyDesc = '太棒了！您当前没有任何错题记录，所有考点均已稳妥攻克。';
            } else if (isFavMod) {
                emptyIcon = '<span class="text-5xl">⭐</span>';
                emptyTitle = '重点收藏夹为空';
                emptyDesc = '刷题时点击右上角【收藏本题】即可快速归集重点。';
            }

            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-gray-500 text-center p-8 animate-q-card">
                    <div class="mb-4 flex justify-center">${emptyIcon}</div>
                    <p class="text-xl font-bold text-gray-800 dark:text-white">${emptyTitle}</p>
                    <p class="text-sm mt-1 text-gray-400 dark:text-gray-400">${emptyDesc}</p>
                    <button id="btn-empty-back-full" class="q-bounce-btn mt-5 px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 font-bold text-sm cursor-pointer">
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
        const isExamMode = (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz' || state.activeModuleId === 'paper_2026_exam');
        const isExamOngoing = (isExamMode && !state.examState.isSubmitted);
        const hasAnswered = !!selectedKey;
        const isFeedback = hasAnswered && !isExamOngoing;
        const isCorrect = (selectedKey === q.answer);
        const isFav = state.favoriteQuestions.has(q.id);
        const isMultiple = (q.type === 'multiple');
        const isPeeked = !isExamOngoing && !!state.quickPeekMap[q.id];

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
        } else if (q.type === 'multiple') {
            optionsToRender = (q.options && q.options.length > 0) ? q.options : ['A. 暂缺选项', 'B. 暂缺选项', 'C. 暂缺选项', 'D. 暂缺选项', 'E. 暂缺选项'];
        } else {
            optionsToRender = ['A. 正确', 'B. 错误'];
        }

        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        const optionsHtml = optionsToRender.map((optText, optIdx) => {
            let key = '';
            let displayText = optText;
            if (q.type === 'judge') {
                key = optText.includes('正确') ? '√' : '×';
                displayText = optText.includes('正确') ? '正确' : (optText.includes('错误') ? '错误' : optText);
            } else {
                const match = optText.trim().match(/^([A-Fa-f])[、.．:：\s]/);
                key = match ? match[1].toUpperCase() : (letters[optIdx] || 'A');
                // 剥离选项文字前缀中重复的 A、 / B、 / C、 / D、 / E、，避免与左侧徽章重复
                displayText = optText.replace(/^[A-Fa-f][、.．:：\s]\s*/, '').trim();
            }

            let btnClass = "w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group relative overflow-hidden q-bounce-btn ";
            let badgeClass = "w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold flex-shrink-0 transition-all ";
            let iconHtml = "";

            if (isMultiple) {
                // --- 多选题渲染分支 ---
                const isKeyInStandard = q.answer.includes(key);
                const isKeyInUserSelected = selectedKey ? selectedKey.includes(key) : false;
                const isKeyDrafted = isExamOngoing ? isKeyInUserSelected : state.multiDraft.has(key);

                if ((state.reciteMode || isPeeked) && !isExamMode) {
                    if (isKeyInStandard) {
                        btnClass += "border-purple-500 bg-purple-50 text-purple-900 font-semibold shadow-sm";
                        badgeClass += "bg-purple-600 text-white shadow-sm";
                        iconHtml = getIcon('CheckCircle', 'w-6 h-6 text-purple-600 relative z-10 flex-shrink-0');
                    } else {
                        btnClass += "border-gray-100 opacity-60 text-gray-500";
                        badgeClass += "bg-gray-100 text-gray-400";
                    }
                } else if (isFeedback) {
                    if (isKeyInUserSelected && isKeyInStandard) {
                        // 选对
                        btnClass += "border-green-500 bg-green-50 text-green-900 font-semibold shadow-sm animate-q-correct";
                        badgeClass += "bg-green-600 text-white shadow-sm animate-q-badge";
                        iconHtml = getIcon('CheckCircle', 'w-6 h-6 text-green-600 relative z-10 flex-shrink-0');
                    } else if (isKeyInUserSelected && !isKeyInStandard) {
                        // 错选
                        btnClass += "border-red-500 bg-red-50 text-red-900 font-semibold shadow-sm animate-q-wrong";
                        badgeClass += "bg-red-600 text-white shadow-sm animate-q-badge";
                        iconHtml = getIcon('XCircle', 'w-6 h-6 text-red-600 relative z-10 flex-shrink-0');
                    } else if (!isKeyInUserSelected && isKeyInStandard) {
                        // 漏选
                        btnClass += "border-amber-400 border-dashed bg-amber-50/80 text-amber-900 font-semibold shadow-sm";
                        badgeClass += "bg-amber-500 text-white shadow-sm";
                        iconHtml = `<span class="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-black">漏选</span>`;
                    } else {
                        btnClass += "border-gray-100 opacity-50 text-gray-500";
                        badgeClass += "bg-gray-100 text-gray-400";
                    }
                } else {
                    // 作答草稿中
                    if (isKeyDrafted) {
                        btnClass += "border-purple-600 bg-purple-50 text-purple-900 font-semibold shadow-sm animate-q-correct";
                        badgeClass += "bg-purple-600 text-white shadow-sm animate-q-badge";
                        iconHtml = getIcon('CheckCircle', 'w-6 h-6 text-purple-600 relative z-10 flex-shrink-0');
                    } else {
                        btnClass += "border-gray-100 hover:border-purple-300 hover:bg-purple-50/40 text-gray-700";
                        badgeClass += "bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-700";
                    }
                }
            } else {
                // --- 单选与判断渲染分支 ---
                const isSelected = (selectedKey === key);
                const isStandardAnswer = (q.answer === key);

                if ((state.reciteMode || isPeeked) && !isExamMode) {
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

        // 3. 多选题专属操作确认栏
        let multiActionHtml = '';
        if (isMultiple && !isFeedback && !state.reciteMode) {
            if (isExamOngoing) {
                const currentExamAns = selectedKey || '';
                multiActionHtml = `
                    <div class="mt-3 p-3 rounded-xl bg-slate-50 text-slate-800 text-xs flex items-center justify-between border border-slate-200">
                        <span class="font-medium text-slate-600">💡 多选题（点击选项直接切换勾选/取消）</span>
                        <span class="font-bold">当前已选：<span class="text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-300 font-black">${currentExamAns || '未选择'}</span></span>
                    </div>
                `;
            } else {
                const draftArr = Array.from(state.multiDraft).sort();
                const draftText = draftArr.length > 0 ? draftArr.join('') : '';
                multiActionHtml = `
                    <div class="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-q-card">
                        <div class="flex items-center gap-2 text-sm text-slate-800">
                            <span class="font-bold">当前已勾选：</span>
                            <span class="px-3 py-1 rounded-full font-black text-xs bg-purple-100 text-purple-800 tracking-wider">
                                ${draftText || '尚未选择'}
                            </span>
                            <span class="text-xs text-slate-500 hidden sm:inline">（可多选 A~E，勾选完毕后点击确认提交）</span>
                        </div>
                        <button id="btn-submit-multiple" class="q-bounce-btn w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-sm shadow-md transition ${draftArr.length > 0 ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}" ${draftArr.length > 0 ? '' : 'disabled'}>
                            确认提交本题答案
                        </button>
                    </div>
                `;
            }
        }

        // 4. 答案解析横幅
        let feedbackBannerHtml = '';
        if (state.reciteMode || isFeedback || isPeeked) {
            const isBannerCorrect = isCorrect || state.reciteMode || isPeeked;
            const bannerBg = (isPeeked && !hasAnswered) ? 'bg-amber-50 border-amber-200 text-amber-900' : (isBannerCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800');
            let bannerTitle = (isPeeked && !hasAnswered) ? '本题标准答案速查' : (isBannerCorrect ? (state.reciteMode ? '考点标准答案' : (state.activeModuleId === 'wrong' ? '回答正确！🎉 成功攻克已移出错题本' : '回答正确！')) : '回答错误！');
            if (isMultiple && isFeedback && !state.reciteMode) {
                bannerTitle = isCorrect ? (state.activeModuleId === 'wrong' ? '多选题回答完全正确！🎉 成功攻克已移出错题本' : '多选题回答完全正确！(+1.0分)') : '多选题回答不完整或错误！(不得分)';
            }
            const bannerIcon = (isPeeked && !hasAnswered) ? '<span>💡</span>' : (isBannerCorrect ? getIcon('CheckCircle', 'w-5 h-5 text-green-600') : getIcon('XCircle', 'w-5 h-5 text-red-600'));

            let removeWrongBtn = '';
            if (state.wrongQuestions.has(q.id)) {
                removeWrongBtn = `
                    <button id="btn-remove-from-wrong" class="q-bounce-btn text-xs flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-red-50 text-red-600 transition shadow-sm font-bold whitespace-nowrap">
                        ${getIcon('Trash', 'w-3.5 h-3.5')} 从错题本移出
                    </button>
                `;
            }

            let yourAnsHtml = '';
            if (!state.reciteMode && hasAnswered) {
                yourAnsHtml = `
                    <span class="ml-3 text-sm">您的答案：<span class="font-black ${isCorrect ? 'text-green-700' : 'text-red-600'} text-lg">${selectedKey || '未作答'}</span></span>
                `;
            }

            feedbackBannerHtml = `
                <div class="mt-6 p-5 rounded-2xl border ${bannerBg} animate-q-banner flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                        <div class="font-black flex items-center gap-2 mb-1 text-base">
                            ${bannerIcon} <span>${bannerTitle}</span>
                        </div>
                        <div class="text-sm pl-7">
                            标准答案：<span class="font-black text-2xl text-green-700 mr-2">${q.answer}</span>
                            ${yourAnsHtml}
                            <span class="text-xs opacity-75 ml-3">来源：${q.paperName || '高级维修电工题库'}</span>
                        </div>
                    </div>
                    ${removeWrongBtn}
                </div>
            `;
        }

        // 5. 组装整张题目卡片
        container.innerHTML = `
            <div class="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative animate-q-card">
                
                <!-- 卡片顶栏 -->
                <div class="p-6 md:p-8">
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="px-2.5 py-1 rounded-md text-xs font-black ${q.type === 'multiple' ? 'bg-purple-100 text-purple-900' : (q.type === 'judge' ? 'bg-cyan-100 text-cyan-800' : 'bg-blue-100 text-blue-800')}">
                                ${q.type === 'multiple' ? '多选题 (1.0分)' : (q.type === 'judge' ? '判断题 (0.5分)' : '单选题 (0.5分)')}
                            </span>
                            <span class="text-xs text-gray-400 font-medium hidden sm:inline">
                                来源：${q.paperName || '高级维修电工题库'}
                            </span>
                        </div>

                        <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <!-- 🗑️ 移出错题本按钮 (单题独立删除错题记录) -->
                            ${(!isExamOngoing && (state.activeModuleId === 'wrong' || state.wrongQuestions.has(q.id))) ? `
                            <button id="btn-card-remove-wrong" class="q-bounce-btn flex items-center gap-1 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full transition border cursor-pointer shadow-sm whitespace-nowrap" title="从错题本移出并清除该题记录">
                                ${getIcon('Trash', 'w-3.5 h-3.5')}
                                <span>移出错题</span>
                            </button>
                            ` : ''}

                            <!-- 💡 看答案速查按钮 -->
                            ${!isExamOngoing ? `
                            <button id="btn-quick-peek-answer" class="q-bounce-btn flex items-center gap-1 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full transition border cursor-pointer whitespace-nowrap ${isPeeked ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-amber-800 border-gray-200'}" title="快速展开/收起本题答案">
                                <span>💡</span>
                                <span>${isPeeked ? '收起答案' : '看答案'}</span>
                            </button>
                            ` : ''}

                            <!-- 收藏本题按钮 (Q 弹星星) -->
                            <button id="btn-toggle-favorite" class="q-bounce-btn flex items-center gap-1.5 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${isFav ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-q-star' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}">
                                ${isFav ? getIcon('StarFilled', 'w-4 h-4') : getIcon('Star', 'w-4 h-4')}
                                <span>${isFav ? '已收藏' : '收藏本题'}</span>
                            </button>
                        </div>
                    </div>

                    <!-- 题干正文 -->
                    <h2 class="q-title-text text-lg md:text-xl font-bold text-gray-800 leading-relaxed mb-4">
                        <span class="text-blue-600 font-black mr-1">${curIdx + 1}.</span> ${formatQuestionContent(q.content)}
                    </h2>

                    <!-- 附带电路图 -->
                    ${circuitImgHtml}

                    <!-- 选项列表 -->
                    <div class="space-y-3 mt-6">
                        ${optionsHtml}
                    </div>

                    <!-- 多选题专属操作确认栏 -->
                    ${multiActionHtml}

                    <!-- 答案反馈横幅 -->
                    ${feedbackBannerHtml}
                </div>

                <!-- 卡片底栏 (切题控制) -->
                <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <button id="btn-prev-q" class="q-bounce-btn px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition ${curIdx > 0 ? 'bg-white text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}" ${curIdx === 0 ? 'disabled' : ''}>
                        ‹ 上一题
                    </button>

                    <span class="text-xs text-gray-400 hidden sm:inline">
                        快捷键：键盘 1/2/3/4/5 或 A/B/C/D/E 选答，多选按 Enter 确认，← / → 切题，手机屏幕可左右划动
                    </span>

                    <div class="flex items-center gap-2">
                        ${isExamMode && !state.examState.isSubmitted ? `
                            <button id="btn-exam-submit-card" class="q-bounce-btn px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md transition">
                                提交试卷
                            </button>
                        ` : ''}

                        ${curIdx < total - 1 ? `
                            <button id="btn-next-q" class="q-bounce-btn px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition bg-blue-600 text-white shadow-md hover:bg-blue-700 cursor-pointer">
                                下一题 ›
                            </button>
                        ` : (
                            !isExamMode ? (
                                state.activeModuleId === 'wrong' ? (
                                    state.wrongQuestions.size === 0 ? `
                                        <button id="btn-wrong-all-cleared" class="q-bounce-btn px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 cursor-pointer">
                                            <span>🎉</span>
                                            <span>错题已全部攻克！返回题库</span>
                                        </button>
                                    ` : `
                                        <div class="flex items-center gap-2">
                                            <button id="btn-restart-wrong-clear" class="q-bounce-btn px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 transition bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer" title="清空错题本全部记录">
                                                <span>🧹</span>
                                                <span>清空错题本</span>
                                            </button>
                                            <button id="btn-restart-wrong-round" class="q-bounce-btn px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-200 cursor-pointer">
                                                <span>🔄</span>
                                                <span>再练剩余 ${state.wrongQuestions.size} 道错题</span>
                                            </button>
                                        </div>
                                    `
                                ) : (
                                    (total > 0 && Object.keys(answersMap).length >= total) ? `
                                        <button id="btn-show-celebration" class="q-bounce-btn px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition animate-q-pulse cursor-pointer">
                                            <span>🎉</span>
                                            <span>查看通关报告</span>
                                        </button>
                                    ` : `
                                        <button id="btn-open-grid-from-end" class="q-bounce-btn px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 transition bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 cursor-pointer" title="点击打开题号面板检查未答题目">
                                            <span>🏁</span>
                                            <span>已到末题 (查漏补缺)</span>
                                        </button>
                                    `
                                )
                            ) : ''
                        )}
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

        // 多选题提交按钮
        const btnSubmitMulti = document.getElementById('btn-submit-multiple');
        if (btnSubmitMulti) {
            btnSubmitMulti.onclick = () => {
                submitMultipleChoice(q);
            };
        }

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

        // 通关成绩与查漏补缺
        const btnCelebration = document.getElementById('btn-show-celebration');
        if (btnCelebration) {
            btnCelebration.onclick = () => showModuleCompleteCelebration();
        }
        const btnGridEnd = document.getElementById('btn-open-grid-from-end');
        if (btnGridEnd) {
            btnGridEnd.onclick = () => openGridModal();
        }

        // 模考交卷
        const btnSubmitCard = document.getElementById('btn-exam-submit-card');
        if (btnSubmitCard) {
            btnSubmitCard.onclick = () => {
                if (confirm('确认交卷并生成成绩单吗？')) submitExam();
            };
        }

        // 💡 快速看答案切换
        const btnQuickPeek = document.getElementById('btn-quick-peek-answer');
        if (btnQuickPeek) {
            btnQuickPeek.onclick = () => {
                state.quickPeekMap[q.id] = !state.quickPeekMap[q.id];
                renderQuestionCard();
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

        // 从错题本移出 (反馈横幅按键)
        const btnRemoveWrong = document.getElementById('btn-remove-from-wrong');
        if (btnRemoveWrong) {
            btnRemoveWrong.onclick = () => {
                removeSingleWrongQuestion(q.id);
            };
        }

        // 移出错题本 (卡片顶栏常驻按键)
        const btnCardRemoveWrong = document.getElementById('btn-card-remove-wrong');
        if (btnCardRemoveWrong) {
            btnCardRemoveWrong.onclick = () => {
                removeSingleWrongQuestion(q.id);
            };
        }

        // 错题本末题清空
        const btnRestartWrongClear = document.getElementById('btn-restart-wrong-clear');
        if (btnRestartWrongClear) {
            btnRestartWrongClear.onclick = () => {
                clearAllWrongQuestions();
            };
        }

        // 错题本末题交互：再练一轮或攻克完成返回
        const btnRestartWrong = document.getElementById('btn-restart-wrong-round');
        if (btnRestartWrong) {
            btnRestartWrong.onclick = () => {
                if (state.wrongQuestions.size === 0) {
                    showToast('🎉 太棒了！错题已全部清空！');
                    switchModule('full_all');
                    return;
                }
                state.wrongSessionList = allQuestionsPool.filter(item => state.wrongQuestions.has(item.id));
                state.moduleCursors['wrong'] = 0;
                state.moduleAnswers['wrong'] = {};
                renderApp();
            };
        }

        const btnWrongCleared = document.getElementById('btn-wrong-all-cleared');
        if (btnWrongCleared) {
            btnWrongCleared.onclick = () => {
                switchModule('full_all');
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

    // --- 多选题提交判题逻辑 ---
    function submitMultipleChoice(q) {
        if (state.multiDraft.size === 0) {
            showToast('请至少勾选一个选项后再确认');
            return;
        }

        const currentAnswers = getCurrentAnswersMap();
        const finalAns = Array.from(state.multiDraft).sort().join('');
        currentAnswers[q.id] = finalAns;
        state.multiDraft.clear();

        if (finalAns !== q.answer) {
            state.wrongQuestions.add(q.id);
        } else if (state.activeModuleId === 'wrong') {
            state.wrongQuestions.delete(q.id);
            showToast('🎉 成功攻克！已从错题本移出');
        }

        saveState();
        renderQuestionCard();
        updateAllModuleProgresses();
        checkModuleCompletion();

        if (finalAns === q.answer && state.autoAdvance) {
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
    }

    // --- 选项选定逻辑 ---
    function handleOptionSelect(q, key) {
        const isExamMode = (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz' || state.activeModuleId === 'paper_2026_exam');

        // 1. 模拟考场模式
        if (isExamMode) {
            if (state.examState.isSubmitted) return;
            if (q.type === 'multiple') {
                const cur = state.examState.answers[q.id] || '';
                const set = new Set(cur.split(''));
                if (set.has(key)) set.delete(key);
                else set.add(key);
                state.examState.answers[q.id] = Array.from(set).sort().join('');
            } else {
                state.examState.answers[q.id] = key;
            }
            renderQuestionCard();
            return;
        }

        // 2. 多选题练习模式 (勾选/取消草稿)
        if (q.type === 'multiple') {
            const currentAnswers = getCurrentAnswersMap();
            if (currentAnswers[q.id]) {
                return; // 已作答过，不可重复选择
            }
            if (state.multiDraft.has(key)) {
                state.multiDraft.delete(key);
            } else {
                state.multiDraft.add(key);
            }
            renderQuestionCard();
            return;
        }

        // 3. 普通单选/判断刷题模式 (点击即判)
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
        checkModuleCompletion();

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
        const isExamMode = (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz' || state.activeModuleId === 'paper_2026_exam');
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

        // 错题回顾本专属抽屉快捷操作：一键清空错题记录
        const extraActions = document.getElementById('drawer-extra-actions');
        if (extraActions) {
            if (state.activeModuleId === 'wrong' && state.wrongQuestions.size > 0) {
                extraActions.classList.remove('hidden');
                extraActions.innerHTML = `
                    <button id="btn-drawer-clear-wrong" class="q-bounce-btn w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer">
                        <span>🧹</span>
                        <span>清空错题本全部记录 (共 ${state.wrongQuestions.size} 道)</span>
                    </button>
                `;
                const btnDrawerClear = document.getElementById('btn-drawer-clear-wrong');
                if (btnDrawerClear) {
                    btnDrawerClear.onclick = () => clearAllWrongQuestions();
                }
            } else {
                extraActions.classList.add('hidden');
                extraActions.innerHTML = '';
            }
        }

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
            list.innerHTML = `<div class="text-center text-gray-400 py-10 text-sm">输入关键词或点击上方热门考点搜索全量题库 (1630题)</div>`;
            return;
        }

        const hits = allQuestionsPool.filter(q => 
            q.content.includes(cleanKw) || (q.options && q.options.some(opt => opt.includes(cleanKw)))
        );

        if (hits.length === 0) {
            list.innerHTML = `<div class="text-center text-gray-400 py-10 text-sm">未找到包含 "${cleanKw}" 的相关题目</div>`;
            return;
        }

        list.innerHTML = hits.slice(0, 60).map(q => {
            const formattedContent = formatQuestionContent(q.content);
            const highlighted = formattedContent.split(cleanKw).join(`<mark class="bg-amber-200 text-amber-900 px-0.5 rounded font-bold">${cleanKw}</mark>`);
            const typeText = q.type === 'multiple' ? '多选' : (q.type === 'judge' ? '判断' : '单选');
            const is2026 = (q.paperId && q.paperId.startsWith('paper_2026'));
            const badgeClass = is2026 ? 'bg-amber-100 text-amber-900' : 'bg-blue-50 text-blue-700';
            return `
                <div class="search-result-item p-3.5 bg-gray-50 rounded-2xl hover:bg-blue-50 cursor-pointer border border-gray-100 transition q-bounce-btn" data-paper-id="${q.paperId}" data-qid="${q.id}">
                    <div class="flex items-center justify-between text-xs mb-1">
                        <span class="flex items-center gap-1.5">
                            <span class="px-1.5 py-0.5 rounded text-[10px] font-black ${badgeClass}">${is2026 ? '2026精简卷' : '历年1000题'}</span>
                            <span class="text-gray-500 font-medium">${q.paperName} · 第 ${q.index} 题 (${typeText})</span>
                        </span>
                        <span class="text-green-600 font-bold">答案：${q.answer}</span>
                    </div>
                    <div class="text-sm font-medium text-gray-800 leading-relaxed">${highlighted}</div>
                </div>
            `;
        }).join('');

        list.querySelectorAll('.search-result-item').forEach(item => {
            item.onclick = () => {
                const paperId = item.getAttribute('data-paper-id');
                const qId = item.getAttribute('data-qid');
                closeSearchModal();
                if (paperId && paperId.startsWith('paper_2026')) {
                    const datePart = paperId.includes('1022') ? '1022' : (paperId.includes('1023') ? '1023' : '1021');
                    setSimDate(datePart);
                    state.activeModuleId = 'paper_2026_all';
                    const listForDate = getSim2026Questions(datePart);
                    const idx = listForDate.findIndex(q => q.id === qId);
                    setCurrentIndex(idx >= 0 ? idx : 0);
                } else {
                    state.activeModuleId = 'full_all';
                    const idx = all1000Questions.findIndex(q => q.id === qId);
                    setCurrentIndex(idx >= 0 ? idx : 0);
                }
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

    // --- 移动端侧边栏切换 (平滑丝滑高级动效) ---
    function openMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-sidebar-overlay');
        if (sidebar && overlay) {
            sidebar.classList.remove('hidden');
            sidebar.classList.add('fixed', 'inset-y-0', 'left-0', 'z-40', 'flex');
            overlay.classList.remove('hidden');
            requestAnimationFrame(() => {
                sidebar.classList.add('mobile-open');
                overlay.classList.add('overlay-open');
            });
        }
    }
    function closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-sidebar-overlay');
        if (sidebar && overlay) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('overlay-open');
            setTimeout(() => {
                if (!sidebar.classList.contains('mobile-open')) {
                    sidebar.classList.add('hidden');
                    sidebar.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-40');
                    overlay.classList.add('hidden');
                }
            }, 280);
        }
    }

    // --- 背题模式全局同步 ---
    function setReciteMode(val = null) {
        state.reciteMode = (val !== null) ? val : !state.reciteMode;
        saveState();
        syncReciteModeUI();
        renderApp();
        showToast(state.reciteMode ? '👁️ 已开启背题模式 (直接显现考点答案)' : '📝 已关闭背题模式 (自测刷题状态)');
    }

    function syncReciteModeUI() {
        const toggleRecite = document.getElementById('toggle-recite-mode');
        if (toggleRecite) toggleRecite.checked = state.reciteMode;

        const headerBtn = document.getElementById('btn-header-recite-toggle');
        if (headerBtn) {
            if (state.reciteMode) {
                headerBtn.className = 'q-bounce-btn flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition border border-amber-400 bg-amber-500 text-white shadow-sm shadow-amber-200 cursor-pointer whitespace-nowrap';
                const textEl = document.getElementById('header-recite-text');
                if (textEl) textEl.textContent = '背题中';
            } else {
                headerBtn.className = 'q-bounce-btn flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition border border-gray-200 bg-gray-50 hover:bg-amber-50 hover:text-amber-900 text-gray-700 shadow-sm cursor-pointer whitespace-nowrap';
                const textEl = document.getElementById('header-recite-text');
                if (textEl) textEl.textContent = '背题';
            }
        }

        const mobileReciteBtn = document.getElementById('btn-mobile-recite');
        if (mobileReciteBtn) {
            if (state.reciteMode) {
                mobileReciteBtn.className = 'p-2 bg-amber-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm transition';
            } else {
                mobileReciteBtn.className = 'p-2 hover:bg-blue-600 rounded-lg text-white font-bold text-xs flex items-center gap-1 transition';
            }
        }
    }

    // --- 考期切换与首次进入考期自选引导弹窗 ---
    function setSimDate(dateKey) {
        if (!SIM_DATES[dateKey]) return;
        state.selectedSimDate = dateKey;
        state.recentSimDate = dateKey;
        localStorage.setItem('electrician_sim_date_v4', dateKey);
        localStorage.setItem(STORAGE_KEY_RECENT_SIM_DATE, dateKey);

        // 如果当前在 2026 模块，重新渲染题目
        if (state.activeModuleId && state.activeModuleId.startsWith('paper_2026_')) {
            renderApp();
        } else {
            updateAllModuleProgresses();
        }
    }

    const STORAGE_KEY_WELCOME_SEEN = 'electrician_exam_date_prompt_shown_oct2026_v1';

    function initWelcomeDateModal() {
        const modal = document.getElementById('modal-welcome-date');
        if (!modal) return;

        // 如果是通过做题记录链接切换设备的（URL 中包含 sync=），则直接跳过，绝不弹出
        const isFromSyncLink = (window.location.hash && window.location.hash.includes('sync=')) ||
                               (window.location.search && window.location.search.includes('sync=')) ||
                               (window.location.href && window.location.href.includes('sync='));
        if (isFromSyncLink) {
            localStorage.setItem(STORAGE_KEY_WELCOME_SEEN, 'true');
            return;
        }

        // 即便是先前打开过这个网站的老用户，首次打开这个新版，也必须弹出考期提示
        const hasSeenPrompt = localStorage.getItem(STORAGE_KEY_WELCOME_SEEN);
        if (!hasSeenPrompt) {
            setTimeout(() => {
                // 如果当前已经打开了同步确认弹窗，绝不重叠弹出考期弹窗
                const syncConfirm = document.getElementById('sync-confirm-modal');
                if (syncConfirm && !syncConfirm.classList.contains('hidden')) return;
                modal.classList.remove('hidden');
            }, 250);
        }

        const btnClose = document.getElementById('btn-close-welcome-date');
        if (btnClose) {
            btnClose.onclick = () => {
                modal.classList.add('hidden');
                localStorage.setItem(STORAGE_KEY_WELCOME_SEEN, 'true');
                checkFeatureAnnouncementModal(250);
            };
        }

        modal.onclick = (e) => {
            if (e.target.id === 'modal-welcome-date') {
                modal.classList.add('hidden');
                localStorage.setItem(STORAGE_KEY_WELCOME_SEEN, 'true');
                checkFeatureAnnouncementModal(250);
            }
        };

        modal.querySelectorAll('.welcome-date-btn').forEach(btn => {
            btn.onclick = () => {
                const targetDate = btn.getAttribute('data-date');
                localStorage.setItem(STORAGE_KEY_WELCOME_SEEN, 'true');
                if (targetDate === 'all') {
                    modal.classList.add('hidden');
                    switchModule('full_all');
                    showToast('已进入历年 1000 题全量题库');
                } else if (SIM_DATES[targetDate]) {
                    setSimDate(targetDate);
                    modal.classList.add('hidden');
                    switchModule('paper_2026_all');
                    showToast(`已为您自动选中【${SIM_DATES[targetDate].name}考生专属卷】`);
                }
                checkFeatureAnnouncementModal(350);
            };
        });

        const btnReselect = document.getElementById('btn-reselect-sim-date');
        if (btnReselect) {
            btnReselect.onclick = () => {
                modal.classList.remove('hidden');
            };
        }
    }

    // --- 2026 乱序刷题重磅新特性首次引导弹窗 ---
    const STORAGE_KEY_SHUFFLE_ANNOUNCED = 'electrician_feature_shuffle_announced_v1';

    function openFeatureAnnouncementModal() {
        const modal = document.getElementById('modal-feature-announcement');
        if (!modal) return;
        modal.classList.remove('hidden');
    }

    function closeFeatureAnnouncementModal() {
        const modal = document.getElementById('modal-feature-announcement');
        if (modal) modal.classList.add('hidden');
        localStorage.setItem(STORAGE_KEY_SHUFFLE_ANNOUNCED, 'true');
    }

    function checkFeatureAnnouncementModal(delay = 350) {
        // 如果是通过做题记录链接切换设备的（URL 中包含 sync=），跳过
        const isFromSyncLink = (window.location.hash && window.location.hash.includes('sync=')) ||
                               (window.location.search && window.location.search.includes('sync=')) ||
                               (window.location.href && window.location.href.includes('sync='));
        if (isFromSyncLink) {
            localStorage.setItem(STORAGE_KEY_SHUFFLE_ANNOUNCED, 'true');
            return;
        }

        const hasAnnounced = localStorage.getItem(STORAGE_KEY_SHUFFLE_ANNOUNCED);
        if (hasAnnounced) return;

        const welcomeModal = document.getElementById('modal-welcome-date');
        const syncConfirm = document.getElementById('sync-confirm-modal');
        const isWelcomeShowing = (welcomeModal && !welcomeModal.classList.contains('hidden'));
        const isSyncShowing = (syncConfirm && !syncConfirm.classList.contains('hidden'));

        if (isWelcomeShowing || isSyncShowing) {
            return;
        }

        setTimeout(() => {
            const hasSeen = localStorage.getItem(STORAGE_KEY_SHUFFLE_ANNOUNCED);
            const wm = document.getElementById('modal-welcome-date');
            if (!hasSeen && (!wm || wm.classList.contains('hidden'))) {
                openFeatureAnnouncementModal();
            }
        }, delay);
    }

    function initFeatureAnnouncementModal() {
        const modal = document.getElementById('modal-feature-announcement');
        if (!modal) return;

        const btnClose = document.getElementById('btn-close-feature-announcement');
        if (btnClose) {
            btnClose.onclick = closeFeatureAnnouncementModal;
        }

        const btnKeep = document.getElementById('btn-feature-keep-seq');
        if (btnKeep) {
            btnKeep.onclick = () => {
                closeFeatureAnnouncementModal();
                showToast('已保持原卷顺序刷题');
            };
        }

        const btnTryShuffle = document.getElementById('btn-feature-try-shuffle');
        if (btnTryShuffle) {
            btnTryShuffle.onclick = () => {
                closeFeatureAnnouncementModal();
                const ansMap = getCurrentAnswersMap();
                const answeredCount = Object.keys(ansMap).length;
                if (answeredCount === 0) {
                    executeDirectOrderSwitch('shuffle');
                } else {
                    pendingTargetOrderMode = 'shuffle';
                    openSwitchOrderModal('shuffle', answeredCount);
                }
            };
        }

        modal.onclick = (e) => {
            if (e.target.id === 'modal-feature-announcement') {
                closeFeatureAnnouncementModal();
            }
        };
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
            activeModuleId: state.activeModuleId,
            selectedSimDate: state.selectedSimDate || '1021',
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

        // 若用户在进行跨设备同步，关闭并标记考期迎新弹窗已处理，绝不重叠弹出
        const welcomeModal = document.getElementById('modal-welcome-date');
        if (welcomeModal) welcomeModal.classList.add('hidden');
        localStorage.setItem(STORAGE_KEY_WELCOME_SEEN, 'true');

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
            if (incoming.selectedSimDate && SIM_DATES[incoming.selectedSimDate]) {
                setSimDate(incoming.selectedSimDate);
            }
            if (incoming.activeModuleId) {
                state.activeModuleId = incoming.activeModuleId;
            }
            if (incoming.theme) applyTheme(incoming.theme);
            if (incoming.fontSize) applyFontSize(incoming.fontSize);
            if (incoming.autoAdvance !== undefined) state.autoAdvance = incoming.autoAdvance;

            localStorage.setItem(STORAGE_KEY_WELCOME_SEEN, 'true');
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

            if (incoming.selectedSimDate && SIM_DATES[incoming.selectedSimDate]) {
                setSimDate(incoming.selectedSimDate);
            }
            if (incoming.activeModuleId) {
                state.activeModuleId = incoming.activeModuleId;
            }

            localStorage.setItem(STORAGE_KEY_WELCOME_SEEN, 'true');
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

    // =========================================================================
    // 刷题完成自动侦测、通关祝贺、分卷独立清理与总清理记忆留存引擎
    // =========================================================================

    // --- 刷题完成自动侦测 ---
    function checkModuleCompletion() {
        const isExam = (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz' || state.activeModuleId === 'paper_2026_exam');
        if (isExam || state.activeModuleId === 'wrong' || state.activeModuleId === 'favorite') return;

        const qs = getActiveQuestions();
        const total = qs.length;
        if (total === 0) return;

        const answers = getCurrentAnswersMap();
        const doneCount = Object.keys(answers).length;
        if (doneCount >= total) {
            setTimeout(() => {
                showModuleCompleteCelebration();
            }, 600);
        }
    }

    // --- 弹出通关祝贺弹窗 ---
    function showModuleCompleteCelebration() {
        const modal = document.getElementById('modal-module-complete');
        if (!modal) return;

        const questions = getActiveQuestions();
        const total = questions.length;
        if (total === 0) return;

        const answers = getCurrentAnswersMap();
        let correctCount = 0;
        let wrongCount = 0;

        questions.forEach(q => {
            const a = answers[q.id];
            if (a) {
                if (a === q.answer) correctCount++;
                else wrongCount++;
            }
        });

        const accuracy = total > 0 ? ((correctCount / total) * 100).toFixed(1) + '%' : '0%';

        let modTitle = '当前试卷';
        if (state.activeModuleId === 'paper_2026_all') {
            const d = SIM_DATES[state.selectedSimDate || '1021'] || SIM_DATES['1021'];
            modTitle = `${d.name}考生专属卷 (精炼210题)`;
        } else if (state.activeModuleId.startsWith('paper_2026_')) {
            const d = SIM_DATES[state.selectedSimDate || '1021'] || SIM_DATES['1021'];
            modTitle = `${d.name}专项卷`;
        } else if (state.activeModuleId === 'full_all') {
            modTitle = '历年 1000 题全量题库';
        } else if (state.activeModuleId.startsWith('paper_')) {
            const info = getPaperTitleInfo(state.activeModuleId, '');
            modTitle = info.title;
        }

        const elTitle = document.getElementById('complete-modal-title');
        if (elTitle) elTitle.textContent = `太棒了！您已刷完【${modTitle}】`;

        safeSetHtml('complete-stat-total', `${total} 题`);
        safeSetHtml('complete-stat-correct', `${correctCount} 题`);
        safeSetHtml('complete-stat-accuracy', `${accuracy}`);

        const btnReviewWrong = document.getElementById('btn-complete-review-wrong');
        const textWrongHint = document.getElementById('complete-wrong-hint');
        if (btnReviewWrong && textWrongHint) {
            if (wrongCount > 0) {
                textWrongHint.textContent = `共有 ${wrongCount} 道错题待强化攻克`;
                btnReviewWrong.classList.remove('hidden');
                btnReviewWrong.onclick = () => {
                    modal.classList.add('hidden');
                    switchModule('wrong');
                };
            } else {
                btnReviewWrong.classList.add('hidden');
            }
        }

        modal.classList.remove('hidden');
    }

    function closeModuleCompleteModal() {
        const modal = document.getElementById('modal-module-complete');
        if (modal) modal.classList.add('hidden');
    }

    // --- 单独清空某一试卷的做题进度 (支持指定顺序/乱序，严格执行真随机) ---
    function resetSingleModule(modId, simDateKey = null, orderMode = null) {
        const effectiveDate = simDateKey || state.selectedSimDate || '1021';
        let ansKey = modId;
        let curKey = modId;
        let mapKey = modId;
        if (modId && modId.startsWith('paper_2026_')) {
            ansKey = `${modId}_${effectiveDate}`;
            curKey = `${modId}_${effectiveDate}`;
            mapKey = `${modId}_${effectiveDate}`;
        }
        
        state.moduleAnswers[ansKey] = {};
        state.moduleCursors[curKey] = 0;

        if (modId.startsWith('paper_2026_')) {
            state.selectedSimDate = effectiveDate;
            state.recentSimDate = effectiveDate;
        }

        if (orderMode === 'shuffle') {
            state.orderMode = 'shuffle';
            // 关键：强制删除旧的乱序映射缓存，生成全新的真随机序列！
            delete state.moduleShuffleMaps[mapKey];
            regenerateModuleShuffle(modId);
        } else if (orderMode === 'seq') {
            state.orderMode = 'seq';
        }

        state.activeModuleId = modId;
        state.recentModuleId = modId;
        state.multiDraft.clear();

        saveState();
        syncOrderModeUI();
        updateAllModuleProgresses();
        renderApp();

        let paperName = '本套试卷';
        if (modId.startsWith('paper_2026_')) {
            const d = SIM_DATES[effectiveDate] || SIM_DATES['1021'];
            paperName = `${d.name}考前特训卷`;
        } else if (modId.startsWith('paper_')) {
            const info = getPaperTitleInfo(modId, '');
            paperName = info.title;
        } else if (modId === 'full_all') {
            paperName = '历年 1000 题全量题库';
        }
        const orderText = state.orderMode === 'shuffle' ? '真随机乱序' : '顺序';
        showToast(`🔄 已清空【${paperName}】，已切换为【${orderText}模式】从第 1 题开始！`);
    }

    // --- 清空所有做题记录 (核心：保留并停留在最近刷过的试卷，光标归零，绝不强制跳回1000题) ---
    function clearAllProgressKeepRecent() {
        Object.keys(state.moduleAnswers).forEach(k => {
            state.moduleAnswers[k] = {};
        });
        Object.keys(state.moduleCursors).forEach(k => {
            state.moduleCursors[k] = 0;
        });
        state.wrongQuestions.clear();
        state.favoriteQuestions.clear();
        state.multiDraft.clear();
        state.quickPeekMap = {};
        state.moduleShuffleMaps = {};
        state.wrongSessionList = null;

        // 记忆留存：停留在用户最近刷过的那套试卷与考期
        const keepModule = state.recentModuleId || 'paper_2026_all';
        const keepDate = state.recentSimDate || '1021';
        state.selectedSimDate = keepDate;
        state.activeModuleId = keepModule;
        state.moduleCursors[getModuleCursorKey(keepModule)] = 0;

        saveState();
        syncOrderModeUI();
        updateAllModuleProgresses();
        renderApp();
        showToast('🧹 已清空所有做题记录！已保留在最近练习试卷，从第 1 题开始');
    }

    // --- 分卷进度清理与独立管理弹窗渲染 (选项卡紧凑布局 + 彻底防长出屏幕) ---
    function openManageResetsModal() {
        const modal = document.getElementById('modal-manage-resets');
        if (!modal) return;

        // 1. 当前试卷模块 (置顶紧凑卡片)
        const curMod = state.activeModuleId;
        const curAnsMap = getCurrentAnswersMap();
        const curQs = getActiveQuestions();
        const curTotal = curQs.length || 1;
        const curDone = Object.keys(curAnsMap).length;
        const curPct = Math.round((curDone / curTotal) * 100);

        let curTitle = '历年题库';
        if (curMod === 'paper_2026_all') {
            const d = SIM_DATES[state.selectedSimDate || '1021'] || SIM_DATES['1021'];
            curTitle = `${d.title} (全卷210题)`;
        } else if (curMod.startsWith('paper_2026_')) {
            const d = SIM_DATES[state.selectedSimDate || '1021'] || SIM_DATES['1021'];
            curTitle = `${d.name}精炼专项`;
        } else if (curMod.startsWith('paper_')) {
            const info = getPaperTitleInfo(curMod, '');
            curTitle = info.title;
        } else if (curMod === 'full_all') {
            curTitle = '全部题目全刷 (1000题)';
        } else if (curMod === 'full_choice') {
            curTitle = '单选题专练 (800题)';
        } else if (curMod === 'full_judge') {
            curTitle = '判断题专练 (200题)';
        }

        const titleEl = document.getElementById('manage-cur-paper-title');
        const statEl = document.getElementById('manage-cur-paper-stat');
        const pctEl = document.getElementById('manage-cur-paper-pct');
        if (titleEl) titleEl.textContent = curTitle;
        if (statEl) statEl.textContent = `已刷 ${curDone} / ${curTotal} 题`;
        if (pctEl) pctEl.textContent = `${curPct}%`;

        // 2. 2026 考前特训卷 (1021, 1022, 1023)
        const list2026 = document.getElementById('manage-list-2026');
        if (list2026) {
            list2026.innerHTML = ['1021', '1022', '1023'].map(dateKey => {
                const cfg = SIM_DATES[dateKey];
                const ans = state.moduleAnswers[`paper_2026_all_${dateKey}`] || {};
                const done = Object.keys(ans).length;
                const pct = Math.round((done / 210) * 100);
                const isCur = (state.activeModuleId === 'paper_2026_all' && state.selectedSimDate === dateKey);

                return `
                    <div class="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 flex items-center justify-between gap-2 shadow-2xs transition">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1.5 mb-1">
                                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">${cfg.name}</span>
                                <span class="font-bold text-gray-800 text-xs truncate">${cfg.title}</span>
                                ${isCur ? '<span class="text-[9px] bg-blue-100 text-blue-700 px-1 py-0.2 rounded font-black">当前</span>' : ''}
                            </div>
                            <div class="flex items-center gap-2 text-[10px] text-gray-400">
                                <span>进度：${done} / 210 题 (${pct}%)</span>
                                <div class="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                                </div>
                            </div>
                        </div>
                        <button class="btn-manage-reset-single px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition whitespace-nowrap cursor-pointer flex items-center gap-1" data-mod="paper_2026_all" data-date="${dateKey}">
                            <span>🧹</span>
                            <span>清空重做</span>
                        </button>
                    </div>
                `;
            }).join('');
        }

        // 3. 历年真题分卷 (2024, 卷一, 卷二, 卷三, 卷四)
        const listPapers = document.getElementById('manage-list-papers');
        if (listPapers) {
            const fivePapers = rawPapers.filter(p => !p.id.startsWith('paper_2026'));
            listPapers.innerHTML = fivePapers.map(p => {
                const ans = state.moduleAnswers[p.id] || {};
                const done = Object.keys(ans).length;
                const pct = Math.round((done / 200) * 100);
                const info = getPaperTitleInfo(p.id, p.name);
                const isCur = (state.activeModuleId === p.id);

                return `
                    <div class="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 flex items-center justify-between gap-2 shadow-2xs transition">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1.5 mb-1">
                                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${info.color}">${info.badge}</span>
                                <span class="font-bold text-gray-800 text-xs truncate">${info.title}</span>
                                ${isCur ? '<span class="text-[9px] bg-blue-100 text-blue-700 px-1 py-0.2 rounded font-black">当前</span>' : ''}
                            </div>
                            <div class="flex items-center gap-2 text-[10px] text-gray-400">
                                <span>进度：${done} / 200 题 (${pct}%)</span>
                                <div class="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${pct}%"></div>
                                </div>
                            </div>
                        </div>
                        <button class="btn-manage-reset-single px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition whitespace-nowrap cursor-pointer flex items-center gap-1" data-mod="${p.id}">
                            <span>🧹</span>
                            <span>清空重做</span>
                        </button>
                    </div>
                `;
            }).join('');
        }

        // 4. 1000 题全量复习模块
        const listFull = document.getElementById('manage-list-full');
        if (listFull) {
            const fullItems = [
                { id: 'full_all', title: '全部题目 (1000题)', total: 1000, badge: '全量题库', color: 'bg-blue-50 text-blue-700' },
                { id: 'full_choice', title: '单选题专练 (800题)', total: 800, badge: '单选题型', color: 'bg-indigo-50 text-indigo-700' },
                { id: 'full_judge', title: '判断题专练 (200题)', total: 200, badge: '判断题型', color: 'bg-cyan-50 text-cyan-700' }
            ];
            listFull.innerHTML = fullItems.map(item => {
                const ans = state.moduleAnswers[item.id] || {};
                const done = Object.keys(ans).length;
                const pct = Math.round((done / item.total) * 100);
                const isCur = (state.activeModuleId === item.id);

                return `
                    <div class="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 flex items-center justify-between gap-2 shadow-2xs transition">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1.5 mb-1">
                                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${item.color}">${item.badge}</span>
                                <span class="font-bold text-gray-800 text-xs truncate">${item.title}</span>
                                ${isCur ? '<span class="text-[9px] bg-blue-100 text-blue-700 px-1 py-0.2 rounded font-black">当前</span>' : ''}
                            </div>
                            <div class="flex items-center gap-2 text-[10px] text-gray-400">
                                <span>进度：${done} / ${item.total} 题 (${pct}%)</span>
                                <div class="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div class="bg-indigo-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                                </div>
                            </div>
                        </div>
                        <button class="btn-manage-reset-single px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition whitespace-nowrap cursor-pointer flex items-center gap-1" data-mod="${item.id}">
                            <span>🧹</span>
                            <span>清空重做</span>
                        </button>
                    </div>
                `;
            }).join('');
        }

        // 绑定单独清空事件
        modal.querySelectorAll('.btn-manage-reset-single').forEach(btn => {
            btn.onclick = () => {
                const mod = btn.getAttribute('data-mod');
                const dateKey = btn.getAttribute('data-date');
                let name = '本试卷';
                if (mod === 'paper_2026_all') {
                    const d = SIM_DATES[dateKey || '1021'];
                    name = `${d.name}考前特训卷`;
                } else if (mod.startsWith('paper_')) {
                    const info = getPaperTitleInfo(mod, '');
                    name = info.title;
                } else if (mod === 'full_all') name = '历年1000题全量题库';
                else if (mod === 'full_choice') name = '单选题专练(800题)';
                else if (mod === 'full_judge') name = '判断题专练(200题)';

                if (confirm(`确认清空【${name}】的独立做题进度吗？其他试卷不受任何影响。`)) {
                    resetSingleModule(mod, dateKey, state.orderMode);
                    openManageResetsModal(); // 刷新弹窗内部显示
                }
            };
        });

        const scrollBody = modal.querySelector('.app-modal-body');
        if (scrollBody) scrollBody.scrollTop = 0;
        modal.classList.remove('hidden');
    }

    function closeManageResetsModal() {
        const modal = document.getElementById('modal-manage-resets');
        if (modal) modal.classList.add('hidden');
    }

    // --- 试卷快速切换与考期选择弹窗 (点击顶栏试卷名称即刻呼出) ---
    function openPaperSelectorModal() {
        const modal = document.getElementById('modal-paper-selector');
        if (!modal) return;

        // 1. 2026 考前精简特训卷 (1021, 1022, 1023)
        const list2026 = document.getElementById('paper-selector-list-2026');
        if (list2026) {
            list2026.innerHTML = ['1021', '1022', '1023'].map(dateKey => {
                const cfg = SIM_DATES[dateKey];
                const ans = state.moduleAnswers[`paper_2026_all_${dateKey}`] || {};
                const done = Object.keys(ans).length;
                const pct = Math.round((done / 210) * 100);
                const isCur = (state.activeModuleId === 'paper_2026_all' && state.selectedSimDate === dateKey);

                return `
                    <div class="paper-select-card p-3 rounded-2xl border ${isCur ? 'border-amber-400 bg-amber-50/70 shadow-sm' : 'border-gray-200/80 bg-white hover:bg-gray-50/90'} flex items-center justify-between gap-3 transition cursor-pointer group" data-action="date" data-val="${dateKey}">
                        <div class="flex items-center gap-3 min-w-0 flex-1">
                            <div class="w-10 h-10 rounded-xl ${isCur ? 'bg-amber-500 text-white shadow-xs' : 'bg-amber-100 text-amber-800'} flex-shrink-0 flex items-center justify-center text-sm font-black">
                                ${dateKey.substring(2)}
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <span class="font-black text-gray-900 text-xs sm:text-sm group-hover:text-amber-900">${cfg.title}</span>
                                    ${isCur ? '<span class="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-black">当前练习</span>' : ''}
                                </div>
                                <div class="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                    <span>精简 210 题 · 已刷 ${done}/210 (${pct}%)</span>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-1.5 max-w-[180px]">
                                    <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="flex-shrink-0">
                            <span class="px-3 py-1.5 rounded-xl text-xs font-bold ${isCur ? 'bg-amber-500 text-white shadow-xs' : 'bg-gray-100 text-gray-600 group-hover:bg-amber-500 group-hover:text-white'} transition whitespace-nowrap">
                                ${isCur ? '正在刷 ➔' : '切换 ➔'}
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 2. 历年真题分卷 (5套卷)
        const listPapers = document.getElementById('paper-selector-list-papers');
        if (listPapers) {
            const fivePapers = rawPapers.filter(p => !p.id.startsWith('paper_2026'));
            listPapers.innerHTML = fivePapers.map(p => {
                const ans = state.moduleAnswers[p.id] || {};
                const done = Object.keys(ans).length;
                const pct = Math.round((done / 200) * 100);
                const info = getPaperTitleInfo(p.id, p.name);
                const isCur = (state.activeModuleId === p.id);

                return `
                    <div class="paper-select-card p-3 rounded-2xl border ${isCur ? 'border-blue-400 bg-blue-50/70 shadow-sm' : 'border-gray-200/80 bg-white hover:bg-gray-50/90'} flex items-center justify-between gap-3 transition cursor-pointer group" data-action="paper" data-val="${p.id}">
                        <div class="flex items-center gap-3 min-w-0 flex-1">
                            <div class="w-10 h-10 rounded-xl ${isCur ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-100 text-blue-800'} flex-shrink-0 flex items-center justify-center text-xs font-black">
                                ${info.badge.replace('模考', '').replace('真题', '')}
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <span class="font-black text-gray-900 text-xs sm:text-sm group-hover:text-blue-900">${info.title}</span>
                                    ${isCur ? '<span class="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-black">当前练习</span>' : ''}
                                </div>
                                <div class="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                    <span>原卷 200 题 · 已刷 ${done}/200 (${pct}%)</span>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-1.5 max-w-[180px]">
                                    <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${pct}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="flex-shrink-0">
                            <span class="px-3 py-1.5 rounded-xl text-xs font-bold ${isCur ? 'bg-blue-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-600 group-hover:text-white'} transition whitespace-nowrap">
                                ${isCur ? '正在刷 ➔' : '切换 ➔'}
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 3. 1000 题全量题库 (3大模块)
        const listFull = document.getElementById('paper-selector-list-full');
        if (listFull) {
            const fullItems = [
                { id: 'full_all', title: '全部题目通刷 (1000题)', total: 1000, sub: '全量题库 · 单选800/判断200', tag: '全量' },
                { id: 'full_choice', title: '单选题专项 (800题)', total: 800, sub: '题型专项 · 地毯式攻坚', tag: '单选' },
                { id: 'full_judge', title: '判断题专项 (200题)', total: 200, sub: '题型专项 · 地毯式攻坚', tag: '判断' }
            ];
            listFull.innerHTML = fullItems.map(item => {
                const ans = state.moduleAnswers[item.id] || {};
                const done = Object.keys(ans).length;
                const pct = Math.round((done / item.total) * 100);
                const isCur = (state.activeModuleId === item.id);

                return `
                    <div class="paper-select-card p-3 rounded-2xl border ${isCur ? 'border-indigo-400 bg-indigo-50/70 shadow-sm' : 'border-gray-200/80 bg-white hover:bg-gray-50/90'} flex items-center justify-between gap-3 transition cursor-pointer group" data-action="full" data-val="${item.id}">
                        <div class="flex items-center gap-3 min-w-0 flex-1">
                            <div class="w-10 h-10 rounded-xl ${isCur ? 'bg-indigo-600 text-white shadow-xs' : 'bg-indigo-100 text-indigo-800'} flex-shrink-0 flex items-center justify-center text-xs font-black">
                                ${item.tag}
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <span class="font-black text-gray-900 text-xs sm:text-sm group-hover:text-indigo-900">${item.title}</span>
                                    ${isCur ? '<span class="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-black">当前练习</span>' : ''}
                                </div>
                                <div class="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                    <span>${item.sub} · 已刷 ${done}/${item.total} (${pct}%)</span>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-1.5 max-w-[180px]">
                                    <div class="bg-indigo-600 h-1.5 rounded-full" style="width: ${pct}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="flex-shrink-0">
                            <span class="px-3 py-1.5 rounded-xl text-xs font-bold ${isCur ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-600 group-hover:text-white'} transition whitespace-nowrap">
                                ${isCur ? '正在刷 ➔' : '切换 ➔'}
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 统一卡片点击事件
        modal.querySelectorAll('.paper-select-card').forEach(card => {
            card.onclick = () => {
                const action = card.getAttribute('data-action');
                const val = card.getAttribute('data-val');
                if (action === 'date') {
                    setSimDate(val);
                    switchModule('paper_2026_all');
                } else if (action === 'paper' || action === 'full') {
                    switchModule(val);
                }
                closePaperSelectorModal();
                closeMobileSidebar();
            };
        });

        const scrollBody = modal.querySelector('.app-modal-body');
        if (scrollBody) scrollBody.scrollTop = 0;
        modal.classList.remove('hidden');
    }

    function closePaperSelectorModal() {
        const modal = document.getElementById('modal-paper-selector');
        if (modal) modal.classList.add('hidden');
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

        // 1.4 考前冲刺日期分段选择器药丸
        document.querySelectorAll('.sim-date-tab-btn').forEach(btn => {
            btn.onclick = () => {
                const dateKey = btn.getAttribute('data-sim-date');
                if (dateKey) {
                    setSimDate(dateKey);
                    if (!state.activeModuleId.startsWith('paper_2026_')) {
                        switchModule('paper_2026_all');
                    } else {
                        renderApp();
                    }
                    showToast(`已切换至【${SIM_DATES[dateKey].name}】精简题库`);
                }
            };
        });

        // 1.5 2026 精简题库专区按钮绑定
        document.querySelectorAll('[data-module-id]').forEach(btn => {
            btn.onclick = () => {
                const modId = btn.getAttribute('data-module-id');
                if (modId === 'paper_2026_exam') {
                    const dateCfg = SIM_DATES[state.selectedSimDate || '1021'] || SIM_DATES['1021'];
                    if (confirm(`即将进入【${dateCfg.name}精简全真模考】：共 210 题（150道单选、20道多选、40道判断），限时 120 分钟，交卷后折算 100 分制，准备好了吗？`)) {
                        start2026Exam();
                        closeMobileSidebar();
                    }
                    return;
                }
                switchModule(modId);
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

        // 7. 背题模式开关 (侧边栏 + 顶栏 + 移动端顶栏全联动)
        const toggleRecite = document.getElementById('toggle-recite-mode');
        if (toggleRecite) {
            toggleRecite.checked = state.reciteMode;
            toggleRecite.onchange = (e) => setReciteMode(e.target.checked);
        }
        const btnHeaderRecite = document.getElementById('btn-header-recite-toggle');
        if (btnHeaderRecite) {
            btnHeaderRecite.onclick = () => setReciteMode();
        }
        const btnMobileRecite = document.getElementById('btn-mobile-recite');
        if (btnMobileRecite) {
            btnMobileRecite.onclick = () => setReciteMode();
        }

        // 7.1 刷题顺序切换 (原卷顺序 ⇄ 题型内乱序)
        const btnHeaderOrder = document.getElementById('btn-header-order-toggle');
        if (btnHeaderOrder) {
            btnHeaderOrder.onclick = () => toggleOrderMode();
        }
        const btnMobileOrder = document.getElementById('btn-mobile-order');
        if (btnMobileOrder) {
            btnMobileOrder.onclick = () => toggleOrderMode();
        }

        // 7.1.1 顶栏试卷名称标签点击呼出换卷弹窗 (全端通用)
        const btnMobilePaper = document.getElementById('btn-mobile-paper-selector');
        if (btnMobilePaper) {
            btnMobilePaper.onclick = () => openPaperSelectorModal();
        }

        // 7.1.1.1 试卷选择弹窗关闭按键与外层遮罩点击
        const btnClosePaperSelector = document.getElementById('btn-close-paper-selector');
        if (btnClosePaperSelector) btnClosePaperSelector.onclick = closePaperSelectorModal;

        const btnClosePaperSelectorFooter = document.getElementById('btn-close-paper-selector-footer');
        if (btnClosePaperSelectorFooter) btnClosePaperSelectorFooter.onclick = closePaperSelectorModal;

        const modalPaperSelector = document.getElementById('modal-paper-selector');
        if (modalPaperSelector) {
            modalPaperSelector.onclick = (e) => {
                if (e.target.id === 'modal-paper-selector') closePaperSelectorModal();
            };
        }

        // 7.1.2 顺序切换确认弹窗事件绑定
        const btnCloseSwitchOrder = document.getElementById('btn-close-switch-order');
        if (btnCloseSwitchOrder) btnCloseSwitchOrder.onclick = closeSwitchOrderModal;

        const btnCancelSwitchOrder = document.getElementById('btn-switch-order-cancel');
        if (btnCancelSwitchOrder) btnCancelSwitchOrder.onclick = closeSwitchOrderModal;

        const btnSwitchRestart = document.getElementById('btn-switch-order-restart');
        if (btnSwitchRestart) btnSwitchRestart.onclick = executeSwitchOrderRestart;

        const btnSwitchKeep = document.getElementById('btn-switch-order-keep');
        if (btnSwitchKeep) btnSwitchKeep.onclick = executeSwitchOrderKeep;

        const modalSwitchOrder = document.getElementById('modal-switch-order');
        if (modalSwitchOrder) {
            modalSwitchOrder.onclick = (e) => {
                if (e.target.id === 'modal-switch-order') closeSwitchOrderModal();
            };
        }

        // 7.2 顶栏快捷重做本卷按钮
        const btnHeaderReset = document.getElementById('btn-header-reset-current');
        if (btnHeaderReset) {
            btnHeaderReset.onclick = () => {
                if (state.activeModuleId === 'wrong') {
                    clearAllWrongQuestions();
                    return;
                }
                let name = '本试卷';
                if (state.activeModuleId === 'paper_2026_all') {
                    const d = SIM_DATES[state.selectedSimDate || '1021'] || SIM_DATES['1021'];
                    name = `${d.name}特训卷`;
                } else if (state.activeModuleId.startsWith('paper_')) {
                    name = getPaperTitleInfo(state.activeModuleId, '').title;
                } else if (state.activeModuleId === 'full_all') {
                    name = '历年 1000 题全量题库';
                }
                if (confirm(`确认清空【${name}】的独立做题进度，重新开始刷题吗？`)) {
                    resetSingleModule(state.activeModuleId, state.selectedSimDate, state.orderMode);
                }
            };
        }

        // 7.3 侧边栏错题本一键清空按钮
        const btnSidebarClear = document.getElementById('btn-sidebar-clear-wrong');
        if (btnSidebarClear) {
            btnSidebarClear.onclick = (e) => {
                e.stopPropagation();
                clearAllWrongQuestions();
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

        // 9. 重置当前专练进度 (侧边栏底部按钮)
        const btnResetCurrent = document.getElementById('btn-reset-current');
        if (btnResetCurrent) {
            btnResetCurrent.onclick = () => {
                let moduleName = '当前试卷';
                if (state.activeModuleId === 'full_all') moduleName = '全部题目全刷 (1000题)';
                else if (state.activeModuleId === 'full_choice') moduleName = '单选题专练 (800题)';
                else if (state.activeModuleId === 'full_judge') moduleName = '判断题专练 (200题)';
                else if (state.activeModuleId === 'paper_2026_all') {
                    const d = SIM_DATES[state.selectedSimDate || '1021'] || SIM_DATES['1021'];
                    moduleName = `${d.name}特训卷 (210题)`;
                } else if (state.activeModuleId === 'paper_2026_choice') moduleName = '2026单选专项 (150题)';
                else if (state.activeModuleId === 'paper_2026_multiple') moduleName = '2026多选专项 (20题)';
                else if (state.activeModuleId === 'paper_2026_judge') moduleName = '2026判断专项 (40题)';
                else if (state.activeModuleId.startsWith('paper_')) {
                    const info = getPaperTitleInfo(state.activeModuleId, '');
                    moduleName = info.title;
                }

                if (confirm(`确认清空【${moduleName}】的独立做题进度吗？其他试卷与错题本不受影响。`)) {
                    resetSingleModule(state.activeModuleId, state.selectedSimDate, state.orderMode);
                }
            };
        }

        // 9.1 打开分卷独立管理与清理弹窗
        const btnOpenManageResets = document.getElementById('btn-open-manage-resets');
        if (btnOpenManageResets) {
            btnOpenManageResets.onclick = () => {
                openManageResetsModal();
                closeMobileSidebar();
            };
        }

        const btnCloseManageResets = document.getElementById('btn-close-manage-resets');
        if (btnCloseManageResets) btnCloseManageResets.onclick = closeManageResetsModal;

        const btnCloseManageResetsFooter = document.getElementById('btn-close-manage-resets-footer');
        if (btnCloseManageResetsFooter) btnCloseManageResetsFooter.onclick = closeManageResetsModal;

        const modalManageResets = document.getElementById('modal-manage-resets');
        if (modalManageResets) {
            modalManageResets.onclick = (e) => {
                if (e.target.id === 'modal-manage-resets') closeManageResetsModal();
            };
        }

        const btnCurResetSeq = document.getElementById('btn-action-reset-current-seq');
        if (btnCurResetSeq) {
            btnCurResetSeq.onclick = () => {
                resetSingleModule(state.activeModuleId, state.selectedSimDate, 'seq');
                closeManageResetsModal();
            };
        }

        const btnCurResetShuffle = document.getElementById('btn-action-reset-current-shuffle');
        if (btnCurResetShuffle) {
            btnCurResetShuffle.onclick = () => {
                resetSingleModule(state.activeModuleId, state.selectedSimDate, 'shuffle');
                closeManageResetsModal();
            };
        }

        const btnClearKeepRecent = document.getElementById('btn-action-clear-all-keep-recent');
        if (btnClearKeepRecent) {
            btnClearKeepRecent.onclick = () => {
                if (confirm('确认清空所有试卷进度与错题记录吗？系统将自动停留在您当前练习的试卷并归零从第1题重新开始。')) {
                    clearAllProgressKeepRecent();
                    closeManageResetsModal();
                }
            };
        }

        // 9.1.1 分卷管理弹窗选项卡 (Tabs) 切换
        document.querySelectorAll('.tab-manage-btn').forEach(tab => {
            tab.onclick = () => {
                const targetId = tab.getAttribute('data-target');
                document.querySelectorAll('.tab-manage-btn').forEach(b => {
                    b.className = 'tab-manage-btn flex-1 py-1.5 rounded-lg text-center transition cursor-pointer text-gray-600 hover:text-gray-900';
                });
                tab.className = 'tab-manage-btn flex-1 py-1.5 rounded-lg text-center transition cursor-pointer bg-white text-blue-700 shadow-2xs';

                document.querySelectorAll('.manage-tab-panel').forEach(p => {
                    if (p.id === targetId) {
                        p.classList.remove('hidden');
                    } else {
                        p.classList.add('hidden');
                    }
                });
            };
        });

        // 9.2 通关庆祝弹窗交互
        const btnCloseComplete = document.getElementById('btn-close-complete-modal');
        if (btnCloseComplete) btnCloseComplete.onclick = closeModuleCompleteModal;

        const btnCompleteStay = document.getElementById('btn-complete-stay');
        if (btnCompleteStay) btnCompleteStay.onclick = closeModuleCompleteModal;

        const modalComplete = document.getElementById('modal-module-complete');
        if (modalComplete) {
            modalComplete.onclick = (e) => {
                if (e.target.id === 'modal-module-complete') closeModuleCompleteModal();
            };
        }

        const btnRestartShuffle = document.getElementById('btn-complete-restart-shuffle');
        if (btnRestartShuffle) {
            btnRestartShuffle.onclick = () => {
                closeModuleCompleteModal();
                resetSingleModule(state.activeModuleId, state.selectedSimDate, 'shuffle');
            };
        }

        const btnRestartSeq = document.getElementById('btn-complete-restart-seq');
        if (btnRestartSeq) {
            btnRestartSeq.onclick = () => {
                closeModuleCompleteModal();
                resetSingleModule(state.activeModuleId, state.selectedSimDate, 'seq');
            };
        }

        // 10. 清空所有数据 (核心需求：清理后自动停留在最近刷过的那一套试卷，而不是固定跳到1000题)
        const btnClearAll = document.getElementById('btn-clear-all-data');
        if (btnClearAll) {
            btnClearAll.onclick = () => {
                if (confirm('警告：此操作将清空所有模块的做题记录与错题本！\n系统将自动保留在您最近练习的试卷并归零从第1题重新开始。确认执行吗？')) {
                    clearAllProgressKeepRecent();
                    closeMobileSidebar();
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

        // 15. 键盘快捷键 (← / → 切题，1/2/3/4/5 或 A/B/C/D/E 答题，多选按 Enter 确认)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                const lm = document.getElementById('lightbox-modal');
                if (lm && !lm.classList.contains('hidden')) {
                    closeLightbox();
                    return;
                }
                closePaperSelectorModal();
                closeSwitchOrderModal();
                closeManageResetsModal();
                closeModuleCompleteModal();
                closeFeatureAnnouncementModal();
                closeSyncModal();
                closeGridModal();
                closeSearchModal();
                const welcomeModal = document.getElementById('modal-welcome-date');
                if (welcomeModal) welcomeModal.classList.add('hidden');
                const resultModal = document.getElementById('result-modal');
                if (resultModal) resultModal.classList.add('hidden');
                const syncConfirm = document.getElementById('sync-confirm-modal');
                if (syncConfirm) syncConfirm.classList.add('hidden');
                closeMobileSidebar();
                return;
            }

            const sm = document.getElementById('search-modal');
            if (sm && !sm.classList.contains('hidden')) return;

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
            } else if (['1', '2', '3', '4', '5', 'a', 'b', 'c', 'd', 'e', 'A', 'B', 'C', 'D', 'E'].includes(e.key)) {
                const q = getActiveQuestions()[curIdx];
                if (!q) return;
                let k = '';
                if (['1', 'a', 'A'].includes(e.key)) k = (q.type === 'judge' ? '√' : 'A');
                else if (['2', 'b', 'B'].includes(e.key)) k = (q.type === 'judge' ? '×' : 'B');
                else if (['3', 'c', 'C'].includes(e.key)) k = 'C';
                else if (['4', 'd', 'D'].includes(e.key)) k = 'D';
                else if (['5', 'e', 'E'].includes(e.key)) k = 'E';
                if (k) handleOptionSelect(q, k);
            } else if (e.key === 'Enter' || e.key === ' ') {
                const q = getActiveQuestions()[curIdx];
                if (q && q.type === 'multiple' && state.multiDraft.size > 0 && !state.examState.isSubmitted) {
                    const isExamMode = (state.activeModuleId === 'exam_random' || state.activeModuleId === 'quick_quiz' || state.activeModuleId === 'paper_2026_exam');
                    if (!isExamMode) {
                        e.preventDefault();
                        submitMultipleChoice(q);
                    }
                }
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
    syncReciteModeUI();
    syncOrderModeUI();
    applyTheme(state.theme);
    applyFontSize(state.fontSize);
    renderApp();
    initWelcomeDateModal();
    initFeatureAnnouncementModal();
    checkFeatureAnnouncementModal();
    checkUrlSyncHash();
    window.addEventListener('hashchange', checkUrlSyncHash);

})();
