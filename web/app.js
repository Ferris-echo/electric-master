/**
 * 高级电工理论考试刷题核心引擎 (全新高颜值全端自适应架构)
 * 参考成熟刷题助手设计语言，分为：
 * 1. 全部题库刷题版 (1000题全刷 / 单选专练 / 判断专练)
 * 2. 历年真题分卷版 (5套官方真题原卷独立专区)
 * 3. 模拟考场版本 (全真随机抽卷120分钟 / 快速自测30分钟)
 * 4. 错题回顾本 & 重点收藏夹 & 全库搜题
 */
(function() {
    'use strict';

    // --- Lucide-style SVG Icons ---
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
        ChevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><polyline points="9 18 15 12 9 6"/></svg>`,
        X: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        Grid: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
        Search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
        Star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        Menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
        Eye: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
        Timer: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%CLASS%"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
    };

    function getIcon(name, className = '') {
        const raw = Icons[name];
        if (!raw) return '';
        return raw.replace('%CLASS%', className);
    }

    // --- Data Flattening: 1000 Questions Pool ---
    const rawPapers = window.EXAM_PAPERS || [];
    const all1000Questions = [];
    rawPapers.forEach((paper, pIdx) => {
        paper.questions.forEach((q, qIdx) => {
            all1000Questions.push({
                ...q,
                id: `${paper.id}_${q.index}`,
                paperId: paper.id,
                paperName: paper.name,
                globalIndex: all1000Questions.length + 1
            });
        });
    });

    // --- State ---
    const state = {
        // Mode: 'full' | 'paper' | 'exam-random' | 'quick-quiz' | 'wrong' | 'favorite'
        mode: 'full',
        fullFilter: 'all', // 'all' (1000题) | 'choice' (800题) | 'judge' (200题)
        selectedPaperId: 'paper_2024',
        
        currentIndex: 0,
        reciteMode: false, // 背题模式 (直显正确答案)
        
        userAnswers: {},     // { [qId]: optionKey }
        examAnswers: {},     // { [qId]: optionKey } for current exam session
        wrongQuestions: new Set(),
        favoriteQuestions: new Set(),
        
        // Exam Timer
        examTimerInterval: null,
        examSecondsLeft: 7200, // 120 min
        examTotalSeconds: 7200,
        isExamSubmitted: false
    };

    // --- Storage Keys ---
    const STORAGE_KEY_ANSWERS = 'electrician_user_answers';
    const STORAGE_KEY_WRONGS = 'electrician_user_wrongs';
    const STORAGE_KEY_FAVS = 'electrician_user_favs';
    const STORAGE_KEY_RECITE = 'electrician_recite_mode';

    function loadSavedData() {
        try {
            const ans = localStorage.getItem(STORAGE_KEY_ANSWERS);
            if (ans) state.userAnswers = JSON.parse(ans);
            const wr = localStorage.getItem(STORAGE_KEY_WRONGS);
            if (wr) state.wrongQuestions = new Set(JSON.parse(wr));
            const fav = localStorage.getItem(STORAGE_KEY_FAVS);
            if (fav) state.favoriteQuestions = new Set(JSON.parse(fav));
            const rc = localStorage.getItem(STORAGE_KEY_RECITE);
            if (rc) state.reciteMode = JSON.parse(rc);
        } catch(e) {
            console.error('Storage load failed', e);
        }
    }

    function saveAnswers() {
        localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(state.userAnswers));
    }
    function saveWrongs() {
        localStorage.setItem(STORAGE_KEY_WRONGS, JSON.stringify([...state.wrongQuestions]));
    }
    function saveFavs() {
        localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify([...state.favoriteQuestions]));
    }
    function saveRecite() {
        localStorage.setItem(STORAGE_KEY_RECITE, JSON.stringify(state.reciteMode));
    }

    // --- Active Questions Selector ---
    function getActiveQuestions() {
        if (state.mode === 'full') {
            if (state.fullFilter === 'choice') {
                return all1000Questions.filter(q => q.type === 'choice');
            } else if (state.fullFilter === 'judge') {
                return all1000Questions.filter(q => q.type === 'judge');
            }
            return all1000Questions; // 1000题全刷
        }
        else if (state.mode === 'paper') {
            const p = rawPapers.find(p => p.id === state.selectedPaperId) || rawPapers[0];
            return all1000Questions.filter(q => q.paperId === p.id);
        }
        else if (state.mode === 'exam-random') {
            return state.examActiveQuestions || [];
        }
        else if (state.mode === 'quick-quiz') {
            return state.examActiveQuestions || [];
        }
        else if (state.mode === 'wrong') {
            return all1000Questions.filter(q => state.wrongQuestions.has(q.id));
        }
        else if (state.mode === 'favorite') {
            return all1000Questions.filter(q => state.favoriteQuestions.has(q.id));
        }
        return all1000Questions;
    }

    // --- Initialize Icons ---
    function initIcons() {
        document.getElementById('icon-lightning').innerHTML = getIcon('Lightning', 'w-6 h-6 text-yellow-400');
        document.getElementById('icon-lightning-mobile').innerHTML = getIcon('Lightning', 'w-5 h-5 text-yellow-300');
        document.getElementById('icon-search-mobile').innerHTML = getIcon('Search', 'w-5 h-5');
        document.getElementById('icon-menu-mobile').innerHTML = getIcon('Menu', 'w-5 h-5');
        document.getElementById('icon-close-sidebar').innerHTML = getIcon('X', 'w-5 h-5');
        document.getElementById('icon-search-btn').innerHTML = getIcon('Search', 'w-3.5 h-3.5');
        document.getElementById('icon-export').innerHTML = getIcon('Download', 'w-3.5 h-3.5');
        document.getElementById('icon-folder-all').innerHTML = getIcon('BookOpen', 'w-4 h-4 text-blue-600');
        document.getElementById('icon-folder-choice').innerHTML = getIcon('Folder', 'w-4 h-4 text-indigo-600');
        document.getElementById('icon-folder-judge').innerHTML = getIcon('Folder', 'w-4 h-4 text-cyan-600');
        document.getElementById('icon-award').innerHTML = getIcon('Award', 'w-5 h-5');
        document.getElementById('icon-sparkles').innerHTML = getIcon('Sparkles', 'w-4 h-4');
        document.getElementById('icon-alert-circle').innerHTML = getIcon('AlertCircle', 'w-4 h-4');
        document.getElementById('icon-star').innerHTML = getIcon('Star', 'w-4 h-4');
        document.getElementById('icon-eye').innerHTML = getIcon('Eye', 'w-4 h-4');
        document.getElementById('icon-refresh').innerHTML = getIcon('RefreshCw', 'w-3.5 h-3.5');
        document.getElementById('icon-trash').innerHTML = getIcon('Trash2', 'w-3.5 h-3.5');
        document.getElementById('icon-grid-btn').innerHTML = getIcon('Grid', 'w-4 h-4');
        document.getElementById('icon-timer').innerHTML = getIcon('Timer', 'w-4 h-4');
        document.getElementById('icon-grid-title').innerHTML = getIcon('Grid', 'w-5 h-5 text-blue-600');
        document.getElementById('icon-close-grid').innerHTML = getIcon('X', 'w-5 h-5');
    }

    // --- Populate 5 Papers in Sidebar ---
    function renderPapersList() {
        const container = document.getElementById('paper-list-container');
        container.innerHTML = rawPapers.map((p, idx) => {
            const isSelected = (state.mode === 'paper' && state.selectedPaperId === p.id);
            const activeClass = isSelected ? 'active' : '';
            return `
                <button class="nav-item-btn w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-sm transition-all ${activeClass}" data-paper-id="${p.id}">
                    <span class="nav-icon ${isSelected ? 'text-blue-600' : 'text-gray-400'}">${getIcon('Folder', 'w-4 h-4')}</span>
                    <span class="truncate flex-1 font-medium text-xs">${p.name}</span>
                    <span class="text-[11px] text-gray-400 font-bold">200题</span>
                </button>
            `;
        }).join('');

        container.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const pid = btn.getAttribute('data-paper-id');
                switchPaper(pid);
                closeMobileSidebar();
            });
        });
    }

    // --- Switch Functions ---
    function switchFullMode(filter) {
        stopExamTimer();
        state.mode = 'full';
        state.fullFilter = filter;
        state.currentIndex = 0;
        renderApp();
    }

    function switchPaper(paperId) {
        stopExamTimer();
        state.mode = 'paper';
        state.selectedPaperId = paperId;
        state.currentIndex = 0;
        renderApp();
    }

    function switchWrongMode() {
        stopExamTimer();
        if (state.wrongQuestions.size === 0) {
            alert('恭喜！当前没有错题记录，继续保持！');
            return;
        }
        state.mode = 'wrong';
        state.currentIndex = 0;
        renderApp();
    }

    function switchFavMode() {
        stopExamTimer();
        if (state.favoriteQuestions.size === 0) {
            alert('收藏夹为空！可在刷题时点击星星收藏疑难题目。');
            return;
        }
        state.mode = 'favorite';
        state.currentIndex = 0;
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
            // 40 choices + 10 judges = 50 total (30 min)
            state.examActiveQuestions = [...shuffle(allChoices).slice(0, 40), ...shuffle(allJudges).slice(0, 10)];
            state.mode = 'quick-quiz';
            state.examTotalSeconds = 1800; // 30 min
        } else {
            // 160 choices + 40 judges = 200 total (120 min)
            state.examActiveQuestions = [...shuffle(allChoices).slice(0, 160), ...shuffle(allJudges).slice(0, 40)];
            state.mode = 'exam-random';
            state.examTotalSeconds = 7200; // 120 min
        }

        state.examAnswers = {};
        state.currentIndex = 0;
        state.isExamSubmitted = false;
        state.examSecondsLeft = state.examTotalSeconds;

        startExamTimer();
        renderApp();
    }

    // --- Timer Handling ---
    function startExamTimer() {
        clearInterval(state.examTimerInterval);
        updateTimerDisplay();

        state.examTimerInterval = setInterval(() => {
            state.examSecondsLeft--;
            updateTimerDisplay();
            if (state.examSecondsLeft <= 0) {
                clearInterval(state.examTimerInterval);
                alert('考试时间到！系统已为您自动交卷。');
                submitExam();
            }
        }, 1000);
    }

    function stopExamTimer() {
        clearInterval(state.examTimerInterval);
        document.getElementById('exam-timer-box').classList.add('hidden');
        document.getElementById('btn-header-submit-exam').classList.add('hidden');
    }

    function updateTimerDisplay() {
        const timerBox = document.getElementById('exam-timer-box');
        const timerText = document.getElementById('exam-timer-clock');
        const submitBtn = document.getElementById('btn-header-submit-exam');

        timerBox.classList.remove('hidden');
        timerBox.classList.add('flex');
        submitBtn.classList.remove('hidden');

        const m = Math.floor(state.examSecondsLeft / 60);
        const s = state.examSecondsLeft % 60;
        timerText.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // --- Submit Exam & Scoring ---
    function submitExam() {
        clearInterval(state.examTimerInterval);
        state.isExamSubmitted = true;

        const activeQuestions = getActiveQuestions();
        let score = 0;
        let correctCount = 0;
        let wrongCount = 0;

        activeQuestions.forEach(q => {
            const userChoice = state.examAnswers[q.id];
            if (userChoice === q.answer) {
                correctCount++;
                score += (q.score || 0.5);
            } else {
                wrongCount++;
                // Record into persistent wrong notebook
                state.wrongQuestions.add(q.id);
            }
        });
        saveWrongs();
        updateSidebarBadges();

        const finalScore = Math.round(score * 10) / 10;
        const fullScore = activeQuestions.length * 0.5;
        const isPassed = finalScore >= (fullScore * 0.6);

        const timeUsed = state.examTotalSeconds - state.examSecondsLeft;
        const tm = Math.floor(timeUsed / 60);
        const ts = timeUsed % 60;

        // Render Result Modal
        document.getElementById('result-badge-icon').textContent = isPassed ? '🏆' : '📝';
        document.getElementById('result-exam-title').textContent = state.mode === 'quick-quiz' ? '碎片自测冲刺 (50题)' : '国家职业资格全真模拟考试 (200题)';
        document.getElementById('result-score-val').textContent = finalScore;
        document.getElementById('result-full-score').textContent = `${fullScore} 分`;
        document.getElementById('result-correct-count').textContent = `${correctCount} 题`;
        document.getElementById('result-wrong-count').textContent = `${wrongCount} 题`;
        document.getElementById('result-time-text').textContent = `考试用时：${tm} 分 ${ts} 秒`;

        const pill = document.getElementById('result-pass-pill');
        if (isPassed) {
            pill.textContent = '成绩合格 · 恭喜通过考试！';
            pill.className = 'mt-3 px-4 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200';
        } else {
            pill.textContent = '成绩未及格 · 考前继续加油！';
            pill.className = 'mt-3 px-4 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200';
        }

        document.getElementById('result-modal').classList.remove('hidden');
        renderApp();
    }

    // --- Update Sidebar State ---
    function updateSidebarBadges() {
        document.getElementById('sidebar-wrong-count').textContent = `${state.wrongQuestions.size} 道待复习`;
        document.getElementById('sidebar-fav-count').textContent = `${state.favoriteQuestions.size} 道重点题`;

        // Update nav items active styling
        document.querySelectorAll('.nav-item-btn').forEach(btn => {
            const m = btn.getAttribute('data-mode');
            const f = btn.getAttribute('data-filter');
            if (m === 'full' && state.mode === 'full' && state.fullFilter === f) {
                btn.classList.add('active');
            } else if (m === state.mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Toggle Wrong / Fav active states
        const btnWrong = document.getElementById('btn-nav-wrong');
        const btnFav = document.getElementById('btn-nav-fav');
        if (state.mode === 'wrong') btnWrong.classList.add('bg-orange-100', 'text-orange-800', 'font-bold');
        else btnWrong.classList.remove('bg-orange-100', 'text-orange-800', 'font-bold');
        
        if (state.mode === 'favorite') btnFav.classList.add('bg-yellow-100', 'text-yellow-800', 'font-bold');
        else btnFav.classList.remove('bg-yellow-100', 'text-yellow-800', 'font-bold');
    }

    // --- Main Render Engine ---
    function renderApp() {
        const activeQuestions = getActiveQuestions();
        const total = activeQuestions.length;

        if (state.currentIndex >= total) {
            state.currentIndex = Math.max(0, total - 1);
        }

        updateSidebarBadges();
        renderPapersList();

        // Topbar Title Badge
        const moduleBadge = document.getElementById('badge-current-module');
        if (state.mode === 'full') {
            const filterName = state.fullFilter === 'choice' ? '单选题专练 (800题)' : (state.fullFilter === 'judge' ? '判断题专练 (200题)' : '全部题库刷题 (1000题)');
            moduleBadge.textContent = filterName;
            moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-700 shadow-sm';
        } else if (state.mode === 'paper') {
            const curP = rawPapers.find(p => p.id === state.selectedPaperId);
            moduleBadge.textContent = curP ? curP.name : '历年分卷';
            moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-green-100 text-green-700 shadow-sm';
        } else if (state.mode === 'exam-random') {
            moduleBadge.textContent = '全真模拟考场 (200题)';
            moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 shadow-sm';
        } else if (state.mode === 'quick-quiz') {
            moduleBadge.textContent = '碎片自测冲刺 (50题)';
            moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-orange-700 shadow-sm';
        } else if (state.mode === 'wrong') {
            moduleBadge.textContent = '错题回顾本';
            moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-orange-700 shadow-sm';
        } else if (state.mode === 'favorite') {
            moduleBadge.textContent = '重点收藏夹';
            moduleBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-yellow-100 text-yellow-800 shadow-sm';
        }

        // Topbar question counter
        document.getElementById('text-current-qnum').textContent = total > 0 ? (state.currentIndex + 1) : 0;
        document.getElementById('text-total-qnum').textContent = total;

        // Progress bar
        const progressPercent = total > 0 ? Math.round(((state.currentIndex + 1) / total) * 100) : 0;
        document.getElementById('progress-bar').style.width = `${progressPercent}%`;

        // Recite badge
        const reciteBadge = document.getElementById('badge-recite-status');
        if (state.reciteMode && !state.mode.includes('exam') && state.mode !== 'quick-quiz') {
            reciteBadge.classList.remove('hidden');
        } else {
            reciteBadge.classList.add('hidden');
        }

        renderQuestionCard();
    }

    // --- Question Card Render ---
    function renderQuestionCard() {
        const container = document.getElementById('question-scroll-area');
        const activeQuestions = getActiveQuestions();
        const total = activeQuestions.length;

        if (total === 0) {
            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-gray-500 text-center p-8">
                    <div class="mb-4">${getIcon('Award', 'w-16 h-16 text-yellow-500')}</div>
                    <p class="text-xl font-bold text-gray-800">暂无题目</p>
                    <p class="text-sm mt-1">恭喜你！当前分类下所有题目已掌握或为空。</p>
                    <button id="btn-empty-back-full" class="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 font-bold text-sm">
                        返回全部题库
                    </button>
                </div>
            `;
            document.getElementById('btn-empty-back-full').onclick = () => switchFullMode('all');
            return;
        }

        const q = activeQuestions[state.currentIndex];
        const isExamMode = (state.mode === 'exam-random' || state.mode === 'quick-quiz');
        const currentAnswerState = isExamMode ? state.examAnswers[q.id] : state.userAnswers[q.id];
        const isFeedback = (!isExamMode && !!currentAnswerState) || (isExamMode && state.isExamSubmitted && !!currentAnswerState);
        const isCorrect = currentAnswerState === q.answer;
        const isFav = state.favoriteQuestions.has(q.id);

        // Images HTML
        let imagesHtml = '';
        if (q.images && q.images.length > 0) {
            imagesHtml = `
                <div class="my-4 flex flex-wrap gap-3">
                    ${q.images.map(imgSrc => `
                        <div class="circuit-img-container" data-img-src="${imgSrc}">
                            <img src="${imgSrc}" alt="电路图" />
                            <span class="text-[11px] text-blue-600 font-bold mt-1.5 flex items-center gap-1">
                                🔍 点击放大查看高清图
                            </span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Options HTML
        let optionsHtml = q.options.map((optStr, optIdx) => {
            let key = '';
            let optText = optStr;
            if (q.type === 'choice') {
                const m = optStr.match(/^([A-D])[、\.](.*)/);
                if (m) {
                    key = m[1];
                    optText = m[2];
                } else {
                    key = ['A', 'B', 'C', 'D'][optIdx];
                }
            } else {
                key = optIdx === 0 ? '√' : '×';
                optText = optStr;
            }

            const isSelected = currentAnswerState === key;
            const isStandardAnswer = q.answer === key;

            let btnClass = "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group relative overflow-hidden ";
            let badgeClass = "w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold flex-shrink-0 transition-colors ";
            let iconHtml = "";

            if (state.reciteMode && !isExamMode) {
                // 背题模式：直接在正确答案上加绿
                if (isStandardAnswer) {
                    btnClass += "border-green-500 bg-green-50 text-green-900 font-medium";
                    badgeClass += "bg-green-600 text-white shadow-sm";
                    iconHtml = getIcon('CheckCircle', 'w-6 h-6 text-green-600 relative z-10 flex-shrink-0');
                } else {
                    btnClass += "border-gray-100 opacity-60 text-gray-600";
                    badgeClass += "bg-gray-100 text-gray-500";
                }
            } else if (isFeedback) {
                // 已作答反馈模式
                if (isStandardAnswer) {
                    btnClass += "border-green-500 bg-green-50 text-green-900 font-medium";
                    badgeClass += "bg-green-600 text-white shadow-sm";
                    iconHtml = getIcon('CheckCircle', 'w-6 h-6 text-green-600 relative z-10 flex-shrink-0');
                } else if (isSelected && !isStandardAnswer) {
                    btnClass += "border-red-500 bg-red-50 text-red-900 font-medium";
                    badgeClass += "bg-red-600 text-white shadow-sm";
                    iconHtml = getIcon('XCircle', 'w-6 h-6 text-red-600 relative z-10 flex-shrink-0');
                } else {
                    btnClass += "border-gray-100 opacity-50 text-gray-600";
                    badgeClass += "bg-gray-100 text-gray-500";
                }
            } else {
                // 未作答 / 模拟考中
                if (isSelected) {
                    btnClass += "border-blue-600 bg-blue-50 text-blue-900 font-medium shadow-sm";
                    badgeClass += "bg-blue-600 text-white shadow-sm";
                } else {
                    btnClass += "border-gray-100 hover:border-blue-300 hover:bg-gray-50 text-gray-700";
                    badgeClass += "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-blue-600";
                }
            }

            return `
                <button class="option-btn ${btnClass}" data-key="${key}">
                    <span class="flex items-center relative z-10 flex-1">
                        <span class="${badgeClass}">${key}</span>
                        <span class="text-base md:text-lg text-gray-800 leading-relaxed font-normal">${optText}</span>
                    </span>
                    ${iconHtml}
                </button>
            `;
        }).join('');

        // Feedback / Answer Banner
        let feedbackBannerHtml = '';
        if (state.reciteMode || isFeedback) {
            const isBannerCorrect = isCorrect || state.reciteMode;
            const bannerBg = isBannerCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800';
            const bannerTitle = isBannerCorrect ? (state.reciteMode ? '考点精讲与标准答案' : '回答正确！') : '回答错误！';
            const bannerIcon = isBannerCorrect ? getIcon('CheckCircle', 'w-5 h-5') : getIcon('XCircle', 'w-5 h-5');

            let removeWrongBtn = '';
            if (state.wrongQuestions.has(q.id)) {
                removeWrongBtn = `
                    <button id="btn-remove-from-wrong" class="text-xs flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-red-50 text-red-600 transition-colors shadow-sm font-bold whitespace-nowrap">
                        ${getIcon('Trash', 'w-3.5 h-3.5')} 从错题本移出
                    </button>
                `;
            }

            feedbackBannerHtml = `
                <div class="mt-6 p-5 rounded-2xl border ${bannerBg} animate-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                        <div class="font-black flex items-center gap-2 mb-1.5 text-base">
                            ${bannerIcon} <span>${bannerTitle}</span>
                        </div>
                        <div class="text-sm pl-7">
                            标准答案：<span class="font-black text-xl text-green-700">${q.answer}</span>
                            <span class="text-xs opacity-75 ml-3">来源：${q.paperName || '高级维修电工题库'}</span>
                        </div>
                    </div>
                    ${removeWrongBtn}
                </div>
            `;
        }

        // Assemble Final Question Card
        container.innerHTML = `
            <div class="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative animate-fade-in-up">
                
                <!-- Card Inner Header -->
                <div class="p-6 md:p-8">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-1 rounded-md text-xs font-black ${q.type === 'judge' ? 'bg-cyan-100 text-cyan-800' : 'bg-blue-100 text-blue-800'}">
                                ${q.type === 'judge' ? '判断题 (0.5分)' : '单选题 (0.5分)'}
                            </span>
                            <span class="text-xs text-gray-400 font-medium hidden sm:inline">
                                来源：${q.paperName || '真题卷'}
                            </span>
                        </div>

                        <!-- Favorite Button -->
                        <button id="btn-toggle-favorite" class="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${isFav ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:text-amber-500 hover:bg-gray-50'}">
                            ${getIcon('Star', 'w-4 h-4 ' + (isFav ? 'fill-current text-amber-500' : ''))}
                            <span>${isFav ? '已收藏' : '收藏本题'}</span>
                        </button>
                    </div>

                    <!-- Question Stem -->
                    <h3 class="text-lg md:text-xl font-bold text-gray-900 leading-relaxed mb-6 flex gap-2.5 items-start">
                        <span class="text-blue-600 font-black flex-shrink-0 text-xl">${state.currentIndex + 1}.</span>
                        <span class="break-words flex-1">${q.content}</span>
                    </h3>

                    <!-- Circuit Images -->
                    ${imagesHtml}

                    <!-- Options -->
                    <div class="space-y-3 mt-4">
                        ${optionsHtml}
                    </div>

                    <!-- Feedback Area -->
                    ${feedbackBannerHtml}
                </div>

                <!-- Card Footer Navigation -->
                <div class="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
                    <button id="btn-prev-q" class="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm text-sm" ${state.currentIndex === 0 ? 'disabled' : ''}>
                        <span class="rotate-180 flex">${getIcon('ChevronRight', 'w-4 h-4')}</span> 上一题
                    </button>

                    <div class="text-gray-400 text-xs font-medium hidden md:block">
                        快捷键：键盘 1/2/3/4 或 A/B/C/D 选择，← / → 翻题
                    </div>

                    <div class="flex items-center gap-2">
                        ${isExamMode ? `
                            <button id="btn-exam-submit-card" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md font-bold text-sm transition transform active:scale-95">
                                交卷
                            </button>
                        ` : ''}

                        <button id="btn-next-q" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md font-bold text-sm flex items-center gap-1.5 transition transform active:scale-95" ${state.currentIndex === total - 1 ? 'disabled' : ''}>
                            下一题 <span class="flex">${getIcon('ChevronRight', 'w-4 h-4')}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Bind Option Clicks
        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.getAttribute('data-key');
                handleOptionSelect(q, key);
            });
        });

        // Bind Nav Buttons
        document.getElementById('btn-prev-q').onclick = () => {
            if (state.currentIndex > 0) {
                state.currentIndex--;
                renderApp();
            }
        };
        document.getElementById('btn-next-q').onclick = () => {
            if (state.currentIndex < total - 1) {
                state.currentIndex++;
                renderApp();
            }
        };

        // Favorite Toggle
        document.getElementById('btn-toggle-favorite').onclick = () => {
            if (state.favoriteQuestions.has(q.id)) {
                state.favoriteQuestions.delete(q.id);
            } else {
                state.favoriteQuestions.add(q.id);
            }
            saveFavs();
            renderApp();
        };

        // Remove from Wrong Button
        const btnRemoveWrong = document.getElementById('btn-remove-from-wrong');
        if (btnRemoveWrong) {
            btnRemoveWrong.onclick = () => {
                state.wrongQuestions.delete(q.id);
                saveWrongs();
                renderApp();
            };
        }

        // Exam submit from card
        const btnCardSubmit = document.getElementById('btn-exam-submit-card');
        if (btnCardSubmit) {
            btnCardSubmit.onclick = () => {
                if (confirm('确认现在提交试卷并计算最终得分吗？')) {
                    submitExam();
                }
            };
        }

        // Image Lightbox Clicks
        container.querySelectorAll('.circuit-img-container').forEach(wrap => {
            wrap.onclick = () => {
                const src = wrap.getAttribute('data-img-src');
                openLightbox(src);
            };
        });
    }

    // --- Option Selection Logic ---
    function handleOptionSelect(q, key) {
        const isExamMode = (state.mode === 'exam-random' || state.mode === 'quick-quiz');

        if (isExamMode) {
            if (state.isExamSubmitted) return; // cannot change after exam submission
            state.examAnswers[q.id] = key;
            renderQuestionCard();
            return;
        }

        // Practice / Paper Mode
        if (state.userAnswers[q.id]) {
            // Already answered, don't re-select
            return;
        }

        state.userAnswers[q.id] = key;
        saveAnswers();

        // If wrong, add to wrong list
        if (key !== q.answer) {
            state.wrongQuestions.add(q.id);
            saveWrongs();
        } else if (state.mode === 'wrong') {
            // Answered right in wrong review mode -> auto remove!
            state.wrongQuestions.delete(q.id);
            saveWrongs();
        }

        renderQuestionCard();

        // Auto advance to next question on correct answer after 400ms
        if (key === q.answer) {
            const total = getActiveQuestions().length;
            if (state.currentIndex < total - 1) {
                setTimeout(() => {
                    if (state.currentIndex < total - 1) {
                        state.currentIndex++;
                        renderApp();
                    }
                }, 400);
            }
        }
    }

    // --- Slide-Over Question Grid Drawer ---
    function openGridModal() {
        const modal = document.getElementById('grid-modal');
        const container = document.getElementById('grid-buttons-container');
        const activeQuestions = getActiveQuestions();
        const isExamMode = (state.mode === 'exam-random' || state.mode === 'quick-quiz');

        let correct = 0;
        let wrong = 0;
        let answered = 0;

        activeQuestions.forEach(q => {
            const ans = isExamMode ? state.examAnswers[q.id] : state.userAnswers[q.id];
            if (ans) {
                answered++;
                if (ans === q.answer) correct++;
                else wrong++;
            }
        });

        document.getElementById('drawer-stat-correct').textContent = correct;
        document.getElementById('drawer-stat-wrong').textContent = wrong;
        document.getElementById('drawer-stat-unanswered').textContent = activeQuestions.length - answered;
        document.getElementById('drawer-stat-total').textContent = activeQuestions.length;

        // Dynamic 5-column or 8-column grid
        const cols = activeQuestions.length > 200 ? 'grid-cols-6 sm:grid-cols-8' : 'grid-cols-5 sm:grid-cols-6';
        container.innerHTML = `
            <div class="grid ${cols} gap-2.5">
                ${activeQuestions.map((q, idx) => {
                    const ans = isExamMode ? state.examAnswers[q.id] : state.userAnswers[q.id];
                    let btnClass = "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ";
                    
                    if (idx === state.currentIndex) {
                        btnClass += "border-blue-600 ring-2 ring-blue-200 ";
                    } else {
                        btnClass += "border-transparent ";
                    }

                    if (!ans) {
                        btnClass += "bg-gray-100 text-gray-500 hover:bg-gray-200";
                    } else if (isExamMode && !state.isExamSubmitted) {
                        btnClass += "bg-blue-600 text-white";
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
                state.currentIndex = parseInt(btn.getAttribute('data-index'), 10);
                closeGridModal();
                renderApp();
            };
        });

        modal.classList.remove('hidden');
    }

    function closeGridModal() {
        document.getElementById('grid-modal').classList.add('hidden');
    }

    // --- Search Modal ---
    function openSearchModal() {
        const modal = document.getElementById('search-modal');
        const input = document.getElementById('search-input');
        modal.classList.remove('hidden');
        input.value = '';
        input.focus();
        renderSearchResults('');
    }

    function closeSearchModal() {
        document.getElementById('search-modal').classList.add('hidden');
    }

    function renderSearchResults(kw) {
        const list = document.getElementById('search-results-list');
        const cleanKw = kw.trim();
        if (!cleanKw) {
            list.innerHTML = `<div class="text-center text-gray-400 py-10 text-sm">输入关键词搜索全部 1000 道题库</div>`;
            return;
        }

        const hits = all1000Questions.filter(q => 
            q.content.includes(cleanKw) || q.options.some(opt => opt.includes(cleanKw))
        );

        if (hits.length === 0) {
            list.innerHTML = `<div class="text-center text-gray-400 py-10 text-sm">未找到与 "${cleanKw}" 相关的题目</div>`;
            return;
        }

        list.innerHTML = hits.slice(0, 40).map(q => {
            const highlighted = q.content.split(cleanKw).join(`<mark class="bg-amber-200 text-amber-900 px-0.5 rounded">${cleanKw}</mark>`);
            return `
                <div class="search-result-item p-3.5 bg-gray-50 rounded-xl hover:bg-blue-50 cursor-pointer border border-gray-100 transition" data-global-index="${q.globalIndex}">
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
                state.mode = 'full';
                state.fullFilter = 'all';
                state.currentIndex = gIdx;
                renderApp();
            };
        });
    }

    // --- Lightbox ---
    function openLightbox(src) {
        document.getElementById('lightbox-img').src = src;
        document.getElementById('lightbox-modal').classList.remove('hidden');
    }
    function closeLightbox() {
        document.getElementById('lightbox-modal').classList.add('hidden');
    }

    // --- Mobile Sidebar Controls ---
    function openMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-sidebar-overlay');
        sidebar.classList.remove('hidden');
        sidebar.classList.add('fixed', 'inset-y-0', 'left-0', 'z-40', 'flex');
        overlay.classList.remove('hidden');
    }
    function closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-sidebar-overlay');
        sidebar.classList.add('hidden');
        sidebar.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-40');
        overlay.classList.add('hidden');
    }

    // --- Backup & Restore ---
    function exportBackup() {
        const backupData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            userAnswers: state.userAnswers,
            wrongQuestions: [...state.wrongQuestions],
            favoriteQuestions: [...state.favoriteQuestions]
        };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `高级电工刷题进度备份_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- Bind All Global Events ---
    function bindEvents() {
        // Section 1: Full 1000 questions buttons
        document.querySelectorAll('[data-mode="full"]').forEach(btn => {
            btn.onclick = () => {
                const filter = btn.getAttribute('data-filter') || 'all';
                switchFullMode(filter);
                closeMobileSidebar();
            };
        });

        // Section 3: Exams
        document.querySelector('[data-mode="exam-random"]').onclick = () => {
            if (confirm('即将进入全真模拟考场：共 200 题，限时 120 分钟，不显示即时答案，准备好了吗？')) {
                startRandomExam(false);
                closeMobileSidebar();
            }
        };
        document.querySelector('[data-mode="quick-quiz"]').onclick = () => {
            startRandomExam(true);
            closeMobileSidebar();
        };

        // Section 4: Wrong & Favorite
        document.getElementById('btn-nav-wrong').onclick = () => {
            switchWrongMode();
            closeMobileSidebar();
        };
        document.getElementById('btn-nav-fav').onclick = () => {
            switchFavMode();
            closeMobileSidebar();
        };

        // Recite toggle
        const toggleRecite = document.getElementById('toggle-recite-mode');
        toggleRecite.checked = state.reciteMode;
        toggleRecite.onchange = (e) => {
            state.reciteMode = e.target.checked;
            saveRecite();
            renderApp();
        };

        // Backup Export
        document.getElementById('btn-export-backup').onclick = exportBackup;

        // Reset progress
        document.getElementById('btn-reset-current').onclick = () => {
            if (confirm('确认清空当前版本的做题记录吗？')) {
                const activeQs = getActiveQuestions();
                activeQs.forEach(q => delete state.userAnswers[q.id]);
                saveAnswers();
                state.currentIndex = 0;
                renderApp();
            }
        };
        document.getElementById('btn-clear-all-data').onclick = () => {
            if (confirm('警告：此操作将清空所有 1000 题的做题记录、错题本和收藏夹！确认执行吗？')) {
                localStorage.clear();
                state.userAnswers = {};
                state.wrongQuestions.clear();
                state.favoriteQuestions.clear();
                state.currentIndex = 0;
                renderApp();
            }
        };

        // Grid Drawer
        document.getElementById('btn-open-grid-modal').onclick = openGridModal;
        document.getElementById('btn-close-grid-modal').onclick = closeGridModal;
        document.getElementById('grid-modal').onclick = (e) => {
            if (e.target.id === 'grid-modal') closeGridModal();
        };

        // Search Modals
        document.getElementById('btn-quick-search').onclick = openSearchModal;
        document.getElementById('btn-mobile-search').onclick = openSearchModal;
        document.getElementById('btn-close-search').onclick = closeSearchModal;
        document.getElementById('search-modal').onclick = (e) => {
            if (e.target.id === 'search-modal') closeSearchModal();
        };
        document.getElementById('search-input').oninput = (e) => {
            renderSearchResults(e.target.value);
        };

        // Header Submit Exam
        document.getElementById('btn-header-submit-exam').onclick = () => {
            if (confirm('确认交卷并计算最终得分吗？')) {
                submitExam();
            }
        };

        // Result Modal Buttons
        document.getElementById('btn-result-review').onclick = () => {
            document.getElementById('result-modal').classList.add('hidden');
            renderApp();
        };
        document.getElementById('btn-result-close').onclick = () => {
            document.getElementById('result-modal').classList.add('hidden');
            switchFullMode('all');
        };

        // Lightbox
        document.getElementById('btn-close-lightbox').onclick = closeLightbox;
        document.getElementById('lightbox-modal').onclick = (e) => {
            if (e.target.id === 'lightbox-modal') closeLightbox();
        };

        // Mobile Sidebar
        document.getElementById('btn-mobile-menu').onclick = openMobileSidebar;
        document.getElementById('btn-close-sidebar-mobile').onclick = closeMobileSidebar;
        document.getElementById('mobile-sidebar-overlay').onclick = closeMobileSidebar;

        // Desktop Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            if (!document.getElementById('search-modal').classList.contains('hidden')) return;

            if (e.key === 'ArrowLeft') {
                if (state.currentIndex > 0) {
                    state.currentIndex--;
                    renderApp();
                }
            } else if (e.key === 'ArrowRight') {
                const total = getActiveQuestions().length;
                if (state.currentIndex < total - 1) {
                    state.currentIndex++;
                    renderApp();
                }
            } else if (['1', '2', '3', '4', 'a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
                const q = getActiveQuestions()[state.currentIndex];
                if (!q) return;
                let k = '';
                if (['1', 'a', 'A'].includes(e.key)) k = (q.type === 'choice' ? 'A' : '√');
                else if (['2', 'b', 'B'].includes(e.key)) k = (q.type === 'choice' ? 'B' : '×');
                else if (['3', 'c', 'C'].includes(e.key)) k = 'C';
                else if (['4', 'd', 'D'].includes(e.key)) k = 'D';
                if (k) handleOptionSelect(q, k);
            }
        });
    }

    // --- Boot ---
    loadSavedData();
    initIcons();
    bindEvents();
    renderApp();

})();
