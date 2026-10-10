/**
 * 高级电工理论考试刷题核心引擎
 */
(function() {
  'use strict';

  // State
  let allPapers = window.EXAM_PAPERS || [];
  let currentPaperId = 'paper_2024';
  let currentMode = 'practice'; // practice, recite, exam-random, exam-paper, quick, wrong, favorite
  let activeQuestions = [];
  let currentIndex = 0;
  let userAnswers = {}; // { qKey: answer }
  let examTimerInterval = null;
  let examSecondsLeft = 7200; // 120 min
  let examTotalSeconds = 7200;

  // LocalStorage Keys
  const STORAGE_WRONGS = 'electrician_exam_wrongs';
  const STORAGE_FAVS = 'electrician_exam_favorites';
  const STORAGE_THEME = 'electrician_exam_theme';

  // DOM Elements
  const modeSelect = document.getElementById('modeSelect');
  const paperSelect = document.getElementById('paperSelect');
  const examTimer = document.getElementById('examTimer');
  const timerText = document.getElementById('timerText');
  const btnSubmitExam = document.getElementById('btnSubmitExam');
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const btnSearch = document.getElementById('btnSearch');

  const questionCard = document.getElementById('questionCard');
  const badgeType = document.getElementById('badgeType');
  const badgeScore = document.getElementById('badgeScore');
  const badgeFav = document.getElementById('badgeFav');
  const currentQNum = document.getElementById('currentQNum');
  const totalQNum = document.getElementById('totalQNum');
  const questionContent = document.getElementById('questionContent');
  const questionImages = document.getElementById('questionImages');
  const optionsList = document.getElementById('optionsList');
  const explanationBox = document.getElementById('explanationBox');
  const correctAnswerText = document.getElementById('correctAnswerText');

  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnToggleFav = document.getElementById('btnToggleFav');
  const btnToggleDrawer = document.getElementById('btnToggleDrawer');
  const btnCloseDrawer = document.getElementById('btnCloseDrawer');
  const sidePanel = document.getElementById('sidePanel');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const cardGrid = document.getElementById('cardGrid');

  const statAnswered = document.getElementById('statAnswered');
  const statCorrect = document.getElementById('statCorrect');
  const statWrong = document.getElementById('statWrong');
  const answeredCountBadge = document.getElementById('answeredCountBadge');

  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const btnCloseLightbox = document.getElementById('btnCloseLightbox');

  const resultModal = document.getElementById('resultModal');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const passBadge = document.getElementById('passBadge');
  const resTotalScore = document.getElementById('resTotalScore');
  const resCorrectCount = document.getElementById('resCorrectCount');
  const resWrongCount = document.getElementById('resWrongCount');
  const resTimeUsed = document.getElementById('resTimeUsed');
  const btnReviewWrongs = document.getElementById('btnReviewWrongs');
  const btnCloseResult = document.getElementById('btnCloseResult');

  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const btnCloseSearch = document.getElementById('btnCloseSearch');

  // Init Data Helper
  function getWrongs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_WRONGS)) || {};
    } catch(e) { return {}; }
  }
  function saveWrongs(data) {
    localStorage.setItem(STORAGE_WRONGS, JSON.stringify(data));
  }
  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_FAVS)) || {};
    } catch(e) { return {}; }
  }
  function saveFavorites(data) {
    localStorage.setItem(STORAGE_FAVS, JSON.stringify(data));
  }

  // Generate Unique Key for question
  function getQuestionKey(q) {
    return (q.paperId || currentPaperId) + '_' + q.index;
  }

  // Populate Papers Dropdown
  function initPapersDropdown() {
    paperSelect.innerHTML = '';
    allPapers.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      paperSelect.appendChild(opt);
    });
    paperSelect.value = currentPaperId;
  }

  // Build / Switch Question List based on Mode
  function initQuestionsForMode() {
    clearInterval(examTimerInterval);
    examTimer.style.display = 'none';
    btnSubmitExam.style.display = 'none';
    paperSelect.style.display = 'inline-block';
    userAnswers = {};

    if (currentMode === 'practice' || currentMode === 'recite') {
      const p = allPapers.find(item => item.id === currentPaperId) || allPapers[0];
      activeQuestions = p.questions.map(q => ({ ...q, paperId: p.id }));
    }
    else if (currentMode === 'exam-paper') {
      const p = allPapers.find(item => item.id === currentPaperId) || allPapers[0];
      activeQuestions = p.questions.map(q => ({ ...q, paperId: p.id }));
      startExamTimer(7200);
    }
    else if (currentMode === 'exam-random') {
      // 160 choices + 40 judges randomly sampled from all 1000 questions
      paperSelect.style.display = 'none';
      const allChoices = [];
      const allJudges = [];
      allPapers.forEach(p => {
        p.questions.forEach(q => {
          const item = { ...q, paperId: p.id };
          if (q.type === 'choice') allChoices.push(item);
          else allJudges.push(item);
        });
      });
      // Shuffle & Slice
      const pickedChoices = shuffleArray(allChoices).slice(0, 160);
      const pickedJudges = shuffleArray(allJudges).slice(0, 40);
      activeQuestions = [...pickedChoices, ...pickedJudges];
      startExamTimer(7200);
    }
    else if (currentMode === 'quick') {
      // 40 choices + 10 judges (50 total, 30 mins)
      paperSelect.style.display = 'none';
      const allChoices = [];
      const allJudges = [];
      allPapers.forEach(p => {
        p.questions.forEach(q => {
          const item = { ...q, paperId: p.id };
          if (q.type === 'choice') allChoices.push(item);
          else allJudges.push(item);
        });
      });
      activeQuestions = [...shuffleArray(allChoices).slice(0, 40), ...shuffleArray(allJudges).slice(0, 10)];
      startExamTimer(1800);
    }
    else if (currentMode === 'wrong') {
      paperSelect.style.display = 'none';
      const wrongs = getWrongs();
      const keys = Object.keys(wrongs);
      if (keys.length === 0) {
        alert('当前没有错题记录！去刷刷题再来看看吧~');
        modeSelect.value = 'practice';
        currentMode = 'practice';
        initQuestionsForMode();
        return;
      }
      activeQuestions = [];
      allPapers.forEach(p => {
        p.questions.forEach(q => {
          const key = p.id + '_' + q.index;
          if (wrongs[key]) {
            activeQuestions.push({ ...q, paperId: p.id });
          }
        });
      });
    }
    else if (currentMode === 'favorite') {
      paperSelect.style.display = 'none';
      const favs = getFavorites();
      const keys = Object.keys(favs);
      if (keys.length === 0) {
        alert('收藏夹为空！在刷题时点击“收藏本题”即可收录。');
        modeSelect.value = 'practice';
        currentMode = 'practice';
        initQuestionsForMode();
        return;
      }
      activeQuestions = [];
      allPapers.forEach(p => {
        p.questions.forEach(q => {
          const key = p.id + '_' + q.index;
          if (favs[key]) {
            activeQuestions.push({ ...q, paperId: p.id });
          }
        });
      });
    }

    currentIndex = 0;
    renderCardGrid();
    renderQuestion();
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Timer
  function startExamTimer(seconds) {
    examTotalSeconds = seconds;
    examSecondsLeft = seconds;
    examTimer.style.display = 'inline-flex';
    btnSubmitExam.style.display = 'inline-flex';
    updateTimerDisplay();

    examTimerInterval = setInterval(() => {
      examSecondsLeft--;
      updateTimerDisplay();
      if (examSecondsLeft <= 0) {
        clearInterval(examTimerInterval);
        alert('考试时间到！系统将为您自动交卷。');
        submitExam();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const m = Math.floor(examSecondsLeft / 60);
    const s = examSecondsLeft % 60;
    timerText.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    examTimer.classList.remove('warning', 'danger');
    if (examSecondsLeft <= 300) {
      examTimer.classList.add('danger');
    } else if (examSecondsLeft <= 900) {
      examTimer.classList.add('warning');
    }
  }

  // Render Question Content
  function renderQuestion() {
    if (activeQuestions.length === 0) return;
    const q = activeQuestions[currentIndex];
    const qKey = getQuestionKey(q);

    currentQNum.textContent = currentIndex + 1;
    totalQNum.textContent = activeQuestions.length;

    badgeType.textContent = q.type === 'choice' ? '单选题' : '判断题';
    badgeScore.textContent = (q.score || 0.5) + '分';

    const favs = getFavorites();
    const isFav = !!favs[qKey];
    badgeFav.style.display = isFav ? 'inline-block' : 'none';
    btnToggleFav.textContent = isFav ? '★ 已收藏' : '⭐ 收藏本题';

    questionContent.textContent = q.content;

    // Images
    questionImages.innerHTML = '';
    if (q.images && q.images.length > 0) {
      q.images.forEach(imgSrc => {
        const wrap = document.createElement('div');
        wrap.className = 'q-img-wrap';
        wrap.title = '点击放大查看电气原理图';
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = '电路图';
        wrap.appendChild(img);
        wrap.onclick = () => openLightbox(imgSrc);
        questionImages.appendChild(wrap);
      });
    }

    // Options
    optionsList.innerHTML = '';
    const isExam = currentMode.startsWith('exam') || currentMode === 'quick';
    const isRecite = currentMode === 'recite';
    const userSelected = userAnswers[qKey];

    q.options.forEach((optStr, optIdx) => {
      const item = document.createElement('div');
      item.className = 'option-item';

      let letter = '';
      let text = optStr;
      if (q.type === 'choice') {
        const m = optStr.match(/^([A-D])[、\.](.*)/);
        if (m) {
          letter = m[1];
          text = m[2];
        } else {
          letter = ['A', 'B', 'C', 'D'][optIdx];
        }
      } else {
        letter = optIdx === 0 ? '√' : '×';
        text = optStr;
      }

      // Check states
      if (isRecite) {
        if (letter === q.answer) {
          item.classList.add('correct');
        }
      } else if (isExam) {
        if (userSelected === letter) {
          item.classList.add('selected');
        }
      } else {
        // Practice mode
        if (userSelected) {
          if (letter === q.answer) {
            item.classList.add('correct');
          }
          if (userSelected === letter && userSelected !== q.answer) {
            item.classList.add('wrong');
          }
        }
      }

      item.innerHTML = `
        <div class="option-letter">${letter}</div>
        <div class="option-text">${text}</div>
        <div class="option-status-icon">${letter === q.answer ? '✓' : '✗'}</div>
      `;

      item.onclick = () => onSelectOption(q, letter);
      optionsList.appendChild(item);
    });

    // Explanation Box
    if (isRecite || (!isExam && userSelected)) {
      explanationBox.classList.add('show');
      correctAnswerText.textContent = q.answer;
    } else {
      explanationBox.classList.remove('show');
    }

    // Update Nav Buttons
    btnPrev.disabled = (currentIndex === 0);
    btnNext.disabled = (currentIndex === activeQuestions.length - 1);

    updateStats();
    highlightCurrentGrid();
  }

  // Option Click Handler
  function onSelectOption(q, letter) {
    const qKey = getQuestionKey(q);
    const isExam = currentMode.startsWith('exam') || currentMode === 'quick';

    if (!isExam && userAnswers[qKey]) {
      // In practice mode, don't allow changing answer after revealing
      return;
    }

    userAnswers[qKey] = letter;

    // If practice mode and wrong, record to wrong book
    if (!isExam) {
      const wrongs = getWrongs();
      if (letter !== q.answer) {
        wrongs[qKey] = (wrongs[qKey] || 0) + 1;
        saveWrongs(wrongs);
      } else if (currentMode === 'wrong') {
        // If answered correctly in wrong mode, ask or auto-remove
        delete wrongs[qKey];
        saveWrongs(wrongs);
      }
    }

    renderQuestion();

    // Auto advance to next question after 0.5s in practice mode if correct
    if (!isExam && letter === q.answer && currentIndex < activeQuestions.length - 1) {
      setTimeout(() => {
        if (currentIndex < activeQuestions.length - 1) {
          currentIndex++;
          renderQuestion();
        }
      }, 500);
    }
  }

  // Matrix Card Grid
  function renderCardGrid() {
    cardGrid.innerHTML = '';
    activeQuestions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.className = 'card-btn';
      btn.textContent = idx + 1;
      btn.id = 'gridBtn_' + idx;
      btn.onclick = () => {
        currentIndex = idx;
        renderQuestion();
        closeMobileDrawer();
      };
      cardGrid.appendChild(btn);
    });
  }

  function highlightCurrentGrid() {
    const isExam = currentMode.startsWith('exam') || currentMode === 'quick';

    activeQuestions.forEach((q, idx) => {
      const btn = document.getElementById('gridBtn_' + idx);
      if (!btn) return;
      btn.className = 'card-btn';
      if (idx === currentIndex) {
        btn.classList.add('current');
      }

      const qKey = getQuestionKey(q);
      const ans = userAnswers[qKey];
      if (ans) {
        if (isExam) {
          btn.classList.add('answered');
        } else {
          if (ans === q.answer) {
            btn.classList.add('correct');
          } else {
            btn.classList.add('wrong');
          }
        }
      }
    });
  }

  function updateStats() {
    let answered = 0;
    let correct = 0;
    let wrong = 0;

    activeQuestions.forEach(q => {
      const qKey = getQuestionKey(q);
      const ans = userAnswers[qKey];
      if (ans) {
        answered++;
        if (ans === q.answer) correct++;
        else wrong++;
      }
    });

    statAnswered.textContent = answered;
    statCorrect.textContent = correct;
    statWrong.textContent = wrong;
    answeredCountBadge.textContent = `${answered}/${activeQuestions.length}`;
  }

  // Lightbox
  function openLightbox(src) {
    lightboxImg.src = src;
    lightboxModal.classList.add('open');
  }
  function closeLightbox() {
    lightboxModal.classList.remove('open');
  }

  // Submit Exam
  function submitExam() {
    const totalQ = activeQuestions.length;
    let answeredCount = 0;
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;

    activeQuestions.forEach(q => {
      const qKey = getQuestionKey(q);
      const ans = userAnswers[qKey];
      if (ans) {
        answeredCount++;
        if (ans === q.answer) {
          correctCount++;
          score += (q.score || 0.5);
        } else {
          wrongCount++;
          // Record wrong
          const wrongs = getWrongs();
          wrongs[qKey] = (wrongs[qKey] || 0) + 1;
          saveWrongs(wrongs);
        }
      } else {
        // Unanswered treated as wrong
        wrongCount++;
        const wrongs = getWrongs();
        wrongs[qKey] = (wrongs[qKey] || 0) + 1;
        saveWrongs(wrongs);
      }
    });

    // Format score
    const finalScore = Math.round(score * 10) / 10;
    const isPassed = finalScore >= 60.0;

    clearInterval(examTimerInterval);
    const timeUsedSec = examTotalSeconds - examSecondsLeft;
    const m = Math.floor(timeUsedSec / 60);
    const s = timeUsedSec % 60;

    scoreDisplay.textContent = finalScore;
    passBadge.textContent = isPassed ? '合格 (通过)' : '未及格 (需努力)';
    passBadge.className = 'pass-status-pill ' + (isPassed ? 'passed' : 'failed');

    resTotalScore.textContent = (totalQ * 0.5);
    resCorrectCount.textContent = correctCount;
    resWrongCount.textContent = wrongCount;
    resTimeUsed.textContent = `考试用时：${m} 分 ${s} 秒 (答题率: ${Math.round(answeredCount/totalQ*100)}%)`;

    resultModal.classList.add('open');
  }

  // Drawer
  function openMobileDrawer() {
    sidePanel.classList.add('open');
    drawerOverlay.classList.add('open');
  }
  function closeMobileDrawer() {
    sidePanel.classList.remove('open');
    drawerOverlay.classList.remove('open');
  }

  // Search
  function openSearch() {
    searchModal.classList.add('open');
    searchInput.value = '';
    searchInput.focus();
    renderSearchResults('');
  }
  function closeSearch() {
    searchModal.classList.remove('open');
  }
  function renderSearchResults(kw) {
    if (!kw || kw.trim().length === 0) {
      searchResults.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:2rem;">输入关键词搜索全题库 1000 道题目</div>';
      return;
    }
    const cleanKw = kw.trim();
    const hits = [];

    allPapers.forEach(p => {
      p.questions.forEach(q => {
        if (q.content.includes(cleanKw) || q.options.some(opt => opt.includes(cleanKw))) {
          hits.push({ paper: p, question: q });
        }
      });
    });

    if (hits.length === 0) {
      searchResults.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:2rem;">未找到包含 "${cleanKw}" 的题目</div>`;
      return;
    }

    searchResults.innerHTML = '';
    hits.slice(0, 50).forEach(hit => {
      const item = document.createElement('div');
      item.className = 'search-item';
      const highlighted = hit.question.content.split(cleanKw).join(`<mark>${cleanKw}</mark>`);
      item.innerHTML = `
        <div style="font-size:0.75rem; color:var(--text-sub); margin-bottom:0.25rem;">${hit.paper.name} · 第 ${hit.question.index} 题 (${hit.question.type === 'choice' ? '单选' : '判断'})</div>
        <div style="font-size:0.95rem; font-weight:500;">${highlighted}</div>
        <div style="font-size:0.85rem; color:var(--success); margin-top:0.25rem;">标准答案: <b>${hit.question.answer}</b></div>
      `;
      item.onclick = () => {
        closeSearch();
        currentMode = 'practice';
        modeSelect.value = 'practice';
        currentPaperId = hit.paper.id;
        paperSelect.value = currentPaperId;
        initQuestionsForMode();
        currentIndex = hit.question.index - 1;
        renderQuestion();
      };
      searchResults.appendChild(item);
    });
  }

  // Event Listeners
  modeSelect.onchange = (e) => {
    currentMode = e.target.value;
    initQuestionsForMode();
  };

  paperSelect.onchange = (e) => {
    currentPaperId = e.target.value;
    initQuestionsForMode();
  };

  btnPrev.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  };

  btnNext.onclick = () => {
    if (currentIndex < activeQuestions.length - 1) {
      currentIndex++;
      renderQuestion();
    }
  };

  btnToggleFav.onclick = () => {
    const q = activeQuestions[currentIndex];
    const qKey = getQuestionKey(q);
    const favs = getFavorites();
    if (favs[qKey]) {
      delete favs[qKey];
    } else {
      favs[qKey] = true;
    }
    saveFavorites(favs);
    renderQuestion();
  };

  btnSubmitExam.onclick = () => {
    const totalQ = activeQuestions.length;
    const answered = Object.keys(userAnswers).length;
    const unans = totalQ - answered;
    const msg = unans > 0 ? `您还有 ${unans} 道题未做，确定现在交卷吗？` : '您已完成所有题目，确定现在交卷吗？';
    if (confirm(msg)) {
      submitExam();
    }
  };

  btnReviewWrongs.onclick = () => {
    resultModal.classList.remove('open');
    currentMode = 'practice';
    modeSelect.value = 'practice';
    renderQuestion();
  };

  btnCloseResult.onclick = () => {
    resultModal.classList.remove('open');
    currentMode = 'practice';
    modeSelect.value = 'practice';
    initQuestionsForMode();
  };

  btnToggleDrawer.onclick = openMobileDrawer;
  btnCloseDrawer.onclick = closeMobileDrawer;
  drawerOverlay.onclick = closeMobileDrawer;

  btnCloseLightbox.onclick = closeLightbox;
  lightboxModal.onclick = (e) => {
    if (e.target === lightboxModal) closeLightbox();
  };

  btnSearch.onclick = openSearch;
  btnCloseSearch.onclick = closeSearch;
  searchInput.oninput = (e) => renderSearchResults(e.target.value);

  // Theme Toggle
  function initTheme() {
    const saved = localStorage.getItem(STORAGE_THEME) || 'dark';
    document.body.setAttribute('data-theme', saved);
    btnThemeToggle.textContent = saved === 'dark' ? '🌙' : '☀️';
  }
  btnThemeToggle.onclick = () => {
    const cur = document.body.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_THEME, next);
    btnThemeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
  };

  // Keyboard Shortcuts (Desktop)
  window.addEventListener('keydown', (e) => {
    if (searchModal.classList.contains('open')) return;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      btnPrev.click();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      btnNext.click();
    } else if (['1', '2', '3', '4', 'a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
      const q = activeQuestions[currentIndex];
      if (!q) return;
      let letter = '';
      if (['1', 'a', 'A'].includes(e.key)) letter = (q.type === 'choice' ? 'A' : '√');
      else if (['2', 'b', 'B'].includes(e.key)) letter = (q.type === 'choice' ? 'B' : '×');
      else if (['3', 'c', 'C'].includes(e.key)) letter = 'C';
      else if (['4', 'd', 'D'].includes(e.key)) letter = 'D';
      if (letter) onSelectOption(q, letter);
    }
  });

  // Touch swipe support (Mobile)
  let touchStartX = 0;
  questionCard.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  questionCard.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (diff > 60) {
      btnPrev.click(); // swipe right -> previous
    } else if (diff < -60) {
      btnNext.click(); // swipe left -> next
    }
  }, { passive: true });

  // Boot
  initTheme();
  initPapersDropdown();
  initQuestionsForMode();

})();
