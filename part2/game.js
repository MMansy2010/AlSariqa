/**
 * Escape Room Part 2 — Game logic
 * Level 1: clean | Level 2: heavy pranks
 */

const STORAGE = {
    name: 'escape2_player_name',
    team: 'escape2_player_team',
    members: 'escape2_team_members',
    timerEnd: 'escape2_timer_end',
    levelKey: (team, n) => `escape2_${team}_level_${n}`,
    failKey: (team, level, suffix = '') => `escape2_${team}_level_${level}_fails${suffix}`,
    lockKey: (team, level, suffix = '') => `escape2_${team}_level_${level}_lock${suffix}`,
};

const MAX_LEVELS = 8;
const TIMER_MS = 60 * 60 * 1000;
const ARAB_LEVEL = ['', 'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة', 'السابعة', 'الثامنة'];

/** منع التخمين: 3 أخطاء → قفل 90 ثانية + خصم 3 دقائق من العداد لكل خطأ */
const ATTEMPT = {
    maxFails: 3,
    lockoutMs: 90 * 1000,
    timerPenaltyMs: 3 * 60 * 1000,
};

let lockoutTicker = null;

const levelsData = {
    1: {
        title: 'المرحلة الأولى: عدّ المثلثات',
        blue: {
            mode: 'code',
            intro: 'كم مثلثاً في الشكل؟ عدّوا الصغيرة والمتوسطة والكبيرة كلها معاً. ثم طبّقوا المعادلة من الغرفة لاستخراج كود المرور.',
            answers: ['34'],
            inputPlaceholder: 'كود المرور',
        },
        red: {
            mode: 'code',
            intro: 'نص مشفّر بالمعكوس (من اليمين لليسار، Capital). اقرأوه كمرآة إنجليزية لاكتشاف الرقم — ثم المعادلة من الغرفة.',
            answers: ['18'],
            inputPlaceholder: 'كود المرور',
        },
    },
    2: {
        title: 'المرحلة الثانية: السهم الناقص / الرموز',
        blue: {
            mode: 'arrow-grid',
            intro: 'شبكة مربعات: كل خلية فيها سهم. الخلية الوسطى ناقصة — اختاروا السهم الذي يكمل النمط (اتجاه الدوران مع عقارب الساعة على الحواف).',
            correctArrow: 'right',
            answers: ['right', '→', 'd', 'D', 'يمين'],
        },
        red: {
            mode: 'code',
            intro: 'طابقوا الرموز الرياضية مع الورقة الفيزيائية في الغرفة، ثم احسبوا الناتج النهائي وأدخلوه هنا.',
            answers: ['72'],
            inputPlaceholder: 'الناتج النهائي',
        },
    },
};

let currentLevel = 1;
let team = '';
let name = '';
let members = [];
let timerInterval = null;
let selectedArrow = null;
let blueL2AwaitingPassword = false;

document.addEventListener('DOMContentLoaded', init);

function init() {
    name = localStorage.getItem(STORAGE.name) || '';
    team = localStorage.getItem(STORAGE.team) || '';

    if (!name || !team || (team !== 'blue' && team !== 'red')) {
        window.location.href = 'index.html';
        return;
    }

    document.body.classList.add(team === 'blue' ? 'theme-blue' : 'theme-red');

    try {
        members = JSON.parse(localStorage.getItem(STORAGE.members) || '[]') || [];
    } catch {
        members = [];
    }

    renderPlayerPanel();
    currentLevel = resolveCurrentLevel();
    initTimer();
    startClock();
    bindAnswerControls();
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' || blueL2AwaitingPassword) return;
        if (currentLevel === 2 && team === 'blue' && levelsData[2]?.blue?.mode === 'arrow-grid') {
            const root = getPrankRoot();
            if (!root || !root.children.length) {
                e.preventDefault();
                submitAnswer();
            }
        }
    });
    renderLevel();

    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            clearPrankRoot();
            document.body.classList.remove('horror-lock', 'shake-violent', 'glitch-active');
            GameAudio.stopAll();
        }
    });
}

function resolveCurrentLevel() {
    for (let n = MAX_LEVELS; n >= 1; n--) {
        if (localStorage.getItem(STORAGE.levelKey(team, n)) === 'passed') {
            return Math.min(n + 1, MAX_LEVELS + 1);
        }
    }
    return 1;
}

function getPrankRoot() {
    return document.getElementById('prank-root');
}

function clearPrankRoot() {
    const root = getPrankRoot();
    if (root) root.innerHTML = '';
}

function renderPlayerPanel() {
    const leaderEl = document.getElementById('player-display-name');
    const teamEl = document.getElementById('player-display-team');
    const membersWrap = document.getElementById('members-display-container');
    const membersList = document.getElementById('members-display-list');

    if (leaderEl) leaderEl.textContent = name;
    if (teamEl) {
        teamEl.textContent = team === 'blue' ? 'الفريق الأزرق · ALPHA' : 'الفريق الأحمر · OMEGA';
    }

    if (membersWrap && membersList) {
        membersList.innerHTML = '';
        if (members.length > 0) {
            membersWrap.hidden = false;
            members.forEach((m) => {
                const chip = document.createElement('span');
                chip.className = 'member-chip';
                chip.textContent = m;
                membersList.appendChild(chip);
            });
        } else {
            membersWrap.hidden = true;
        }
    }
}

function initTimer() {
    let timerEnd = localStorage.getItem(STORAGE.timerEnd);
    if (!timerEnd) {
        timerEnd = String(Date.now() + TIMER_MS);
        localStorage.setItem(STORAGE.timerEnd, timerEnd);
    } else {
        timerEnd = String(parseInt(timerEnd, 10));
    }

    const timerEl = document.getElementById('countdown-timer');
    if (!timerEl) return;

    function tick() {
        const remaining = parseInt(timerEnd, 10) - Date.now();
        if (remaining <= 0) {
            timerEl.textContent = '00:00';
            timerEl.classList.add('critical');
            clearInterval(timerInterval);
            return;
        }
        const sec = Math.floor(remaining / 1000);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        timerEl.classList.remove('warning', 'critical');
        if (sec <= 300) timerEl.classList.add('critical');
        else if (sec <= 900) timerEl.classList.add('warning');
    }

    tick();
    timerInterval = setInterval(tick, 1000);
}

function startClock() {
    const live = document.getElementById('live-time');
    if (!live) return;
    function tick() {
        const n = new Date();
        live.textContent = [n.getHours(), n.getMinutes(), n.getSeconds()]
            .map((v) => String(v).padStart(2, '0'))
            .join(':');
    }
    tick();
    setInterval(tick, 1000);
}

function bindAnswerControls() {
    const btn = document.getElementById('btn-submit-answer');
    const input = document.getElementById('answer-input');
    if (!btn || !input) return;

    btn.addEventListener('click', submitAnswer);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitAnswer();
        }
    });
}

function normalizeCode(val) {
    return String(val || '')
        .trim()
        .replace(/\s+/g, '');
}

function normalizeText(val) {
    return String(val || '')
        .trim()
        .toLowerCase();
}

function checkCode(inputVal, correctList) {
    const user = normalizeCode(inputVal);
    return correctList.some((c) => user === normalizeCode(c));
}

function checkText(inputVal, correctList) {
    const user = normalizeText(inputVal);
    return correctList.some((c) => user === normalizeText(c));
}

function getLevelPayload(level) {
    const data = levelsData[level];
    if (!data) return null;
    return data[team] || null;
}

function getAttemptState(level, suffix = '') {
    const fails = parseInt(localStorage.getItem(STORAGE.failKey(team, level, suffix)) || '0', 10);
    const lockUntil = parseInt(localStorage.getItem(STORAGE.lockKey(team, level, suffix)) || '0', 10);
    const isLocked = Date.now() < lockUntil;
    return { fails, lockUntil, isLocked };
}

function clearAttempts(level, suffix = '') {
    localStorage.removeItem(STORAGE.failKey(team, level, suffix));
    localStorage.removeItem(STORAGE.lockKey(team, level, suffix));
}

function applyTimerPenalty(ms) {
    let timerEnd = parseInt(localStorage.getItem(STORAGE.timerEnd) || '0', 10);
    if (!timerEnd) return;
    timerEnd -= ms;
    localStorage.setItem(STORAGE.timerEnd, String(timerEnd));
}

function registerWrongAttempt(level, suffix = '') {
    const state = getAttemptState(level, suffix);
    if (state.isLocked) return state;

    let fails = state.fails + 1;
    applyTimerPenalty(ATTEMPT.timerPenaltyMs);

    if (fails >= ATTEMPT.maxFails) {
        localStorage.setItem(STORAGE.lockKey(team, level, suffix), String(Date.now() + ATTEMPT.lockoutMs));
        localStorage.setItem(STORAGE.failKey(team, level, suffix), '0');
        return getAttemptState(level, suffix);
    }

    localStorage.setItem(STORAGE.failKey(team, level, suffix), String(fails));
    return getAttemptState(level, suffix);
}

function getLockSecondsLeft(level, suffix = '') {
    const { lockUntil, isLocked } = getAttemptState(level, suffix);
    if (!isLocked) return 0;
    return Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000));
}

function stopLockoutTicker() {
    if (lockoutTicker) {
        clearInterval(lockoutTicker);
        lockoutTicker = null;
    }
}

function updateAttemptsHint(level, suffix = '') {
    const hint = document.getElementById('attempts-hint');
    if (!hint) return;

    const state = getAttemptState(level, suffix);
    const sec = getLockSecondsLeft(level, suffix);

    if (state.isLocked && sec > 0) {
        hint.hidden = false;
        hint.className = 'attempts-hint locked';
        hint.textContent = `🔒 تم قفل المحاولات — انتظروا ${sec} ثانية (لا يمكن التخمين)`;
        return;
    }

    if (state.fails > 0) {
        const left = ATTEMPT.maxFails - state.fails;
        hint.hidden = false;
        hint.className = 'attempts-hint warn';
        hint.textContent = `⚠️ أخطاء: ${state.fails}/${ATTEMPT.maxFails} — تبقى ${left} محاولة قبل القفل 90 ثانية (كل خطأ = −3 دقائق من الوقت)`;
        return;
    }

    hint.hidden = true;
    hint.textContent = '';
}

function setAnswerControlsEnabled(enabled) {
    const input = document.getElementById('answer-input');
    const btn = document.getElementById('btn-submit-answer');
    if (input) input.disabled = !enabled;
    if (btn) btn.disabled = !enabled;
    document.querySelectorAll('.arrow-choice').forEach((el) => {
        el.disabled = !enabled;
        if (!enabled) el.classList.remove('selected');
    });
}

function syncAttemptLockUI(level, suffix = '') {
    stopLockoutTicker();
    const sec = getLockSecondsLeft(level, suffix);
    const locked = sec > 0;

    setAnswerControlsEnabled(!locked);
    updateAttemptsHint(level, suffix);

    if (locked) {
        lockoutTicker = setInterval(() => {
            const left = getLockSecondsLeft(level, suffix);
            if (left <= 0) {
                stopLockoutTicker();
                setAnswerControlsEnabled(true);
                updateAttemptsHint(level, suffix);
                return;
            }
            updateAttemptsHint(level, suffix);
        }, 1000);
    }
    return locked;
}

function isAttemptLocked(level, suffix = '') {
    return getLockSecondsLeft(level, suffix) > 0;
}

function handleWrongAnswer(level, suffix = '') {
    registerWrongAttempt(level, suffix);
    syncAttemptLockUI(level, suffix);
    const state = getAttemptState(level, suffix);
    if (state.isLocked) {
        return `🔒 تم قفل الإدخال لمدة 90 ثانية — لا تخمين!`;
    }
    const left = ATTEMPT.maxFails - state.fails;
    return `إجابة خاطئة — تبقى ${left} محاولة (خصم 3 دقائق من الوقت)`;
}

function buildBlueTriangleVisual() {
    return `
        <div class="triangle-puzzle-image" role="img" aria-label="كم مثلثاً في الشكل؟">
            <img src="assets/triangle-puzzle.png" alt="لغز عد المثلثات" />
        </div>
    `;
}

function buildRedVisual() {
    return `
        <div class="cipher-stage">
            <span class="cipher-text" dir="rtl">E E R H T</span>
            <p class="cipher-meta"><i class="fas fa-rotate"></i> معكوس · Capital · مرآة إنجليزية</p>
        </div>
    `;
}

function buildArrowGridVisual() {
    const grid = [
        ['→', '↓', '←'],
        ['↑', '?', '↓'],
        ['←', '↑', '→'],
    ];
    const cells = grid
        .flat()
        .map((c) => {
            const cls = c === '?' ? 'arrow-cell missing' : 'arrow-cell';
            return `<div class="${cls}">${c}</div>`;
        })
        .join('');

    const choices = [
        { id: 'up', label: 'A · ↑', value: 'up' },
        { id: 'down', label: 'B · ↓', value: 'down' },
        { id: 'left', label: 'C · ←', value: 'left' },
        { id: 'right', label: 'D · →', value: 'right' },
    ];

    const btns = choices
        .map(
            (c) =>
                `<button type="button" class="arrow-choice" data-arrow="${c.value}">${c.label}</button>`
        )
        .join('');

    return `
        <div class="arrow-grid-wrap">
            <div class="arrow-grid">${cells}</div>
            <div class="arrow-choices" id="arrow-choices">${btns}</div>
        </div>
    `;
}

function buildRedMathVisual() {
    return `
        <div class="math-puzzle">
            <div>( △ + ○ ) × □ − ☆ = ?</div>
            <div style="font-size:0.75rem;margin-top:12px;color:var(--muted);font-family:var(--font)">
                △ ○ □ ☆ — قيمها على الورقة في الغرفة
            </div>
        </div>
    `;
}

function bindArrowChoices() {
    selectedArrow = null;
    const container = document.getElementById('arrow-choices');
    if (!container) return;

    container.querySelectorAll('.arrow-choice').forEach((btn) => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.arrow-choice').forEach((b) => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedArrow = btn.getAttribute('data-arrow');
        });
    });
}

function renderLevel() {
    stopLockoutTicker();
    clearPrankRoot();
    document.body.classList.remove('horror-lock', 'shake-violent', 'glitch-active');
    blueL2AwaitingPassword = false;

    const section = document.getElementById('active-gameplay-section');
    const winSection = document.getElementById('win-section');
    const controls = document.getElementById('answer-controls');
    if (!section) return;

    if (currentLevel > MAX_LEVELS) {
        section.hidden = true;
        if (winSection) winSection.hidden = false;
        return;
    }

    if (winSection) winSection.hidden = true;
    section.hidden = false;

    const levelTag = document.getElementById('level-pill');
    const levelTitle = document.getElementById('current-level-title');
    const riddleHost = document.getElementById('riddle-host');
    const input = document.getElementById('answer-input');
    const feedback = document.getElementById('feedback-msg');

    if (levelTag) levelTag.textContent = `المرحلة ${currentLevel} / ${MAX_LEVELS}`;
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback-msg';
    }
    if (input) {
        input.value = '';
        input.classList.remove('input-error');
    }

    if (currentLevel >= 3 && !levelsData[currentLevel]) {
        if (levelTitle) levelTitle.textContent = `المرحلة ${ARAB_LEVEL[currentLevel]} — قيد الإعداد`;
        if (riddleHost) {
            riddleHost.innerHTML = `
                <div class="placeholder-level">
                    <i class="fas fa-screwdriver-wrench"></i>
                    <p>أكملتم المرحلة الثانية.</p>
                    <p>محتوى المرحلة ${ARAB_LEVEL[currentLevel]} قريباً.</p>
                </div>
            `;
        }
        if (controls) controls.hidden = true;
        return;
    }

    const base = levelsData[currentLevel];
    const payload = getLevelPayload(currentLevel);
    if (!base || !payload) return;

    if (levelTitle) levelTitle.textContent = base.title;

    let visual = '';
    if (currentLevel === 1 && team === 'blue') visual = buildBlueTriangleVisual();
    if (currentLevel === 1 && team === 'red') visual = buildRedVisual();
    if (currentLevel === 2 && team === 'blue') visual = buildArrowGridVisual();
    if (currentLevel === 2 && team === 'red') visual = buildRedMathVisual();

    if (riddleHost) {
        riddleHost.innerHTML = `
            <div class="riddle-box">
                <p>${payload.intro}</p>
                ${currentLevel === 1 ? '<p class="hint-line">استخدموا المعادلة المكتوبة في الغرفة لاستخراج كود المرور.</p>' : ''}
            </div>
            ${visual}
        `;
    }

    if (currentLevel === 2 && team === 'blue') {
        bindArrowChoices();
        if (controls) controls.hidden = false;
        if (input) {
            input.hidden = true;
            input.parentElement.querySelector('.btn-submit')?.classList.remove('hidden');
        }
        showFeedback('اختر السهم ثم اضغط تحقق أو Enter', '');
        syncAttemptLockUI(2);
        return;
    }

    if (controls) controls.hidden = false;
    if (input) {
        input.hidden = false;
        input.placeholder = payload.inputPlaceholder || 'كود المرور';
        input.setAttribute(
            'inputmode',
            currentLevel === 2 && team === 'red' ? 'numeric' : 'numeric'
        );
    }

    if (payload.mode === 'code' || currentLevel === 1) {
        syncAttemptLockUI(currentLevel);
    }
}

function showFeedback(message, type) {
    const el = document.getElementById('feedback-msg');
    if (!el) return;
    el.textContent = message;
    el.className = type ? `feedback-msg ${type}` : 'feedback-msg';
}

function submitAnswer() {
    if (currentLevel > MAX_LEVELS) return;

    const payload = getLevelPayload(currentLevel);
    if (!payload) {
        showFeedback('انتظروا محتوى هذه المرحلة.', 'error');
        return;
    }

    if (currentLevel === 2 && team === 'blue' && payload.mode === 'arrow-grid') {
        submitArrowGrid(payload);
        return;
    }

    if (isAttemptLocked(currentLevel)) {
        showFeedback(`🔒 المحاولات مقفولة — انتظروا ${getLockSecondsLeft(currentLevel)} ثانية`, 'error');
        GameAudio.playError();
        return;
    }

    const input = document.getElementById('answer-input');
    if (!input) return;
    const userVal = input.value;

    if (!userVal.trim()) {
        input.classList.add('input-error');
        showFeedback('أدخل الإجابة أولاً.', 'error');
        GameAudio.playError();
        return;
    }

    if (!checkCode(userVal, payload.answers)) {
        input.classList.add('input-error');
        showFeedback(handleWrongAnswer(currentLevel), 'error');
        GameAudio.playError();
        setTimeout(() => input.classList.remove('input-error'), 500);
        return;
    }

    clearAttempts(currentLevel);
    input.classList.remove('input-error');

    if (currentLevel === 2 && team === 'red') {
        showFeedback('ناتج صحيح — جاري فحص النظام...', 'success');
        setTimeout(() => startRedFakeCrash(), 500);
        return;
    }

    completeLevelNormally();
}

function submitArrowGrid(payload) {
    if (isAttemptLocked(2)) {
        showFeedback(`🔒 المحاولات مقفولة — انتظروا ${getLockSecondsLeft(2)} ثانية`, 'error');
        GameAudio.playError();
        return;
    }

    if (!selectedArrow) {
        showFeedback('اختر أحد الأسهم (A/B/C/D) أولاً.', 'error');
        GameAudio.playError();
        return;
    }

    const ok =
        selectedArrow === payload.correctArrow ||
        checkText(selectedArrow, payload.answers);

    if (!ok) {
        showFeedback(handleWrongAnswer(2), 'error');
        GameAudio.playError();
        return;
    }

    clearAttempts(2);
    showFeedback('إجابة صحيحة — جاري فتح البوابة...', 'success');
    setTimeout(() => startBlueFakeWin(), 600);
}

/* —— Blue Level 2: Fake win → Jumpscare → SCAM —— */
function startBlueFakeWin() {
    clearPrankRoot();
    document.body.classList.add('horror-lock');
    GameAudio.playCheer(true);

    const root = getPrankRoot();
    root.innerHTML = `
        <div class="fake-win-screen" id="fake-win-screen">
            <div class="trophy"><i class="fas fa-trophy"></i></div>
            <h2>🎉 مبروك! تم حل اللغز بنجاح!</h2>
            <p>أنتم عباقرة! اضغطوا للانتقال إلى المرحلة التالية والاحتفال.</p>
            <button type="button" class="btn-fake-next" id="btn-fake-next">الانتقال للمستوى التالي ➜</button>
        </div>
    `;

    document.getElementById('btn-fake-next').addEventListener('click', () => {
        GameAudio.stopAll();
        runBlueJumpscare();
    });
}

function runBlueJumpscare() {
    clearPrankRoot();
    document.body.classList.add('horror-lock', 'shake-violent', 'glitch-active');

    const flash = document.createElement('div');
    flash.className = 'red-flash-layer';
    getPrankRoot().appendChild(flash);

    setTimeout(() => {
        flash.remove();
        showJumpscare('scream', () => {
            document.body.classList.remove('shake-violent', 'glitch-active');
            showBluePasswordScreen();
        });
    }, 200);
}

function showBluePasswordScreen() {
    clearPrankRoot();
    document.body.classList.add('horror-lock');
    blueL2AwaitingPassword = true;

    const root = getPrankRoot();
    root.innerHTML = `
        <div class="password-black-screen">
            <h3><i class="fas fa-lock"></i> كود المرور السري</h3>
            <p style="color:#888;font-size:0.85rem;margin-bottom:16px;font-weight:600">ابحثوا خلف الورقة الفيزيائية في الغرفة</p>
            <input type="text" id="prank-password-input" placeholder="أدخل الكود السري..." autocomplete="off" spellcheck="false" />
            <button type="button" class="btn-submit" id="btn-prank-password">تحقق</button>
            <p class="attempts-hint" id="prank-pw-hint" hidden></p>
            <p class="feedback-msg" id="prank-pw-feedback" style="margin-top:14px;color:#ff3d6a"></p>
        </div>
    `;

    const inp = document.getElementById('prank-password-input');
    const btn = document.getElementById('btn-prank-password');
    const fb = document.getElementById('prank-pw-feedback');
    const pwHint = document.getElementById('prank-pw-hint');
    const PW_SUFFIX = '_scam';

    function updatePrankPwHint() {
        if (!pwHint) return;
        const sec = getLockSecondsLeft(2, PW_SUFFIX);
        const state = getAttemptState(2, PW_SUFFIX);
        if (sec > 0) {
            pwHint.hidden = false;
            pwHint.className = 'attempts-hint locked';
            pwHint.textContent = `🔒 قفل ${sec} ثانية — لا تخمين`;
            inp.disabled = true;
            btn.disabled = true;
            return;
        }
        inp.disabled = false;
        btn.disabled = false;
        if (state.fails > 0) {
            const left = ATTEMPT.maxFails - state.fails;
            pwHint.hidden = false;
            pwHint.className = 'attempts-hint warn';
            pwHint.textContent = `⚠️ أخطاء: ${state.fails}/${ATTEMPT.maxFails} — تبقى ${left} محاولة`;
        } else {
            pwHint.hidden = true;
        }
    }

    let prankLockTicker = setInterval(updatePrankPwHint, 1000);
    updatePrankPwHint();

    function tryPassword() {
        if (isAttemptLocked(2, PW_SUFFIX)) {
            fb.textContent = `انتظروا ${getLockSecondsLeft(2, PW_SUFFIX)} ثانية`;
            GameAudio.playError();
            return;
        }

        const val = normalizeText(inp.value);
        if (val === 'scam') {
            clearInterval(prankLockTicker);
            clearAttempts(2, PW_SUFFIX);
            fb.textContent = '';
            GameAudio.playSuccess();
            blueL2AwaitingPassword = false;
            localStorage.setItem(STORAGE.levelKey(team, 2), 'passed');
            clearPrankRoot();
            document.body.classList.remove('horror-lock');
            const next = 3;
            runLevelTransition(2, next, () => {
                currentLevel = next;
                renderLevel();
            });
        } else {
            registerWrongAttempt(2, PW_SUFFIX);
            updatePrankPwHint();
            const state = getAttemptState(2, PW_SUFFIX);
            fb.textContent = state.isLocked
                ? '🔒 تم القفل — توقفوا عن التخمين'
                : handleWrongAnswer(2, PW_SUFFIX).replace('إجابة خاطئة — ', 'كود خاطئ — ');
            GameAudio.playError();
            inp.classList.add('input-error');
            setTimeout(() => inp.classList.remove('input-error'), 400);
        }
    }

    btn.addEventListener('click', tryPassword);
    inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            tryPassword();
        }
    });
    inp.focus();
}

/* —— Red Level 2: Fake crash → Jumpscare → Level 3 —— */
function startRedFakeCrash() {
    clearPrankRoot();
    document.body.classList.add('horror-lock');
    GameAudio.playStatic(true);

    const logLines = [
        'kernel_panic: fatal exception in escape_protocol.dll',
        'rm -rf /private/data/photos/*',
        'rm -rf /private/data/messages/*',
        'format C: /q /y',
        'del /f /s /q %USERPROFILE%\\*',
        'encrypting wallet.dat ...',
        'uploading browser_history.db → unknown_host',
        'override security_firewall = FALSE',
        'inject_payload.exe --silent',
    ];

    const root = getPrankRoot();
    root.innerHTML = `
        <div class="crash-screen" id="crash-screen">
            <div class="crash-log" id="crash-log"></div>
            <div class="crash-warning">⚠️ Warning: Deleting Private Data...</div>
            <div class="crash-progress"><div class="crash-bar" id="crash-bar"></div></div>
            <div class="crash-percent" id="crash-percent">0%</div>
        </div>
    `;

    const logEl = document.getElementById('crash-log');
    let lineIdx = 0;
    const logInterval = setInterval(() => {
        if (lineIdx < logLines.length) {
            logEl.innerHTML += `<div>> ${logLines[lineIdx]}</div>`;
            lineIdx++;
        } else {
            logEl.innerHTML += `<div>> ${Math.random().toString(16).slice(2)} corrupt</div>`;
        }
        logEl.scrollTop = logEl.scrollHeight;
    }, 120);

    const bar = document.getElementById('crash-bar');
    const pct = document.getElementById('crash-percent');
    let progress = 0;
    const crashDuration = 4200;
    const step = 40;
    const increment = 100 / (crashDuration / step);

    const progressInterval = setInterval(() => {
        progress = Math.min(100, progress + increment);
        bar.style.width = `${progress}%`;
        pct.textContent = `${Math.floor(progress)}%`;

        if (progress >= 100) {
            clearInterval(progressInterval);
            clearInterval(logInterval);
            GameAudio.stopAll();
            setTimeout(() => {
                runRedJumpscare();
            }, 150);
        }
    }, step);
}

function runRedJumpscare() {
    document.body.classList.add('shake-violent', 'glitch-active');
    showJumpscare('laugh', () => {
        document.body.classList.remove('horror-lock', 'shake-violent', 'glitch-active');
        localStorage.setItem(STORAGE.levelKey(team, 2), 'passed');
        clearPrankRoot();
        showFeedback('... النظام استعاد الوعي. المرحلة الثالئة مفتوحة.', 'success');
        const next = 3;
        runLevelTransition(2, next, () => {
            currentLevel = next;
            renderLevel();
        });
    });
}

function showJumpscare(soundType, onDone) {
    clearPrankRoot();
    document.body.classList.add('horror-lock');

    if (soundType === 'scream') GameAudio.playScream();
    else GameAudio.playLaugh();

    const layer = document.createElement('div');
    layer.className = 'jumpscare-layer';
    layer.innerHTML = `<img src="assets/jumpscare-face.svg" alt="" />`;
    getPrankRoot().appendChild(layer);

    setTimeout(() => {
        layer.remove();
        if (typeof onDone === 'function') onDone();
    }, 1500);
}

function completeLevelNormally() {
    clearAttempts(currentLevel);
    showFeedback('صحيح — جاري الانتقال...', 'success');
    GameAudio.playSuccess();

    localStorage.setItem(STORAGE.levelKey(team, currentLevel), 'passed');
    const completed = currentLevel;
    const next = currentLevel + 1;

    setTimeout(() => {
        runLevelTransition(completed, next, () => {
            currentLevel = next;
            renderLevel();
            document.getElementById('answer-input')?.focus();
        });
    }, 450);
}

function runLevelTransition(completed, next, onDone) {
    const color = team === 'blue' ? '#3dc8ff' : '#ff3d6a';
    const overlay = document.createElement('div');
    overlay.className = 'level-overlay';

    const nextLabel =
        next <= MAX_LEVELS
            ? `جاري تهيئة المرحلة ${ARAB_LEVEL[next]}...`
            : 'اكتملت جميع المراحل!';

    overlay.innerHTML = `
        <div class="overlay-inner" style="color:${color}">
            <div class="icon"><i class="fas fa-shield-halved"></i></div>
            <h2>تم تجاوز المرحلة ${ARAB_LEVEL[completed]}</h2>
            <p>${nextLabel}</p>
            <div class="load-track">
                <div class="load-fill" id="transition-bar" style="background:${color};box-shadow:0 0 12px ${color}"></div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.offsetWidth;
    overlay.classList.add('active');

    setTimeout(() => {
        const bar = document.getElementById('transition-bar');
        if (bar) bar.style.width = '100%';
    }, 80);

    setTimeout(() => {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
            if (typeof onDone === 'function') onDone();
        }, 450);
    }, 1600);
}
