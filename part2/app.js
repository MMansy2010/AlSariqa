/**
 * Escape Room Part 2 — Launch screen
 * Storage prefix: escape2_ (isolated from part 1)
 */

const STORAGE = {
    name: 'escape2_player_name',
    team: 'escape2_player_team',
    members: 'escape2_team_members',
    timerEnd: 'escape2_timer_end',
    winTime: 'escape2_win_time',
    panicActive: 'escape2_panic_active',
    panicEnd: 'escape2_panic_timer_end',
    levelKey: (team, n) => `escape2_${team}_level_${n}`,
    hintKey: (n) => `escape2_hint_level_${n}_used`,
};

const MAX_LEVELS = 8;

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const inputName = document.getElementById('player-name');
    const hiddenTeam = document.getElementById('player-team');
    const teamPicker = document.getElementById('team-picker');
    const teamOptions = teamPicker.querySelectorAll('.team-option');
    const btnStart = document.getElementById('btn-start');
    const liveTime = document.getElementById('live-time');
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    const toast = document.getElementById('cyber-toast');
    const toastMessage = document.getElementById('toast-message');
    const teamMembersGroup = document.getElementById('team-members-group');
    const inputMemberName = document.getElementById('member-name-input');
    const btnAddMember = document.getElementById('btn-add-member');
    const membersListContainer = document.getElementById('members-list-container');
    const canvas = document.getElementById('particle-canvas');

    let teamMembers = [];
    let audioEnabled = true;
    let audioCtx = null;

    initParticles(canvas);

    function renderMembers() {
        membersListContainer.innerHTML = '';
        teamMembers.forEach((member, index) => {
            const badge = document.createElement('div');
            badge.className = 'member-badge';
            badge.innerHTML = `
                <span>${member}</span>
                <span class="remove-member" data-index="${index}"><i class="fas fa-xmark"></i></span>
            `;
            membersListContainer.appendChild(badge);
        });
        membersListContainer.querySelectorAll('.remove-member').forEach((btn) => {
            btn.addEventListener('click', () => {
                teamMembers.splice(parseInt(btn.dataset.index, 10), 1);
                renderMembers();
                playSynth('click');
            });
        });
    }

    function addMember() {
        const val = inputMemberName.value.trim();
        if (!val) return;
        teamMembers.push(val);
        renderMembers();
        inputMemberName.value = '';
        inputMemberName.focus();
        playSynth('click');
    }

    btnAddMember.addEventListener('click', addMember);
    inputMemberName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addMember();
        }
    });

    const savedName = localStorage.getItem(STORAGE.name);
    const savedTeam = localStorage.getItem(STORAGE.team);
    const savedMembers = localStorage.getItem(STORAGE.members);

    if (savedName) inputName.value = savedName;
    if (savedTeam) selectTeam(savedTeam, false);
    if (savedMembers) {
        try {
            teamMembers = JSON.parse(savedMembers) || [];
            renderMembers();
        } catch {
            teamMembers = [];
        }
    }

    function selectTeam(team, playSound = true) {
        hiddenTeam.value = team;
        teamOptions.forEach((opt) => {
            const isSelected = opt.dataset.team === team;
            opt.classList.toggle('selected', isSelected);
            opt.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        });
        body.classList.remove('theme-blue', 'theme-red');
        if (team === 'blue') body.classList.add('theme-blue');
        if (team === 'red') body.classList.add('theme-red');

        if (team) {
            teamMembersGroup.hidden = false;
        } else {
            teamMembersGroup.hidden = true;
        }

        if (playSound) playSynth('theme-switch');
    }

    teamOptions.forEach((opt) => {
        opt.addEventListener('click', () => {
            const team = opt.dataset.team;
            if (hiddenTeam.value === team) return;
            selectTeam(team);
        });
    });

    function initAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function playSynth(type) {
        if (!audioEnabled) return;
        try {
            initAudio();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            const now = audioCtx.currentTime;

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(720, now);
                osc.frequency.exponentialRampToValueAtTime(120, now + 0.09);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
                osc.start(now);
                osc.stop(now + 0.09);
            } else if (type === 'theme-switch') {
                osc.type = 'triangle';
                const start = body.classList.contains('theme-red') ? 200 : 280;
                const end = body.classList.contains('theme-red') ? 480 : 620;
                osc.frequency.setValueAtTime(start, now);
                osc.frequency.exponentialRampToValueAtTime(end, now + 0.3);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'error') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(140, now);
                osc.frequency.linearRampToValueAtTime(70, now + 0.28);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'success') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(554, now + 0.1);
                osc.frequency.setValueAtTime(659, now + 0.2);
                gain.gain.setValueAtTime(0.14, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            }
        } catch (e) {
            console.warn('Audio:', e);
        }
    }

    audioToggle.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        audioToggle.classList.toggle('muted', !audioEnabled);
        audioIcon.className = audioEnabled ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
        audioToggle.querySelector('span').textContent = audioEnabled
            ? 'المؤثرات الصوتية مفعّلة'
            : 'المؤثرات الصوتية معطّلة';
        if (audioEnabled) {
            initAudio();
            playSynth('click');
        }
    });

    function updateClock() {
        const n = new Date();
        liveTime.textContent = [n.getHours(), n.getMinutes(), n.getSeconds()]
            .map((v) => String(v).padStart(2, '0'))
            .join(':');
    }
    updateClock();
    setInterval(updateClock, 1000);

    inputName.addEventListener('input', () => {
        if (inputName.value.length % 3 === 0) playSynth('click');
    });

    let toastTimer;
    function showToast(msg, isBlue = false) {
        clearTimeout(toastTimer);
        toastMessage.textContent = msg;
        toast.classList.toggle('toast-blue', isBlue);
        toast.classList.add('show');
        playSynth('error');
        toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
    }

    function clearSessionProgress() {
        const keys = [
            STORAGE.timerEnd,
            STORAGE.winTime,
            STORAGE.panicActive,
            STORAGE.panicEnd,
        ];
        keys.forEach((k) => localStorage.removeItem(k));
        ['blue', 'red'].forEach((t) => {
            for (let i = 1; i <= MAX_LEVELS; i++) {
                localStorage.removeItem(STORAGE.levelKey(t, i));
                localStorage.removeItem(STORAGE.hintKey(i));
                localStorage.removeItem(`escape2_${t}_level_${i}_fails`);
                localStorage.removeItem(`escape2_${t}_level_${i}_lock`);
                localStorage.removeItem(`escape2_${t}_level_${i}_fails_scam`);
                localStorage.removeItem(`escape2_${t}_level_${i}_lock_scam`);
            }
        });
    }

    btnStart.addEventListener('click', () => {
        initAudio();
        const nameVal = inputName.value.trim();
        const teamVal = hiddenTeam.value;
        const isBlue = body.classList.contains('theme-blue');

        if (!nameVal) {
            showToast('أدخل اسم قائد الفريق لتفعيل بروتوكول الإقلاع.', isBlue);
            inputName.focus();
            return;
        }
        if (!teamVal) {
            showToast('اختر الفريق الأزرق أو الأحمر قبل الإطلاق.', isBlue);
            return;
        }

        localStorage.setItem(STORAGE.name, nameVal);
        localStorage.setItem(STORAGE.team, teamVal);
        localStorage.setItem(STORAGE.members, JSON.stringify(teamMembers));
        clearSessionProgress();

        playSynth('success');
        runLaunchTransition(nameVal, teamVal);
    });

    function runLaunchTransition(name, team) {
        const teamLabel = team === 'blue' ? 'الفريق الأزرق · ALPHA' : 'الفريق الأحمر · OMEGA';
        const color = team === 'blue' ? '#3dc8ff' : '#ff3d6a';
        const membersLine =
            teamMembers.length > 0
                ? teamMembers.join('، ')
                : 'لا أعضاء إضافيين';

        const overlay = document.createElement('div');
        overlay.className = 'launch-overlay';
        overlay.innerHTML = `
            <div class="overlay-panel" style="color:${color}">
                <div class="overlay-icon"><i class="fas fa-satellite-dish"></i></div>
                <div class="overlay-title">تم التحقق من الهوية</div>
                <div class="overlay-meta">القائد: ${name}</div>
                <div class="overlay-meta">${teamLabel}</div>
                <div class="overlay-meta" style="max-width:320px;margin:8px auto;word-break:break-word">${membersLine}</div>
                <div class="overlay-status">تحميل المرحلة 1 من ${MAX_LEVELS}...</div>
                <div class="load-track">
                    <div class="load-fill" id="launch-bar" style="background:${color};box-shadow:0 0 12px ${color}"></div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.offsetWidth;
        overlay.classList.add('active');
        body.style.overflow = 'hidden';

        setTimeout(() => {
            const bar = document.getElementById('launch-bar');
            if (bar) bar.style.width = '100%';
        }, 80);

        if (audioEnabled && audioCtx) {
            try {
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(80, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 1.7);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                gain.gain.setValueAtTime(0.01, now);
                gain.gain.exponentialRampToValueAtTime(0.1, now + 1.4);
                gain.gain.linearRampToValueAtTime(0.001, now + 1.75);
                osc.start(now);
                osc.stop(now + 1.8);
            } catch (_) {}
        }

        setTimeout(() => {
            window.location.href = 'game.html';
        }, 1900);
    }

    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            document.querySelectorAll('.launch-overlay').forEach((el) => el.remove());
            body.style.overflow = '';
        }
    });
});

function initParticles(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    const dots = [];
    const COUNT = 48;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    for (let i = 0; i < COUNT; i++) {
        dots.push({
            x: Math.random(),
            y: Math.random(),
            r: 0.4 + Math.random() * 1.2,
            vx: (Math.random() - 0.5) * 0.0004,
            vy: (Math.random() - 0.5) * 0.0004,
        });
    }

    function frame() {
        ctx.clearRect(0, 0, w, h);
        const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#f5b942';
        dots.forEach((d) => {
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < 0 || d.x > 1) d.vx *= -1;
            if (d.y < 0 || d.y > 1) d.vy *= -1;
            ctx.beginPath();
            ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
            ctx.fillStyle = accent;
            ctx.globalAlpha = 0.35;
            ctx.fill();
        });
        requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(frame);
}
