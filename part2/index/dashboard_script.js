const RED_LEVEL_2_NEXT_LOCATION = "مع خالتو شيماء";
const BLUE_LEVEL_2_NEXT_LOCATION = "مع عمو احمد";
const BLUE_LEVEL_3_NEXT_LOCATION = "فوق التكييف";
const RED_LEVEL_3_NEXT_LOCATION = "اسفل السرير";
const RED_LEVEL_4_NEXT_LOCATION = "محمد";
const BLUE_LEVEL_4_NEXT_LOCATION = "محمد";

const ENVELOPE_DATA = {
    blue: {
        passwords: ["8143", "BLUE_DECRYPT_2", "7192", "5649", "CYPHER_ECHO_5", "DANIELROTH"],
        locations: [
            "🔎 تم مطابقة الصوت بنجاح! الظرف رقم (2) مخبأ فوق الثلاجة.",
            `⚡ تم تحديد تسلسل الأحداث بنجاح!\n\n🔎 الظرف رقم (3) مخبأ في: ${BLUE_LEVEL_2_NEXT_LOCATION}`,
            `🔎 تم تحديد النمط بنجاح.\n\nالقاتل سيترك دليله التالي في:\n\nالظرف رقم (4) مخبأ في:\n${BLUE_LEVEL_3_NEXT_LOCATION}`,
            `🔎 الظرف رقم (5) مخبأ مع:\n\n${BLUE_LEVEL_4_NEXT_LOCATION}`,
            "🔎 ممتاز! الظرف رقم (6) مخبأ مع خالتو شيماء.",
            "🏁 لقد فككت تشفير كافة الأظرفة والأدلة بنجاح! اضغط أدناه لإظهار رمز فتح القفل المادي النهائي."
        ],
        finalCode: "امشي علي الخريطة دي عشان تلاقي المفتاح. \n روح الصالة وادي ظهرك لباب الفارندة وامشي خمس خطوات لحد لما المطبخ يبقي علي يمينك \n , خش شمال وامشي خطوتين وانزل سلمتين واقعد \n , مد ايدك تحت علي اليمين ..."
    },
    red: {
        passwords: ["531", "VITCOR", "6821", "2149", "GHOST_ECHO_5", "VICTORHARTMANN"],
        locations: [
            "🔎 تم استقرار الدائرة الكهربائية! الظرف رقم (2) مخبأ أسفل السجادة .",
            `⚡ تمت استعادة تسلسل الجلسة بنجاح!\n\n🔎 الظرف رقم (3) مخبأ في: ${RED_LEVEL_2_NEXT_LOCATION}`,
            `⚡ تمت معايرة التجربة 13 بنجاح.\n\nتم استعادة الصفحة المفقودة من ملف المريض 404.\n\n🔎 الظرف رقم (4) مخبأ في:\n${RED_LEVEL_3_NEXT_LOCATION}`,
            `🔎 الظرف رقم (5) مخبأ مع:\n\n${RED_LEVEL_4_NEXT_LOCATION}`,
            "🔎 ممتاز! الظرف رقم (6) مخبأ مع عمو احمد   .",
            "🏁 لقد فككت تشفير كافة الأظرفة والأدلة بنجاح! اضغط أدناه لإظهار رمز فتح القفل المادي النهائي."
        ],
        finalCode: "امشي علي الخريطة دي عشان تلاقي المفتاح. \n روح الصالة وادي ظهرك لباب الفارندة وامشي خمس خطوات لحد لما المطبخ يبقي علي يمينك \n , خش شمال وامشي خطوتين وانزل سلمتين واقعد \n , مد ايدك تحت علي اليمين ..."
    }
};



const BRIEFINGS = [
    "الخطوة الأولى: ابحث عن الظرف رقم (1) المادي في الغرفة. قم بفك لغزه الورقي وأدخل الكلمة المفتاحية لبدء الفك الرقمي.",
    "الخطوة الثانية: ابحث عن الظرف رقم (2) في موقعه المذكور. قم بحل اللغز المرفق بالداخل لكسر شيفرة المرحلة أ.",
    "الخطوة الثالثة: توجه نحو الظرف رقم (3). قم بحل اللغز الهندسي/الرياضي المرفق بالداخل لتسجيل رمز المرور.",
    "الخطوة الرابعة: الظرف رقم (4) جاهز للتحليل. استخرج رمز المرور المادي المدون لفتح بروتوكول الأمان.",
    "الخطوة الخامسة: اقتربنا من قلب النظام! الظرف رقم (5) يحوي شفرة وصول حيوية. ابحث عنه وفك لغزه.",
    "الخطوة السادسة والأخيرة: الظرف رقم (6) يحتوي على بروتوكول الإغلاق النهائي. فك اللغز لإنقاذ ملفات القضية."
];

// --- STATE MANAGEMENT ---
let leaderName = localStorage.getItem('escape_leader') || "محقق مجهول";
let selectedTeam = localStorage.getItem('escape_team') || "blue";
let teamMembers = JSON.parse(localStorage.getItem('escape_members') || "[]");
let currentLevel = parseInt(localStorage.getItem('escape_level') || "0");
let startTime = parseInt(localStorage.getItem('escape_start_time') || Date.now());

// Debug: Log retrieved values
console.log('Retrieved from localStorage:');
console.log('Team:', selectedTeam);
console.log('Leader:', leaderName);
console.log('Level:', currentLevel);

// DOM Elements
const root = document.documentElement;
const leaderDisplay = document.getElementById('leaderNameDisplay');
const teamDisplay = document.getElementById('teamDisplay');
const membersContainer = document.getElementById('membersContainer');
const clockDisplay = document.getElementById('countdownTimer');
const envelopeBriefing = document.getElementById('envelopeBriefing');
const digitInputContainer = document.getElementById('digitInputContainer');
const submitStepABtn = document.getElementById('submitStepABtn');
const stepABox = document.getElementById('stepABox');
const stepBBox = document.getElementById('stepBBox');
const successBox = document.getElementById('successBox');
const nextLocationText = document.getElementById('nextLocationText');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const digitalPuzzleArea = document.getElementById('digitalPuzzleArea');
const stepAError = document.getElementById('stepAError');
const failedScreen = document.getElementById('failedScreen');
const victoryScreen = document.getElementById('victoryScreen');
const finalLockCode = document.getElementById('finalLockCode');
const toastContainer = document.getElementById('toastContainer');

// --- WEB AUDIO API ENGINE ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let ambientOsc1, ambientOsc2, ambientGain;
let heartbeatOsc, heartbeatGain;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
        startAmbientDrone();
        startTimerTicking();
    }
}

function startAmbientDrone() {
    try {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        ambientOsc1 = audioCtx.createOscillator();
        ambientOsc2 = audioCtx.createOscillator();
        ambientGain = audioCtx.createGain();

        ambientOsc1.type = 'sine';
        ambientOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // 55Hz (A1)
        
        ambientOsc2.type = 'sine';
        ambientOsc2.frequency.setValueAtTime(55.3, audioCtx.currentTime);

        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.1, audioCtx.currentTime);
        lfoGain.gain.setValueAtTime(0.03, audioCtx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(ambientGain.gain);

        ambientGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

        ambientOsc1.connect(ambientGain);
        ambientOsc2.connect(ambientGain);
        ambientGain.connect(audioCtx.destination);

        lfo.start();
        ambientOsc1.start();
        ambientOsc2.start();
    } catch(e) {
        console.error("Ambient error:", e);
    }
}

function playSynthTone(freq, type, duration, vol) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playTickSound() {
    playSynthTone(1200, 'sine', 0.05, 0.04);
}

function playPulseSound() {
    // Deep warning pulse (heartbeat)
    playSynthTone(60, 'triangle', 0.25, 0.18);
    setTimeout(() => {
        playSynthTone(60, 'triangle', 0.2, 0.15);
    }, 150);
}

function playSuccessChime() {
    playSynthTone(523.25, 'sine', 0.12, 0.08); // C5
    setTimeout(() => playSynthTone(659.25, 'sine', 0.12, 0.08), 100); // E5
    setTimeout(() => playSynthTone(783.99, 'sine', 0.3, 0.08), 200); // G5
}

function playErrorAlarm() {
    playSynthTone(180, 'sawtooth', 0.3, 0.15);
}

// Global user click audio activation
document.addEventListener('click', initAudio, { once: true });


// --- TIMER & GAME TICK ---
let isPanicMode = false;

function startTimerTicking() {
    setInterval(() => {
        const elapsed = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
        const remaining = 5400 - elapsed; // 90 minutes total

        if (remaining <= 0) {
            triggerFailState();
            return;
        }

        // Under 5 minutes: Panic state
        if (remaining <= 300) {
            if (!isPanicMode) {
                isPanicMode = true;
                clockDisplay.classList.add('panic');
                document.body.classList.add('panic-active');
                showToast("تنبيه: قفل النظام وشيك! تسارع طاقة المفاعل المعالج.", "error");
            }
            playPulseSound(); // Spooky heartbeat
        } else {
            playTickSound(); // Classic terminal tick
        }

        const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
        const secs = String(remaining % 60).padStart(2, '0');
        clockDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
}

function triggerFailState() {
    failedScreen.classList.remove('hidden');
    playErrorAlarm();
}

window.restartInvestigation = function() {
    localStorage.clear();
    window.location.href = 'index.html';
};

// --- GLOBAL LOCKOUT & CUSTOM AUDIO PLATFORM ---
let isLockedOut = false;
let lockoutTimer = null;

function triggerGlobalLockout(duration = 10) {
    if (isLockedOut) return;
    isLockedOut = true;

    playErrorAlarm();

    const lockoutScreen = document.getElementById('lockoutScreen');
    const countdownVal = document.getElementById('lockoutCountdown');

    if (lockoutScreen && countdownVal) {
        lockoutScreen.classList.remove('hidden');
        countdownVal.textContent = duration;

        let remaining = duration;
        
        // Remove focus from any inputs
        if (document.activeElement) document.activeElement.blur();

        lockoutTimer = setInterval(() => {
            remaining--;
            countdownVal.textContent = remaining;

            // Tick beep sound
            playSynthTone(150, 'sawtooth', 0.1, 0.05);

            if (remaining <= 0) {
                clearInterval(lockoutTimer);
                lockoutScreen.classList.add('hidden');
                isLockedOut = false;
            }
        }, 1000);
    } else {
        isLockedOut = false;
    }
}

let currentPlayingAudio = null;
function playCustomAudio(url) {
    try {
        if (currentPlayingAudio) {
            currentPlayingAudio.pause();
            currentPlayingAudio.currentTime = 0;
        }
        currentPlayingAudio = new Audio(url);
        currentPlayingAudio.play().catch(err => {
            console.warn("Audio file playback blocked or not found:", err);
        });
    } catch (e) {
        console.error("Audio error:", e);
    }
}

// --- Hospital Terminal Transition (Red Team Level 4) ---
function runRedLevel4Transition(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'hospital-terminal-overlay';
    overlay.innerHTML = `
        <div class="terminal-scanlines"></div>
        <div class="terminal-text-container">
            <p class="terminal-line" id="t-line1"></p>
            <p class="terminal-line" id="t-line2"></p>
            <p class="terminal-line" id="t-line3"></p>
            <p class="terminal-line" id="t-line4"></p>
        </div>
    `;
    document.body.appendChild(overlay);

    playSynthTone(100, 'sawtooth', 1.8, 0.12);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function typeText(element, text, speed) {
        return new Promise(resolve => {
            let i = 0;
            element.textContent = '';
            const interval = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }

    async function animate() {
        const line1 = document.getElementById('t-line1');
        const line2 = document.getElementById('t-line2');
        const line3 = document.getElementById('t-line3');
        const line4 = document.getElementById('t-line4');

        line1.classList.add('active');
        await typeText(line1, "PATIENT 404", 40);
        line1.classList.remove('active');
        await delay(300);

        line2.classList.add('active');
        await typeText(line2, "TIME OF DEATH CONFIRMED", 35);
        line2.classList.remove('active');
        await delay(300);

        line3.classList.add('active');
        await typeText(line3, "21:49", 60);
        line3.classList.remove('active');
        await delay(300);

        line4.classList.add('active');
        await typeText(line4, "ROOM 13 ACCESSING...", 35);
        await delay(800);

        overlay.classList.add('fade-out');
        await delay(600);
        overlay.remove();
        callback();
    }

    animate();
}

// --- Forensics Terminal Transition (Blue Team Level 4) ---
function runBlueLevel4Transition(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'forensics-terminal-overlay';
    overlay.innerHTML = `
        <div class="terminal-scanlines"></div>
        <div class="terminal-text-container">
            <p class="terminal-line" id="b-line1"></p>
            <p class="terminal-line" id="b-line2"></p>
            <p class="terminal-line" id="b-line3"></p>
        </div>
    `;
    document.body.appendChild(overlay);

    playSynthTone(150, 'square', 1.5, 0.1);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function typeText(element, text, speed) {
        return new Promise(resolve => {
            let i = 0;
            element.textContent = '';
            const interval = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }

    async function animate() {
        const line1 = document.getElementById('b-line1');
        const line2 = document.getElementById('b-line2');
        const line3 = document.getElementById('b-line3');

        line1.classList.add('active');
        await typeText(line1, "EVIDENCE PHOTO", 40);
        line1.classList.remove('active');
        await delay(400);

        line2.classList.add('active');
        await typeText(line2, "INTEGRITY CHECK", 40);
        line2.classList.remove('active');
        await delay(400);

        line3.classList.add('active');
        await typeText(line3, "ORIGINALITY: QUESTIONABLE", 50);
        await delay(1000);

        overlay.classList.add('fade-out');
        await delay(600);
        overlay.remove();
        callback();
    }

    animate();
}

// --- INITIALIZATION ---
function initDashboard() {
    // 1. Display state
    leaderDisplay.textContent = leaderName;
    teamDisplay.textContent = selectedTeam === 'blue' ? "الفريق الأزرق" : "الفريق الأحمر";
    
    // Set theme custom variable - IMMEDIATELY apply colors
    const themeColor = selectedTeam === 'blue' ? '#00f3ff' : '#ff3344';
    const borderColor = selectedTeam === 'blue' ? 'rgba(0, 243, 255, 0.25)' : 'rgba(255, 51, 68, 0.25)';
    
    console.log('Applying theme colors:', { team: selectedTeam, color: themeColor });
    
    root.style.setProperty('--neon-main', themeColor);
    root.style.setProperty('--panel-border', borderColor);

    // Apply team-specific body classes
    document.body.classList.remove('blue-team', 'red-team');
    document.body.classList.add(selectedTeam + '-team');

    // Populate team members
    membersContainer.innerHTML = '';
    if (teamMembers.length === 0) {
        membersContainer.innerHTML = `<span class="meta-value">لا يوجد محققين مساعدين</span>`;
    } else {
        teamMembers.forEach(member => {
            const badge = document.createElement('span');
            badge.className = 'member-badge';
            badge.textContent = member;
            membersContainer.appendChild(badge);
        });
    }

    // Set level progress
    updateProgressionNodes();
    
    // Load current level state
    loadLevel(currentLevel);
}

function updateProgressionNodes() {
    const nodes = document.querySelectorAll('.envelope-nodes .node');
    const lines = document.querySelectorAll('.envelope-nodes .node-line');

    nodes.forEach((node, idx) => {
        node.className = 'node';
        if (idx < currentLevel) {
            node.classList.add('solved');
            node.querySelector('.node-status').textContent = 'DONE';
        } else if (idx === currentLevel) {
            node.classList.add('active');
            node.querySelector('.node-status').textContent = 'ACTIVE';
        } else {
            node.querySelector('.node-status').textContent = 'LOCKED';
        }
    });

    lines.forEach((line, idx) => {
        line.className = 'node-line';
        if (idx < currentLevel) {
            line.classList.add('solved');
        }
    });
}

function updateStepProgressUI() {
    const progressUI = document.getElementById('stepProgressUI');
    if (!progressUI) return;

    if ((currentLevel === 1 || currentLevel === 2 || currentLevel === 3) && selectedTeam === 'blue') {
        progressUI.classList.remove('hidden');
        
        const stepAHidden = stepABox.classList.contains('hidden');
        const successShown = !successBox.classList.contains('hidden');
        const displayLevelNum = currentLevel + 1;

        if (successShown) {
            progressUI.innerHTML = `
                <div class="step-indicator completed">STEP A <span class="status-icon">✓</span></div>
                <div class="step-progress-divider">/</div>
                <div class="step-indicator completed">STEP B <span class="status-icon">✓</span></div>
                <div class="step-progress-divider">|</div>
                <div class="step-indicator completed" style="font-weight: bold; color: var(--terminal-green);">LEVEL ${displayLevelNum} COMPLETE</div>
            `;
        } else if (stepAHidden) {
            progressUI.innerHTML = `
                <div class="step-indicator completed">STEP A <span class="status-icon">✓</span></div>
                <div class="step-progress-divider">/</div>
                <div class="step-indicator active">STEP B <span class="status-icon">○</span></div>
            `;
        } else {
            progressUI.innerHTML = `
                <div class="step-indicator active">STEP A <span class="status-icon">○</span></div>
                <div class="step-progress-divider">/</div>
                <div class="step-indicator">STEP B <span class="status-icon">🔒</span></div>
            `;
        }
    } else {
        progressUI.classList.add('hidden');
    }
}

function loadLevel(level) {
    if (level >= 6) {
        triggerVictoryState();
        return;
    }

    // Update Briefing Text - customized for Blue Team Level 3, Blue Team Level 4, Red Team Level 4, Level 5 & Level 6
    if (selectedTeam === 'blue' && level === 2) {
        envelopeBriefing.textContent = "الخطوة الثالثة: توجه نحو الظرف رقم (3). قم بتحليل سجلات الأدلة الأربعة في منزل القاتل واستخرج رمز المرور لتفعيل التحليل الجنائي.";
    } else if (selectedTeam === 'blue' && level === 3) {
        envelopeBriefing.textContent = "الخطوة الرابعة: ابحث عن الظرف رقم (4) المادي. افحص صورة مسرح الجريمة واستنتج وقت التقاطها المكتوب لكسر التشفير.";
    } else if (selectedTeam === 'red' && level === 3) {
        envelopeBriefing.textContent = "الخطوة الرابعة: قم بتحليل ملف الجناح 13 الخاص بالمريض 404 واستنتج وقت الوفاة لفتح البوابة الرقمية.";
    } else if (level === 4) {
        envelopeBriefing.innerHTML = `<span style="color: var(--neon-red); font-weight: bold; font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">⚠ أنت الآن تدخل أصعب مرحلة في التحقيق.</span>الخطوة الخامسة: ابحث عن الملف الأسود المادي. تتبع السجلات والبطاقات لربط الأدلة وفك تشفير السلسلة.`;
    } else if (level === 5) {
        if (selectedTeam === 'blue') {
            envelopeBriefing.innerHTML = `<span style="color: var(--neon-main); font-weight: bold; font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">🏁 المواجهة النهائية: كشف القاتل المتسلسل</span>استخدم كافة الأدلة الجنائية، البصمات، وسجلات الاتصالات لتحديد هوية الجاني وإغلاق القضية.`;
        } else {
            envelopeBriefing.innerHTML = `<span style="color: var(--neon-main); font-weight: bold; font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">🏁 كشف الحقيقة: سرقة جثة المريض 404</span>حدد الشخص المسؤول عن نقل الجثة والمسار السري والقرائن الجنائية لإغلاق تحقيق الجناح 13.`;
        }
    } else {
        envelopeBriefing.textContent = BRIEFINGS[level];
    }

    stepAError.textContent = '';
    stepABox.classList.remove('hidden');
    stepBBox.classList.add('hidden');
    successBox.classList.add('hidden');

    // Reset Step B Title & Instruction defaults
    const stepBBadge = document.querySelector('#stepBBox .step-badge');
    const stepBInstruction = document.getElementById('stepBInstruction');
    if (selectedTeam === 'blue' && level === 2) {
        if (stepBBadge) stepBBadge.textContent = "STEP B — تحليل الضحية التالية";
        if (stepBInstruction) {
            stepBInstruction.innerHTML = `
                <div style="font-size: 1.15rem; font-weight: bold; color: var(--terminal-green); margin-bottom: 0.5rem;">✓ تم تحليل نمط الأدلة بنجاح.</div>
                <div style="color: var(--text-muted); margin-bottom: 0.4rem;">لقد عرفت كيف يقرأ القاتل الأدلة. الآن حاول أن تعرف أين سيترك دليله التالي.</div>
            `;
        }
    } else if (selectedTeam === 'blue' && level === 3) {
        if (stepBBadge) stepBBadge.textContent = "PHOTO FORENSICS";
        if (stepBInstruction) {
            stepBInstruction.innerHTML = `
                <div style="font-size: 1.15rem; font-weight: bold; color: var(--terminal-green); margin-bottom: 0.5rem;">✓ TIMESTAMP VERIFIED</div>
                <div style="color: var(--text-muted); margin-bottom: 0.4rem;">تفحص الصورة الرقمية بدقة. اضغط على أجزاء الصورة للتحقق الجنائي والعثور على أي شذوذ في الأدلة.</div>
            `;
        }
    } else if (selectedTeam === 'red' && level === 3) {
        if (stepBBadge) stepBBadge.textContent = "THE ROOM THAT DOES NOT EXIST";
        if (stepBInstruction) {
            stepBInstruction.innerHTML = `
                <div style="font-size: 1.15rem; font-weight: bold; color: #ff3344; margin-bottom: 0.5rem;">الخريطة الرسمية تحتوي على 12 غرفة.</div>
                <div style="color: var(--text-muted); margin-bottom: 0.4rem;">لكن تقرير الصيانة يتحدث عن باب رابع عشر...</div>
                <div style="color: #fff; font-weight: bold;">أي باب لا ينتمي إلى أي غرفة؟</div>
            `;
        }
    } else if (level === 4) {
        if (stepBBadge) stepBBadge.textContent = "الملف الأسود — THE BLACK FILE";
        if (stepBInstruction) {
            stepBInstruction.innerHTML = `
                <div style="font-size: 1.15rem; font-weight: bold; color: var(--terminal-green); margin-bottom: 0.5rem;">✓ تم إثبات صحة السلسلة الجنائية.</div>
                <div style="color: var(--text-muted); margin-bottom: 0.4rem;">لوحة التحقيق الجنائية نشطة الآن. قم بتنظيم الأدلة وتأكيد العلاقات لتجاوز النظام.</div>
            `;
        }
    } else if (level === 5) {
        if (selectedTeam === 'blue') {
            if (stepBBadge) stepBBadge.textContent = "FINAL ACCUSATION — الاتهام النهائي";
            if (stepBInstruction) {
                stepBInstruction.innerHTML = `
                    <div style="font-size: 1.15rem; font-weight: bold; color: var(--terminal-green); margin-bottom: 0.5rem;">✓ تم إثبات الهوية وتأكيد الاشتباه.</div>
                    <div style="color: var(--text-muted); margin-bottom: 0.4rem;">قم بتقديم اللائحة الجنائية النهائية لتأكيد التهمة وإغلاق القضية.</div>
                `;
            }
        } else {
            if (stepBBadge) stepBBadge.textContent = "CASE CLOSURE — إغلاق التحقيق";
            if (stepBInstruction) {
                stepBInstruction.innerHTML = `
                    <div style="font-size: 1.15rem; font-weight: bold; color: var(--neon-main); margin-bottom: 0.5rem;">✓ تم التحقق من هوية المنفذ.</div>
                    <div style="color: var(--text-muted); margin-bottom: 0.4rem;">قم بإعادة بناء مسار الجثة وتحديد الوجهة النهائية لإنهاء القضية.</div>
                `;
            }
        }
    } else {
        if (stepBBadge) stepBBadge.textContent = "المرحلة ب: التجاوز الرقمي للنظام";
        if (stepBInstruction) stepBInstruction.textContent = "الرمز المادي صحيح! قم بحل اللغز التفاعلي التالي لفتح ملفات الظرف:";
    }

    // Render input based on level/team
    const correctPass = ENVELOPE_DATA[selectedTeam].passwords[level];
    
    const instructionEl = document.querySelector('#stepABox .puzzle-instruction');
    if (selectedTeam === 'blue' && level === 1) {
        if (instructionEl) {
            instructionEl.textContent = "أدخل اسم المشتبه به الذي تطابقت بصمته مع مسرح الجريمة.";
        }
        renderWordInput();
        const input = document.getElementById('stepAWordInput');
        if (input) {
            input.placeholder = "اسم المشتبه به...";
        }
    } else if (selectedTeam === 'red' && level === 1) {
        if (instructionEl) {
            instructionEl.textContent = "أدخل اسم الطبيب الذي قمت باستخراجه من شريط التخطيط الكهربائي وجدول الرموز:";
        }
        renderWordInput();
        const input = document.getElementById('stepAWordInput');
        if (input) {
            input.placeholder = "اسم الطبيب...";
        }
    } else if (level === 5) {
        if (selectedTeam === 'blue') {
            if (instructionEl) {
                instructionEl.textContent = "أدخل الاسم الكامل للقاتل المتسلسل (بالإنجليزية) لتأكيد هويته في النظام:";
            }
            renderWordInput();
            const input = document.getElementById('stepAWordInput');
            if (input) {
                input.placeholder = "";
            }
        } else {
            if (instructionEl) {
                instructionEl.textContent = "أدخل الاسم الكامل للطبيب المسؤول عن نقل الجثة (بالإنجليزية) لفتح بروتوكول الإغلاق:";
            }
            renderWordInput();
            const input = document.getElementById('stepAWordInput');
            if (input) {
                input.placeholder = "";
            }
        }
    } else {
        if (instructionEl) {
            instructionEl.textContent = "قم بحل اللغز الموجود داخل الظرف الورقي الفعلي في الغرفة، ثم أدخل رمز المرور هنا:";
        }
        renderDigitInputs(correctPass.length);
    }

    // Update Step Progress UI
    updateStepProgressUI();

    // Build the dynamic digital puzzle for Step B
    buildDigitalPuzzle(level);
}

// --- Dynamic Toast Notification ---
function showToast(message, type = 'error') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'error' ? '⚠️' : '✓';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    if (type === 'error') playErrorAlarm();
    else playSuccessChime();

    setTimeout(() => {
        toast.remove();
    }, 2800);
}

// --- Helper to get concatenated digit value ---
function getStepAValue() {
    const wordInput = document.getElementById('stepAWordInput');
    if (wordInput) {
        return wordInput.value.trim().toUpperCase();
    }

    const inputs = digitInputContainer.querySelectorAll('.digit-input');
    let value = '';
    inputs.forEach(input => {
        value += input.value.trim();
    });
    return value.toUpperCase();
}

function renderWordInput() {
    digitInputContainer.innerHTML = `
        <div class="input-container" style="width: 100%; max-width: 300px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin: 0 auto;">
            <span class="input-bracket" style="font-size: 2.2rem; color: var(--neon-main); font-family: monospace; font-weight: 300; user-select: none;">[</span>
            <input type="text" id="stepAWordInput" class="terminal-input" placeholder="أدخل كلمة المرور..." autocomplete="off" style="text-align: center; text-transform: uppercase; background: rgba(0, 0, 0, 0.5); border: none; outline: none; color: #fff; font-size: 1.1rem; padding: 0.5rem 1rem; caret-color: var(--neon-main); width: 100%;">
            <span class="input-bracket" style="font-size: 2.2rem; color: var(--neon-main); font-family: monospace; font-weight: 300; user-select: none;">]</span>
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('stepAWordInput');
        if (input) {
            input.focus();
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitStepABtn.click();
                }
            });
        }
    }, 100);
}

// --- Dynamic Digit Inputs Renderer ---
function renderDigitInputs(length) {
    digitInputContainer.innerHTML = '';
    const isLevel5 = (currentLevel === 4);
    const regexChar = isLevel5 ? /^[a-zA-Z0-9_]$/ : /^[0-9]$/;
    const regexPaste = isLevel5 ? /^[a-zA-Z0-9_]+$/ : /^[0-9]+$/;

    for (let i = 0; i < length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.inputMode = isLevel5 ? 'text' : 'numeric';
        input.maxLength = 1;
        input.className = 'digit-input';
        if (isLevel5) {
            input.style.textTransform = 'uppercase';
        }
        input.dataset.index = i;

        input.addEventListener('input', (e) => {
            let val = e.target.value;
            if (isLevel5) {
                val = val.toUpperCase();
                e.target.value = val;
            }
            if (!regexChar.test(val)) {
                e.target.value = '';
                return;
            }
            playTickSound();
            const next = digitInputContainer.querySelector(`.digit-input[data-index="${i + 1}"]`);
            if (next) {
                next.focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                if (e.target.value === '') {
                    const prev = digitInputContainer.querySelector(`.digit-input[data-index="${i - 1}"]`);
                    if (prev) {
                        prev.focus();
                        prev.value = '';
                        e.preventDefault();
                    }
                } else {
                    e.target.value = '';
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                submitStepABtn.click();
            }
        });

        // Add paste handler to support pasting complete password
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            let pastedData = (e.clipboardData || window.clipboardData).getData('text').trim();
            if (isLevel5) {
                pastedData = pastedData.toUpperCase();
            }
            // Reject if doesn't match regex
            if (!regexPaste.test(pastedData)) {
                return;
            }
            const digits = pastedData.split('');
            const inputs = digitInputContainer.querySelectorAll('.digit-input');
            const startIndex = parseInt(input.dataset.index);

            digits.forEach((digit, idx) => {
                const targetInput = inputs[startIndex + idx];
                if (targetInput) {
                    targetInput.value = digit;
                }
            });

            // Focus target element (last pasted input or the next empty one)
            const nextFocusIndex = Math.min(startIndex + digits.length, inputs.length - 1);
            if (inputs[nextFocusIndex]) {
                inputs[nextFocusIndex].focus();
            }
            playTickSound();
        });

        digitInputContainer.appendChild(input);
    }
    // Auto focus the first box
    setTimeout(() => {
        const firstInput = digitInputContainer.querySelector('.digit-input[data-index="0"]');
        if (firstInput) firstInput.focus();
    }, 100);
}

// --- STEP A: Physical Password Verification ---
submitStepABtn.addEventListener('click', () => {
    if (isLockedOut) return;

    const userInput = getStepAValue();
    const correctPass = ENVELOPE_DATA[selectedTeam].passwords[currentLevel];

    let isCorrect = (userInput === correctPass);
    if (selectedTeam === 'red' && currentLevel === 0 && (userInput === '531' || userInput === '513')) {
        isCorrect = true;
    }
    if (selectedTeam === 'red' && currentLevel === 1) {
        const normalizedInput = userInput.toUpperCase().replace(/\s+/g, '');
        const acceptedAnswers = ['VITKOR', 'فيتكور'];
        if (acceptedAnswers.includes(normalizedInput)) {
            isCorrect = true;
        }
    }
    if (selectedTeam === 'blue' && currentLevel === 1) {
        const normalizedInput = userInput.toLowerCase().replace(/\s+/g, '');
        const acceptedAnswers = ['danielroth', 'دانيالروث'];
        isCorrect = acceptedAnswers.includes(normalizedInput);
    }
    if (currentLevel === 5) {
        const cleanInput = userInput.toUpperCase().replace(/[^A-Z\u0621-\u064A]/g, '');
        if (selectedTeam === 'blue') {
            const accepted = ['DANIELROTH', 'دانيالروث', 'دانييلروث'];
            isCorrect = accepted.includes(cleanInput);
        } else if (selectedTeam === 'red') {
            const accepted = [
                'VICTORHARTMANN', 'DRVICTORHARTMANN', 'DOCTORVICTORHARTMANN',
                'فيكتورهارتمن', 'دكتورفيكتورهارتمن', 'فيكتورهارتمان', 'دكتورفيكتورهارتمان'
            ];
            isCorrect = accepted.includes(cleanInput);
        }
    }

    if (isCorrect) {
        if (selectedTeam === 'blue' && currentLevel === 3) {
            // Trigger transition before showing stepB
            runBlueLevel4Transition(() => {
                stepABox.classList.add('hidden');
                stepBBox.classList.remove('hidden');
                updateStepProgressUI();
            });
            showToast("✓ TIMESTAMP VERIFIED", "success");
        } else if (selectedTeam === 'red' && currentLevel === 3) {
            // Trigger transition before showing stepB
            runRedLevel4Transition(() => {
                stepABox.classList.add('hidden');
                stepBBox.classList.remove('hidden');
                updateStepProgressUI();
            });
            showToast("ACCESS GRANTED", "success");
        } else {
            playSuccessChime();
            stepABox.classList.add('hidden');
            stepBBox.classList.remove('hidden');
            
            // Focus or activate the digital puzzle
            let successMsg = "نجاح: تم التحقق من الرمز المادي للظرف. بروتوكول الأمان الرقمي قيد التجهيز...";
            if (selectedTeam === 'blue' && currentLevel === 1) {
                successMsg = "✓ تم تحديد صاحب البصمة.";
            } else if (selectedTeam === 'blue' && currentLevel === 2) {
                successMsg = "✓ تم تحليل نمط الأدلة بنجاح.";
            } else if (currentLevel === 4) {
                successMsg = "✓ تم التحقق من رمز الملف الأسود. تفعيل لوحة التحقيق الجنائي...";
            } else if (currentLevel === 5) {
                successMsg = selectedTeam === 'blue' ? "✓ تم كشف هوية القاتل. فتح لوحة الاتهام..." : "✓ تم التحقق من الهوية. فتح لوحة تتبع الجثة...";
            }
            showToast(successMsg, "success");
            
            updateStepProgressUI();
        }
    } else {
        playErrorAlarm();
        if (selectedTeam === 'blue' && currentLevel === 2) {
            stepAError.textContent = "⚠ رمز القضية غير صحيح.";
            showToast("⚠ رمز القضية غير صحيح.", "error");
        } else if (selectedTeam === 'blue' && currentLevel === 3) {
            stepAError.textContent = "⚠ التوقيت غير صحيح.";
            showToast("⚠ التوقيت غير صحيح.", "error");
        } else if (selectedTeam === 'red' && currentLevel === 3) {
            stepAError.textContent = "⚠ الوقت غير صحيح.";
            showToast("⚠ الوقت غير صحيح.", "error");
        } else if (currentLevel === 4) {
            stepAError.textContent = "⚠ رمز الملف الأسود غير صحيح.";
            showToast("⚠ رمز الملف الأسود غير صحيح.", "error");
        } else if (currentLevel === 5) {
            stepAError.textContent = selectedTeam === 'blue' ? "⚠ هوية القاتل غير صحيحة." : "⚠ الهوية غير صحيحة.";
            showToast(selectedTeam === 'blue' ? "⚠ هوية القاتل غير صحيحة." : "⚠ الهوية غير صحيحة.", "error");
        } else {
            stepAError.textContent = "رمز فك التشفير غير صالح. حاول مرة أخرى للتطابق مع قاعدة البيانات.";
            showToast("خطأ: تطابق الرمز المادي فشل! حظر لوحة التحكم مؤقتاً.", "error");
        }
        
        // Clear digits/inputs and focus first
        const wordInput = document.getElementById('stepAWordInput');
        if (wordInput) {
            wordInput.value = '';
            wordInput.focus();
        } else {
            const inputs = digitInputContainer.querySelectorAll('.digit-input');
            inputs.forEach(input => input.value = '');
            const firstInput = digitInputContainer.querySelector('.digit-input[data-index="0"]');
            if (firstInput) firstInput.focus();
        }

        // Lockout for 10 seconds
        triggerGlobalLockout(10);
    }
});


// --- DIGITAL PUZZLES ENGINE (STEP B) ---
function buildDigitalPuzzle(level) {
    digitalPuzzleArea.innerHTML = '';
    
    switch(level) {
        case 0:
            initLevel1Puzzle();
            break;
        case 1:
            if (selectedTeam === 'red') {
                initRedLevel2MemoryGame();
            } else if (selectedTeam === 'blue') {
                initBlueLevel2TimelineGame();
            } else {
                initCircuitBalancingGame();
            }
            break;
        case 2:
            if (selectedTeam === 'blue') {
                initBlueLevel3SerialPatternGame();
            } else {
                initFrequencyTuningGame();
            }
            break;
        case 3:
            if (selectedTeam === 'red') {
                initRedLevel4BlueprintGame();
            } else if (selectedTeam === 'blue') {
                initBlueLevel4PhotoForensicsGame();
            } else {
                initSequenceMatchingGame();
            }
            break;
        case 4:
            initLevel5BlackFileBoard();
            break;
        case 5:
            initLevel6FinalInvestigationBoard();
            break;
    }
}

// Dynamic completion hook for digital puzzles
function solveStepB() {
    playSuccessChime();
    stepBBox.classList.add('hidden');
    successBox.classList.remove('hidden');

    // Reveal next location
    const nextLoc = ENVELOPE_DATA[selectedTeam].locations[currentLevel];
    if (nextLoc.includes('\n')) {
        nextLocationText.innerHTML = nextLoc.replace(/\n/g, '<br>');
    } else {
        nextLocationText.textContent = nextLoc;
    }
    
    showToast("نجاح: تم تجاوز الحماية الرقمية! موقع التوثيق التالي متاح الآن.", "success");
    
    // Update Step Progress UI
    updateStepProgressUI();
}

nextLevelBtn.addEventListener('click', () => {
    currentLevel++;
    localStorage.setItem('escape_level', currentLevel.toString());
    updateProgressionNodes();
    loadLevel(currentLevel);
});


/* ==========================================================================
   LEVEL 1: Customized Double Puzzle Logic
   ========================================================================== */
function initLevel1Puzzle() {
    if (selectedTeam === 'blue') {
        initBlueLevel1();
    } else {
        initRedLevel1();
    }
}

function initBlueLevel1() {
    document.getElementById('stepBInstruction').textContent = "الرمز صحيح! استمع للبصمات الصوتية، حدد العينة المطابقة للبصمة المستهدفة، ثم اضغط على زر التأكيد:";

    digitalPuzzleArea.innerHTML = `
        <div class="voiceprint-container">
            <div class="target-audio-box">
                <button type="button" class="audio-play-btn target-btn" id="playTargetBtn">
                    <span class="audio-icon">🔊</span> تشغيل البصمة الصوتية المستهدفة
                </button>
            </div>
            
            <div class="spectrum-display">
                <div class="spectrum-bar" style="animation-delay: 0.1s;"></div>
                <div class="spectrum-bar" style="animation-delay: 0.3s;"></div>
                <div class="spectrum-bar" style="animation-delay: 0.5s;"></div>
                <div class="spectrum-bar" style="animation-delay: 0.2s;"></div>
                <div class="spectrum-bar" style="animation-delay: 0.4s;"></div>
                <div class="spectrum-bar" style="animation-delay: 0.7s;"></div>
                <div class="spectrum-bar" style="animation-delay: 0.6s;"></div>
                <div class="spectrum-bar" style="animation-delay: 0.25s;"></div>
            </div>
            
            <div class="voice-sample-list">
                <div class="voice-sample-row">
                    <button type="button" class="sample-play-icon" data-audio="/part2/assets/Ashraf-l1-step2-blue.mp3">▶ استماع</button>
                    <button type="button" class="voice-btn" data-wave="1">عينة الصوت 1</button>
                </div>
                <div class="voice-sample-row">
                    <button type="button" class="sample-play-icon" data-audio="/part2/assets/Karim-l1-step2-blue.mp3">▶ استماع</button>
                    <button type="button" class="voice-btn" data-wave="2">عينة الصوت 2</button>
                </div>
                <div class="voice-sample-row">
                    <button type="button" class="sample-play-icon" data-audio="/part2/assets/Ahmed-l1-step2-blue.mp3">▶ استماع</button>
                    <button type="button" class="voice-btn" data-wave="3">عينة الصوت 3</button>
                </div>
                <div class="voice-sample-row">
                    <button type="button" class="sample-play-icon" data-audio="/part2/assets/Hazem-l1-step2-blue.mp3">▶ استماع</button>
                    <button type="button" class="voice-btn" data-wave="4">عينة الصوت 4</button>
                </div>
            </div>
            
            <button type="button" class="terminal-btn submit-btn" id="confirmAudioBtn" style="margin-top: 1.5rem; width: 100%;">تأكيد ومطابقة البصمة الصوتية</button>
        </div>
    `;

    let selectedWave = null;

    const playTargetBtn = document.getElementById('playTargetBtn');
    playTargetBtn.addEventListener('click', () => {
        if (isLockedOut) return;
        playCustomAudio('/part2/assets/Ahmed-l1-step2-blue.mp3');
    });

    const playIcons = digitalPuzzleArea.querySelectorAll('.sample-play-icon');
    playIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isLockedOut) return;
            const audioUrl = icon.getAttribute('data-audio');
            playCustomAudio(audioUrl);
        });
    });

    const btns = digitalPuzzleArea.querySelectorAll('.voice-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isLockedOut) return;
            playSynthTone(600, 'sine', 0.05, 0.05);
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedWave = btn.getAttribute('data-wave');
        });
    });

    const confirmBtn = document.getElementById('confirmAudioBtn');
    confirmBtn.addEventListener('click', () => {
        if (isLockedOut) return;

        if (!selectedWave) {
            showToast("تنبيه: يرجى اختيار عينة صوت أولاً للمطابقة.", "error");
            return;
        }

        if (selectedWave === "3") {
            playSynthTone(500, 'sine', 0.2, 0.1);
            setTimeout(() => playSynthTone(750, 'sine', 0.3, 0.1), 150);
            showToast("تطابق البصمة الصوتية بنسبة 99.8%! تم التأكيد.", "success");
            setTimeout(solveStepB, 1500);
        } else {
            playSynthTone(120, 'sawtooth', 0.4, 0.15);
            showToast("فشل المطابقة: تردد غير متوافق. تم حظر لوحة التحكم.", "error");
            triggerGlobalLockout(10);
        }
    });
}

function initRedLevel1() {
    document.getElementById('stepBInstruction').textContent = "الرمز صحيح! قم بمعايرة مرحل الدائرة الكهربائية بتوصيل السلك الأزرق بالمنفذ المستهدف:";

    digitalPuzzleArea.innerHTML = `
        <div class="circuit-relay-container">
            <div class="relay-board">
                <div class="relay-wires-column" style="display: flex; flex-direction: column; gap: 0.6rem;">
                    <div class="relay-wire" data-color="red" style="display: flex; align-items: center; gap: 0.6rem;">
                        <span style="font-size: 0.75rem; width: 60px;">سلك أحمر</span>
                        <div class="wire-connector connector-red"></div>
                    </div>
                    <div class="relay-wire" data-color="blue" style="display: flex; align-items: center; gap: 0.6rem;">
                        <span style="font-size: 0.75rem; width: 60px;">سلك أزرق</span>
                        <div class="wire-connector connector-blue"></div>
                    </div>
                    <div class="relay-wire" data-color="yellow" style="display: flex; align-items: center; gap: 0.6rem;">
                        <span style="font-size: 0.75rem; width: 60px;">سلك أصفر</span>
                        <div class="wire-connector connector-yellow"></div>
                    </div>
                    <div class="relay-wire" data-color="green" style="display: flex; align-items: center; gap: 0.6rem;">
                        <span style="font-size: 0.75rem; width: 60px;">سلك أخضر</span>
                        <div class="wire-connector connector-green"></div>
                    </div>
                </div>

                <div class="slot-container">
                    <div class="voltage-slot" data-slot="aux">منفذ فرعي</div>
                    <div class="voltage-slot" data-slot="target" style="border-color: #00f3ff; color: #00f3ff; text-shadow: 0 0 5px rgba(0,243,255,0.5);">المنفذ الرئيسي ⚡</div>
                    <div class="voltage-slot" data-slot="ground">الأرضي</div>
                </div>
            </div>
        </div>
    `;

    const wires = digitalPuzzleArea.querySelectorAll('.relay-wire');
    const slots = digitalPuzzleArea.querySelectorAll('.voltage-slot');
    let selectedWire = null;

    wires.forEach(wire => {
        wire.addEventListener('click', () => {
            if (isLockedOut) return;
            playSynthTone(600, 'sine', 0.05, 0.05);
            wires.forEach(w => w.classList.remove('selected'));
            wire.classList.add('selected');
            selectedWire = wire.getAttribute('data-color');
        });
    });

    slots.forEach(slot => {
        slot.addEventListener('click', () => {
            if (isLockedOut) return;
            if (!selectedWire) {
                showToast("تنبيه: اختر سلكاً أولاً لتوصيله.", "error");
                return;
            }

            const slotName = slot.getAttribute('data-slot');
            playSynthTone(400, 'triangle', 0.1, 0.1);

            slot.textContent = `متصل (${selectedWire === 'red' ? 'أحمر' : selectedWire === 'blue' ? 'أزرق' : selectedWire === 'yellow' ? 'أصفر' : 'أخضر'})`;
            slot.classList.add('occupied');
            
            const wireEl = digitalPuzzleArea.querySelector(`.relay-wire[data-color="${selectedWire}"]`);
            if (wireEl) wireEl.style.opacity = '0.3';

            if (selectedWire === 'blue' && slotName === 'target') {
                showToast("نجاح: تم توصيل مرحل الدائرة الرئيسية واستعادة الطاقة!", "success");
                setTimeout(solveStepB, 1500);
            } else {
                showToast("تنبيه: الجهد الكهربي غير صحيح. تم حظر لوحة التحكم.", "error");
                triggerGlobalLockout(10);
                setTimeout(() => {
                    slot.textContent = slotName === 'target' ? 'المنفذ الرئيسي ⚡' : slotName === 'aux' ? 'منفذ فرعي' : 'الأرضي';
                    slot.classList.remove('occupied');
                    if (wireEl) wireEl.style.opacity = '1';
                    wires.forEach(w => w.classList.remove('selected'));
                    selectedWire = null;
                }, 1000);
            }
        });
    });
}

/* ==========================================================================
   MINI-GAME 1: Wire Cutting Challenge
   ========================================================================== */
function initWireCuttingGame() {
    const orderText = selectedTeam === 'blue' 
        ? "الأزرق 🟦 ثم الأصفر 🟨 ثم الأخضر 🟩 ثم الأحمر 🟥" 
        : "الأحمر 🟥 ثم الأخضر 🟩 ثم الأصفر 🟨 ثم الأزرق 🟦";
        
    document.getElementById('stepBInstruction').textContent = `الرمز صحيح! تجاوز الحماية بقطع الأسلاك بالترتيب التالي: ${orderText}`;

    digitalPuzzleArea.innerHTML = `
        <div class="wires-game">
            <div class="wire-wrapper" data-color="blue">
                <span class="wire-label">CYAN</span>
                <div class="wire-visual color-blue"></div>
            </div>
            <div class="wire-wrapper" data-color="yellow">
                <span class="wire-label">YELLOW</span>
                <div class="wire-visual color-yellow"></div>
            </div>
            <div class="wire-wrapper" data-color="green">
                <span class="wire-label">GREEN</span>
                <div class="wire-visual color-green"></div>
            </div>
            <div class="wire-wrapper" data-color="red">
                <span class="wire-label">RED</span>
                <div class="wire-visual color-red"></div>
            </div>
        </div>
    `;

    const wires = digitalPuzzleArea.querySelectorAll('.wire-wrapper');
    const correctOrder = selectedTeam === 'blue' 
        ? ["blue", "yellow", "green", "red"] 
        : ["red", "green", "yellow", "blue"];
        
    let currentInputSequence = [];

    wires.forEach(wire => {
        wire.addEventListener('click', () => {
            if (isLockedOut) return;
            const color = wire.getAttribute('data-color');
            const visual = wire.querySelector('.wire-visual');

            // Skip if already cut
            if (visual.classList.contains('cut')) return;

            playSynthTone(500, 'sine', 0.1, 0.1);
            visual.classList.add('cut');
            currentInputSequence.push(color);

            // Check correctness
            const stepIndex = currentInputSequence.length - 1;
            if (currentInputSequence[stepIndex] !== correctOrder[stepIndex]) {
                // Incorrect wire cut
                showToast("صدمة كهربائية! خطأ في تسلسل الأسلاك. تم حظر لوحة التحكم.", "error");
                triggerGlobalLockout(10);
                // Reset game after delay
                setTimeout(() => {
                    wires.forEach(w => w.querySelector('.wire-visual').classList.remove('cut'));
                    currentInputSequence = [];
                }, 800);
            } else {
                // Correct cut step
                if (currentInputSequence.length === correctOrder.length) {
                    setTimeout(solveStepB, 500);
                }
            }
        });
    });
}


/* ==========================================================================
   MINI-GAME 2: Logic Circuit Balancing
   ========================================================================== */
function initCircuitBalancingGame() {
    const targetVal = selectedTeam === 'blue' ? 42 : 99;
    document.getElementById('stepBInstruction').textContent = `الرمز صحيح! وازن الدائرة الحسابية لتطابق القيمة المطلوبة: ${targetVal}`;

    const nodeVals = selectedTeam === 'blue' 
        ? [12, 8, 15, 4, 7] 
        : [20, 35, 9, 30, 5];

    let currentSum = 0;

    digitalPuzzleArea.innerHTML = `
        <div class="logic-circuit">
            <div class="circuit-sum-display">المجموع الحالي: <span id="currentSumVal">0</span> / المجموع المطلوب: ${targetVal}</div>
            <div class="circuit-nodes">
                ${nodeVals.map((val, idx) => `<div class="circuit-node" data-val="${val}">${val}</div>`).join('')}
            </div>
            <button type="button" class="terminal-btn" id="verifyBalanceBtn" style="margin-top: 1.5rem; width: 100%;">تحقق وتأكيد الموازنة</button>
        </div>
    `;

    const nodes = digitalPuzzleArea.querySelectorAll('.circuit-node');
    const sumDisplay = document.getElementById('currentSumVal');
    const verifyBtn = document.getElementById('verifyBalanceBtn');

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            if (isLockedOut) return;
            playSynthTone(700, 'triangle', 0.08, 0.05);
            node.classList.toggle('active');

            const val = parseInt(node.getAttribute('data-val'));
            if (node.classList.contains('active')) {
                currentSum += val;
            } else {
                currentSum -= val;
            }

            sumDisplay.textContent = currentSum;
        });
    });

    verifyBtn.addEventListener('click', () => {
        if (isLockedOut) return;

        if (currentSum === targetVal) {
            showToast("تم موازنة الدائرة بنجاح!", "success");
            setTimeout(solveStepB, 500);
        } else {
            showToast("فشل الموازنة: المجموع غير متطابق. تم حظر لوحة التحكم.", "error");
            triggerGlobalLockout(10);
        }
    });
}

function initRedLevel2MemoryGame() {
    document.getElementById('stepBInstruction').textContent = "الرمز صحيح! راقب تسلسل النبضات... سيختفي التسلسل بعد انتهاء الاختبار.";

    digitalPuzzleArea.innerHTML = `
        <div class="memory-game-container">
            <div class="memory-instruction-banner">
                <span>⚡</span> <span id="memoryStatusText">راقب تسلسل النبضات...</span>
            </div>
            
            <div class="pulse-nodes-grid">
                <div class="pulse-node" data-node="1"><div class="pulse-spark"></div><div class="node-number">1</div></div>
                <div class="pulse-node" data-node="2"><div class="pulse-spark"></div><div class="node-number">2</div></div>
                <div class="pulse-node" data-node="3"><div class="pulse-spark"></div><div class="node-number">3</div></div>
                <div class="pulse-node" data-node="4"><div class="pulse-spark"></div><div class="node-number">4</div></div>
                <div class="pulse-node" data-node="5"><div class="pulse-spark"></div><div class="node-number">5</div></div>
                <div class="pulse-node" data-node="6"><div class="pulse-spark"></div><div class="node-number">6</div></div>
            </div>
            
            <button type="button" class="terminal-btn" id="replaySequenceBtn" style="margin-top: 1.5rem; width: 100%; display: none;">إعادة عرض التسلسل 🔄</button>
        </div>
    `;

    const nodes = digitalPuzzleArea.querySelectorAll('.pulse-node');
    const statusText = document.getElementById('memoryStatusText');
    const replayBtn = document.getElementById('replaySequenceBtn');

    const correctSequence = [3, 1, 5, 2, 6, 4];
    let userSequence = [];
    let isPlayingSeq = false;

    async function playSequence() {
        if (isLockedOut) return;
        isPlayingSeq = true;
        replayBtn.style.display = 'none';
        statusText.textContent = "راقب تسلسل النبضات...";
        statusText.style.color = "var(--neon-main)";
        
        nodes.forEach(n => n.classList.remove('interactive', 'lit', 'error', 'success'));

        await new Promise(r => setTimeout(r, 800));

        for (let i = 0; i < correctSequence.length; i++) {
            if (isLockedOut) break;
            const num = correctSequence[i];
            const node = digitalPuzzleArea.querySelector(`.pulse-node[data-node="${num}"]`);
            if (node) {
                node.classList.add('lit');
                playSynthTone(300 + num * 80, 'sine', 0.4, 0.15);
                
                await new Promise(r => setTimeout(r, 500));
                node.classList.remove('lit');
                await new Promise(r => setTimeout(r, 200));
            }
        }

        if (!isLockedOut) {
            isPlayingSeq = false;
            statusText.textContent = "أدخل التسلسل الآن بالضغط على الأزرار بالترتيب الموضح.";
            statusText.style.color = "var(--text-main)";
            replayBtn.style.display = 'block';
            nodes.forEach(n => n.classList.add('interactive'));
        }
    }

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            if (isPlayingSeq || isLockedOut) return;

            const val = parseInt(node.getAttribute('data-node'));
            
            node.classList.add('lit');
            playSynthTone(300 + val * 80, 'sine', 0.25, 0.15);
            setTimeout(() => node.classList.remove('lit'), 250);

            userSequence.push(val);
            const currentIdx = userSequence.length - 1;

            if (userSequence[currentIdx] !== correctSequence[currentIdx]) {
                statusText.textContent = "خطأ! تسلسل غير صحيح.";
                statusText.style.color = "var(--neon-red)";
                
                nodes.forEach(n => {
                    n.classList.remove('interactive');
                    n.classList.add('error');
                });
                
                userSequence = [];
                
                setTimeout(() => {
                    nodes.forEach(n => n.classList.remove('error'));
                    triggerGlobalLockout(10);
                }, 800);

                return;
            }

            if (userSequence.length === correctSequence.length) {
                statusText.textContent = "تسلسل صحيح! تمت استعادة النظام.";
                statusText.style.color = "var(--terminal-green)";
                
                nodes.forEach(n => {
                    n.classList.remove('interactive');
                    n.classList.add('success');
                });

                replayBtn.style.display = 'none';

                setTimeout(() => {
                    solveStepB();
                }, 1000);
            }
        });
    });

    replayBtn.addEventListener('click', () => {
        if (isPlayingSeq || isLockedOut) return;
        userSequence = [];
        playSequence();
    });

    playSequence();
}

function initBlueLevel2TimelineGame() {
    document.getElementById('stepBInstruction').innerHTML = `
        <div style="font-size: 1.15rem; font-weight: bold; color: var(--terminal-green); margin-bottom: 0.5rem;">✓ تم تحديد صاحب البصمة...</div>
        <div style="color: var(--text-muted); margin-bottom: 0.4rem;">لكن البصمة لا تخبرنا بما حدث.</div>
        <div style="color: #fff; font-weight: bold;">أعد بناء التسلسل الزمني لمسرح الجريمة:</div>
    `;

    digitalPuzzleArea.innerHTML = `
        <div class="timeline-game-container">
            <div class="memory-instruction-banner" style="border-color: rgba(0, 243, 255, 0.2); background: rgba(0, 40, 80, 0.15);">
                <span>📅</span> <span id="timelineStatusText" style="color: var(--text-main);">أعد بناء آخر 6 دقائق بسحب وإفلات البطاقات أو الضغط عليها لتبديلها.</span>
            </div>
            
            <div class="timeline-list" id="timelineList"></div>
            
            <button type="button" class="terminal-btn" id="submitTimelineBtn" style="margin-top: 1.5rem; width: 100%; border-color: var(--neon-blue); color: var(--neon-blue);">تأكيد ومطابقة الجدول الزمني ⚡</button>
        </div>
    `;

    const listContainer = document.getElementById('timelineList');
    const statusText = document.getElementById('timelineStatusText');
    const submitBtn = document.getElementById('submitTimelineBtn');

    const cardsData = [
        { id: 1, time: "23:08", event: "انطفأت الكهرباء في المنزل لمدة 14 ثانية." },
        { id: 2, time: "23:12", event: "التقطت كاميرا الشارع شخصًا يقترب من المنزل." },
        { id: 3, time: "23:16", event: "تم فتح الباب الرئيسي باستخدام المفتاح الأصلي." },
        { id: 4, time: "23:21", event: "تم العثور على كوب زجاجي موضوع بجانب المكتب." },
        { id: 5, time: "23:27", event: "تم تسجيل مكالمة هاتفية من داخل المنزل." },
        { id: 6, time: "23:31", event: "وصلت سيارة الشرطة إلى المنطقة." }
    ];

    let currentCards = [...cardsData];
    shuffle(currentCards);

    let selectedIdx = null;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function renderCards() {
        listContainer.innerHTML = '';
        currentCards.forEach((card, idx) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'timeline-card';
            if (selectedIdx === idx) {
                cardEl.classList.add('selected');
            }
            cardEl.setAttribute('draggable', 'true');
            cardEl.dataset.index = idx;

            cardEl.innerHTML = `
                <div class="card-drag-handle">☰</div>
                <div class="card-content">
                    <div class="card-meta">
                        <span>EVIDENCE ID: EV-00${card.id}</span>
                        <span>TIME: ${card.time}</span>
                    </div>
                    <div class="card-event">${card.event}</div>
                </div>
                <div class="card-controls">
                    <button type="button" class="card-control-btn move-up-btn" data-index="${idx}">▲</button>
                    <button type="button" class="card-control-btn move-down-btn" data-index="${idx}">▼</button>
                </div>
            `;

            // HTML5 Drag and Drop event listeners
            cardEl.addEventListener('dragstart', handleDragStart);
            cardEl.addEventListener('dragover', handleDragOver);
            cardEl.addEventListener('drop', handleDrop);
            cardEl.addEventListener('dragend', handleDragEnd);

            // Selection swap
            cardEl.addEventListener('click', (e) => {
                if (e.target.classList.contains('card-control-btn') || e.target.closest('.card-control-btn')) {
                    return;
                }
                if (isLockedOut) return;
                playSynthTone(600, 'sine', 0.05, 0.05);

                if (selectedIdx === null) {
                    selectedIdx = idx;
                    renderCards();
                } else if (selectedIdx === idx) {
                    selectedIdx = null;
                    renderCards();
                } else {
                    const temp = currentCards[selectedIdx];
                    currentCards[selectedIdx] = currentCards[idx];
                    currentCards[idx] = temp;
                    selectedIdx = null;
                    renderCards();
                }
            });

            listContainer.appendChild(cardEl);
        });

        // Up / Down controllers
        listContainer.querySelectorAll('.move-up-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isLockedOut) return;
                const idx = parseInt(btn.getAttribute('data-index'));
                if (idx > 0) {
                    const temp = currentCards[idx];
                    currentCards[idx] = currentCards[idx - 1];
                    currentCards[idx - 1] = temp;
                    selectedIdx = null;
                    playHover();
                    renderCards();
                }
            });
        });

        listContainer.querySelectorAll('.move-down-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isLockedOut) return;
                const idx = parseInt(btn.getAttribute('data-index'));
                if (idx < currentCards.length - 1) {
                    const temp = currentCards[idx];
                    currentCards[idx] = currentCards[idx + 1];
                    currentCards[idx + 1] = temp;
                    selectedIdx = null;
                    playHover();
                    renderCards();
                }
            });
        });
    }

    let dragSrcIndex = null;

    function handleDragStart(e) {
        if (isLockedOut) {
            e.preventDefault();
            return;
        }
        dragSrcIndex = parseInt(this.dataset.index);
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', dragSrcIndex);
    }

    function handleDragOver(e) {
        if (e.preventDefault) e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        const targetIndex = parseInt(this.dataset.index);
        if (dragSrcIndex !== null && dragSrcIndex !== targetIndex) {
            const draggedItem = currentCards[dragSrcIndex];
            currentCards.splice(dragSrcIndex, 1);
            currentCards.splice(targetIndex, 0, draggedItem);
            selectedIdx = null;
            playClick();
            renderCards();
        }
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        dragSrcIndex = null;
    }

    submitBtn.addEventListener('click', () => {
        if (isLockedOut) return;

        const isCorrect = currentCards.every((card, idx) => card.id === idx + 1);

        if (isCorrect) {
            submitBtn.disabled = true;
            listContainer.querySelectorAll('.card-control-btn').forEach(b => b.disabled = true);
            
            statusText.textContent = "✓ تمت إعادة بناء التسلسل الزمني.";
            statusText.style.color = "var(--terminal-green)";
            playSuccessChime();

            setTimeout(() => {
                statusText.textContent = "التحقيق يتقدم...";
                statusText.style.color = "var(--neon-blue)";
                
                setTimeout(() => {
                    solveStepB();
                }, 1500);
            }, 1500);
        } else {
            statusText.textContent = "⚠ التسلسل غير صحيح. راجع الأدلة وأعد بناء آخر 6 دقائق.";
            statusText.style.color = "var(--neon-red)";
            
            listContainer.classList.add('error-glitch-shake');
            playErrorAlarm();
            showToast("خطأ: ترتيب الأدلة غير دقيق! حظر لوحة التشفير.", "error");

            setTimeout(() => {
                listContainer.classList.remove('error-glitch-shake');
                triggerGlobalLockout(10);
            }, 800);
        }
    });

    renderCards();
}

/* ==========================================================================
   MINI-GAME 2.5: Serial Killer Pattern Analysis (Blue Team Level 3)
   ========================================================================== */
function initBlueLevel3SerialPatternGame() {
    document.getElementById('stepBInstruction').innerHTML = `
        <div style="font-size: 1.15rem; font-weight: bold; color: var(--terminal-green); margin-bottom: 0.5rem;">✓ تم تحليل نمط الأدلة بنجاح.</div>
        <div style="color: var(--text-muted); margin-bottom: 0.4rem;">لقد عرفت كيف يقرأ القاتل الأدلة. الآن حاول أن تعرف أين سيترك دليله التالي.</div>
    `;

    digitalPuzzleArea.innerHTML = `
        <div class="serial-killer-container">
            <div class="evidence-cards-grid">
                <div class="evidence-card" data-card="A">
                    <div class="evidence-tag">أثر A</div>
                    <div class="evidence-row"><span>الوقت:</span> <strong>02:17</strong></div>
                    <div class="evidence-row"><span>الاتجاه:</span> <strong>NORTH</strong></div>
                    <div class="evidence-row"><span>العلامة:</span> <strong style="color: #bbb;">BLACK</strong></div>
                </div>
                <div class="evidence-card" data-card="B">
                    <div class="evidence-tag">أثر B</div>
                    <div class="evidence-row"><span>الوقت:</span> <strong>03:42</strong></div>
                    <div class="evidence-row"><span>الاتجاه:</span> <strong>SOUTH</strong></div>
                    <div class="evidence-row"><span>العلامة:</span> <strong style="color: #fff;">WHITE</strong></div>
                </div>
                <div class="evidence-card" data-card="C">
                    <div class="evidence-tag">أثر C</div>
                    <div class="evidence-row"><span>الوقت:</span> <strong>02:17</strong></div>
                    <div class="evidence-row"><span>الاتجاه:</span> <strong>EAST</strong></div>
                    <div class="evidence-row"><span>العلامة:</span> <strong style="color: #bbb;">BLACK</strong></div>
                </div>
                <div class="evidence-card" data-card="D">
                    <div class="evidence-tag">أثر D</div>
                    <div class="evidence-row"><span>الوقت:</span> <strong>04:03</strong></div>
                    <div class="evidence-row"><span>الاتجاه:</span> <strong>WEST</strong></div>
                    <div class="evidence-row"><span>العلامة:</span> <strong style="color: #ff0055;">RED</strong></div>
                </div>
            </div>

            <div class="pattern-selector-section">
                <div class="pattern-stage-indicator" id="patternStageIndicator">المرحلة 1: اختر الوقت الصحيح للجريمة التالية (TIME)</div>
                
                <div class="selector-groups">
                    <div class="selector-group-box" id="time-selector-box">
                        <div class="group-label">TIME (الوقت)</div>
                        <div class="selector-buttons">
                            <button type="button" class="pattern-btn" data-type="time" data-val="02:17">02:17</button>
                            <button type="button" class="pattern-btn" data-type="time" data-val="03:42">03:42</button>
                            <button type="button" class="pattern-btn" data-type="time" data-val="04:03">04:03</button>
                        </div>
                    </div>

                    <div class="selector-group-box disabled" id="direction-selector-box">
                        <div class="group-label">DIRECTION (الاتجاه)</div>
                        <div class="selector-buttons">
                            <button type="button" class="pattern-btn" data-type="dir" data-val="NORTH">NORTH</button>
                            <button type="button" class="pattern-btn" data-type="dir" data-val="SOUTH">SOUTH</button>
                            <button type="button" class="pattern-btn" data-type="dir" data-val="EAST">EAST</button>
                            <button type="button" class="pattern-btn" data-type="dir" data-val="WEST">WEST</button>
                        </div>
                    </div>

                    <div class="selector-group-box disabled" id="mark-selector-box">
                        <div class="group-label">MARK (العلامة)</div>
                        <div class="selector-buttons">
                            <button type="button" class="pattern-btn" data-type="mark" data-val="BLACK">BLACK</button>
                            <button type="button" class="pattern-btn" data-type="mark" data-val="WHITE">WHITE</button>
                            <button type="button" class="pattern-btn" data-type="mark" data-val="RED">RED</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const indicator = document.getElementById('patternStageIndicator');
    const timeBox = document.getElementById('time-selector-box');
    const dirBox = document.getElementById('direction-selector-box');
    const markBox = document.getElementById('mark-selector-box');
    const btns = digitalPuzzleArea.querySelectorAll('.pattern-btn');

    let stage = 1;
    let chosenTime = null;
    let chosenDir = null;
    let chosenMark = null;

    function resetPatternGame() {
        stage = 1;
        chosenTime = null;
        chosenDir = null;
        chosenMark = null;
        
        indicator.textContent = "المرحلة 1: اختر الوقت الصحيح للجريمة التالية (TIME)";
        indicator.style.color = "var(--terminal-green)";
        
        timeBox.classList.remove('disabled');
        dirBox.classList.add('disabled');
        markBox.classList.add('disabled');
        
        btns.forEach(btn => {
            btn.classList.remove('active', 'correct', 'wrong');
            btn.disabled = false;
        });
    }

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isLockedOut) return;
            
            const type = btn.getAttribute('data-type');
            const val = btn.getAttribute('data-val');

            if (type === 'time' && stage === 1) {
                if (val === '02:17') {
                    chosenTime = val;
                    btn.classList.add('correct');
                    timeBox.querySelectorAll('.pattern-btn').forEach(b => {
                        if (b !== btn) b.disabled = true;
                    });
                    playSuccessChime();
                    stage = 2;
                    dirBox.classList.remove('disabled');
                    indicator.textContent = "المرحلة 2: اختر الاتجاه الصحيح لمسرح الجريمة التالي (DIRECTION)";
                } else {
                    btn.classList.add('wrong');
                    showToast("خطأ: الوقت المحدد لا يتطابق مع نمط الجرائم السابقة.", "error");
                    triggerGlobalLockout(10);
                    setTimeout(resetPatternGame, 1000);
                }
            } else if (type === 'dir' && stage === 2) {
                if (val === 'EAST') {
                    chosenDir = val;
                    btn.classList.add('correct');
                    dirBox.querySelectorAll('.pattern-btn').forEach(b => {
                        if (b !== btn) b.disabled = true;
                    });
                    playSuccessChime();
                    stage = 3;
                    markBox.classList.remove('disabled');
                    indicator.textContent = "المرحلة 3: اختر العلامة الصحيحة لموقع الجريمة التالي (MARK)";
                } else {
                    btn.classList.add('wrong');
                    showToast("خطأ: الاتجاه غير متناسق مع التوزيع الجغرافي للضحايا.", "error");
                    triggerGlobalLockout(10);
                    setTimeout(resetPatternGame, 1000);
                }
            } else if (type === 'mark' && stage === 3) {
                if (val === 'BLACK') {
                    chosenMark = val;
                    btn.classList.add('correct');
                    markBox.querySelectorAll('.pattern-btn').forEach(b => {
                        if (b !== btn) b.disabled = true;
                    });
                    playSuccessChime();
                    
                    indicator.textContent = "🔎 تم تحديد النمط بنجاح.";
                    indicator.style.color = "var(--terminal-green)";
                    
                    setTimeout(() => {
                        solveStepB();
                    }, 1200);
                } else {
                    btn.classList.add('wrong');
                    showToast("خطأ: العلامة لا تتطابق مع الأثر المتروك.", "error");
                    triggerGlobalLockout(10);
                    setTimeout(resetPatternGame, 1000);
                }
            }
        });
    });
}

/* ==========================================================================
   MINI-GAME 2.6: Ward 13 Floor Plan Analysis (Red Team Level 4)
   ========================================================================== */
function initRedLevel4BlueprintGame() {
    document.getElementById('stepBInstruction').innerHTML = `
        <div style="font-size: 1.15rem; font-weight: bold; color: #ff3344; margin-bottom: 0.5rem;">الخريطة الرسمية تحتوي على 12 غرفة.</div>
        <div style="color: var(--text-muted); margin-bottom: 0.4rem;">لكن تقرير الصيانة يتحدث عن باب رابع عشر...</div>
        <div style="color: #fff; font-weight: bold;">أي باب لا ينتمي إلى أي غرفة؟</div>
    `;

    digitalPuzzleArea.innerHTML = `
        <div class="blueprint-container">
            <div class="blueprint-floorplan">
                <div class="blueprint-room br1" data-room="01">01<small>NORTH</small></div>
                <div class="blueprint-room br2" data-room="02">02<small>NORTH</small></div>
                <div class="blueprint-room br3" data-room="03">03<small>NORTH</small></div>
                <div class="blueprint-room br4" data-room="04">04<small>NORTH</small></div>
                
                <div class="blueprint-room br5" data-room="05">05<small>WEST</small></div>
                <div class="blueprint-room br6" data-room="06">06<small>WEST</small></div>
                <div class="blueprint-room br7" data-room="07">07<small>EAST</small></div>
                <div class="blueprint-room br8" data-room="08">08<small>EAST</small></div>
                
                <div class="blueprint-room br9" data-room="09">09<small>SOUTH</small></div>
                <div class="blueprint-room br10" data-room="10">10<small>SOUTH</small></div>
                <div class="blueprint-room br11" data-room="11">11<small>SOUTH</small></div>
                <div class="blueprint-room br12" data-room="12">12<small>SOUTH</small></div>
                
                <div class="blueprint-unexplained-door" id="blueprintSecretDoor"></div>
                
                <div class="blueprint-hidden-room-reveal" id="hiddenRoomReveal">
                    <div class="hidden-corridor"></div>
                    <div class="hidden-room">13</div>
                </div>
            </div>
            
            <div class="blueprint-terminal-log" id="blueprintLog">AWAITING INPUT...</div>
            
            <div class="symbol-puzzle-box hidden" id="symbolPuzzleBox" style="width: 100%; margin-top: 1rem;">
                <div style="font-size: 0.95rem; margin-bottom: 0.8rem; line-height: 1.6; color: #ff8080; text-align: center;">
                    Four symbols were found in Dr. Victor's notes.
                </div>
                <div class="symbol-values-grid" style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 1rem; font-family: monospace; font-size: 1.1rem; color: #a58c67;">
                    <div>□ = 1</div>
                    <div>△ = 2</div>
                    <div>○ = 4</div>
                    <div>✕ = 9</div>
                </div>
                <div style="text-align: center; margin-bottom: 1rem;">
                    <span style="font-size: 1.4rem; color: #ff3344; letter-spacing: 0.5rem; font-weight: bold;">△ ○ □ ✕</span>
                </div>
                <div class="answer-slots" style="display: flex; justify-content: center; gap: 8px; margin-bottom: 1rem;">
                    <input type="text" maxlength="1" class="symbol-digit-input" data-idx="0" inputmode="numeric">
                    <input type="text" maxlength="1" class="symbol-digit-input" data-idx="1" inputmode="numeric">
                    <input type="text" maxlength="1" class="symbol-digit-input" data-idx="2" inputmode="numeric">
                    <input type="text" maxlength="1" class="symbol-digit-input" data-idx="3" inputmode="numeric">
                </div>
                <button type="button" class="terminal-btn" id="submitSymbolsBtn" style="width: 100%; border-color: #6e1515; color: #ff3344; background: rgba(0,0,0,0.5);">تأكيد الرمز الجنائي</button>
            </div>
        </div>
    `;

    const log = document.getElementById('blueprintLog');
    const secretDoor = document.getElementById('blueprintSecretDoor');
    const symbolBox = document.getElementById('symbolPuzzleBox');
    const rooms = digitalPuzzleArea.querySelectorAll('.blueprint-room');

    rooms.forEach(room => {
        room.addEventListener('click', () => {
            if (isLockedOut) return;
            const roomNum = room.getAttribute('data-room');
            playSynthTone(300, 'triangle', 0.1, 0.05);
            log.innerHTML = `ROOM ${roomNum} — REGISTERED`;
        });
    });

    secretDoor.addEventListener('click', () => {
        if (isLockedOut) return;
        playSynthTone(500, 'sawtooth', 0.2, 0.08);
        log.innerHTML = `UNREGISTERED ACCESS POINT FOUND.<br>THIS DOOR DOES NOT BELONG TO THE FLOOR PLAN.`;
        
        // Show second puzzle
        symbolBox.classList.remove('hidden');
        
        // Focus first symbol input
        const firstInput = symbolBox.querySelector('.symbol-digit-input[data-idx="0"]');
        if (firstInput) firstInput.focus();
    });

    // Auto-advance and backspace for symbol inputs
    const symbolInputs = symbolBox.querySelectorAll('.symbol-digit-input');
    symbolInputs.forEach((inp, idx) => {
        inp.addEventListener('input', (e) => {
            const val = e.target.value;
            if (!/^[0-9]$/.test(val)) {
                e.target.value = '';
                return;
            }
            playTickSound();
            const next = symbolBox.querySelector(`.symbol-digit-input[data-idx="${idx + 1}"]`);
            if (next) {
                next.focus();
            }
        });

        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                if (e.target.value === '') {
                    const prev = symbolBox.querySelector(`.symbol-digit-input[data-idx="${idx - 1}"]`);
                    if (prev) {
                        prev.focus();
                        prev.value = '';
                        e.preventDefault();
                    }
                } else {
                    e.target.value = '';
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('submitSymbolsBtn').click();
            }
        });

        // Paste support
        inp.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = (e.clipboardData || window.clipboardData).getData('text').trim();
            if (!/^[0-9]+$/.test(pastedData)) return;

            const digits = pastedData.split('');
            symbolInputs.forEach((symbolInp, sIdx) => {
                if (sIdx >= idx && digits[sIdx - idx]) {
                    symbolInp.value = digits[sIdx - idx];
                }
            });

            const nextFocusIndex = Math.min(idx + digits.length, symbolInputs.length - 1);
            if (symbolInputs[nextFocusIndex]) {
                symbolInputs[nextFocusIndex].focus();
            }
            playTickSound();
        });
    });

    const submitBtn = document.getElementById('submitSymbolsBtn');
    submitBtn.addEventListener('click', () => {
        if (isLockedOut) return;

        let code = '';
        symbolInputs.forEach(symbolInp => code += symbolInp.value);

        if (code === '2419') {
            // Success
            symbolBox.classList.add('hidden');
            log.innerHTML = 'SYMBOL SEQUENCE ACCEPTED.';
            playSuccessChime();

            setTimeout(() => {
                log.innerHTML += '<br>ROOM 13 WAS NEVER ON THE OFFICIAL MAP.';
            }, 1200);

            setTimeout(() => {
                log.innerHTML += '<br>BUT SOMEONE BUILT IT.';
                document.getElementById('hiddenRoomReveal').classList.add('revealed');
                playSynthTone(150, 'sawtooth', 0.8, 0.1);
            }, 2600);

            setTimeout(() => {
                log.innerHTML += '<br><br><span style="color: var(--terminal-green); font-weight: bold;">ROOM 13 LOCATED.</span>';
            }, 4000);

            setTimeout(() => {
                log.innerHTML += '<br><br><em>Dr. Victor did not hide the room.<br>HE HID THE WAY TO IT.</em>';
            }, 5500);

            setTimeout(() => {
                solveStepB();
            }, 7500);
        } else {
            // Failure
            showToast("خطأ: تسلسل الرموز غير صالح.", "error");
            triggerGlobalLockout(10);
            
            // Clear inputs
            symbolInputs.forEach(symbolInp => symbolInp.value = '');
            if (symbolInputs[0]) symbolInputs[0].focus();
        }
    });
}

/* ==========================================================================
   MINI-GAME 2.7: Thermal Forensics Decoder (Blue Team Level 4)
   ========================================================================== */
function initBlueLevel4PhotoForensicsGame() {
    document.getElementById('stepBInstruction').innerHTML = `
        <div style="font-size: 1.15rem; font-weight: bold; color: var(--terminal-green); margin-bottom: 0.5rem;">🔥 THERMAL IMAGING ACTIVATED</div>
        <div style="color: var(--text-muted); margin-bottom: 0.4rem;">تفحص صورة مسرح الجريمة الحرارية. اضغط على النقاط الساخنة بترتيب تصاعدي (من الأبرد للأسخن) لاستخراج رمز الدليل.</div>
    `;

    // Define thermal hotspots with temperature and hidden digit
    const thermalSpots = [
        { id: 'spot-1', digit: '1', temp: 32, x: '15%', y: '25%' },
        { id: 'spot-7', digit: '7', temp: 45, x: '70%', y: '40%' },
        { id: 'spot-0', digit: '0', temp: 58, x: '35%', y: '70%' },
        { id: 'spot-4', digit: '4', temp: 72, x: '80%', y: '75%' }
    ];

    digitalPuzzleArea.innerHTML = `
        <div class="thermal-forensics-container" style="width: 100%; max-width: 600px; margin: 0 auto;">
            <div class="thermal-image-viewer" style="position: relative; width: 100%; aspect-ratio: 4/3; background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1425 100%); border: 2px solid var(--panel-border); border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem;">
                <!-- Thermal background pattern -->
                <div style="position: absolute; inset: 0; background: 
                    radial-gradient(circle at 15% 25%, rgba(255, 80, 0, 0.25) 0%, transparent 15%),
                    radial-gradient(circle at 70% 40%, rgba(255, 120, 0, 0.28) 0%, transparent 12%),
                    radial-gradient(circle at 35% 70%, rgba(255, 160, 0, 0.3) 0%, transparent 14%),
                    radial-gradient(circle at 80% 75%, rgba(255, 220, 0, 0.35) 0%, transparent 16%);
                    pointer-events: none;"></div>
                
                <!-- Thermal hotspots -->
                ${thermalSpots.map(spot => `
                    <div class="thermal-hotspot" data-digit="${spot.digit}" data-temp="${spot.temp}" 
                         style="position: absolute; left: ${spot.x}; top: ${spot.y}; transform: translate(-50%, -50%); cursor: pointer; transition: all 0.2s;">
                        <div style="width: 60px; height: 60px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(255, 200, 0, 0.8), rgba(255, 100, 0, 0.4)); border: 2px solid rgba(255, 150, 0, 0.6); display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000; font-size: 1.2rem; box-shadow: 0 0 20px rgba(255, 150, 0, 0.5);">
                            ${spot.temp}°C
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="background: rgba(0, 0, 0, 0.6); border: 1px solid var(--panel-border); border-radius: 6px; padding: 1rem; margin-bottom: 1rem; text-align: center;">
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.8rem;">اتبع مسار الحركة: من الأبرد للأسخن</div>
                <div style="font-size: 1rem; font-weight: bold; color: var(--terminal-green); letter-spacing: 0.3em;">
                    الرقم المستخرج: <span id="thermalCode" style="color: var(--neon-blue); font-family: monospace;">----</span>
                </div>
            </div>

            <div class="blueprint-terminal-log" id="thermalLog">AWAITING THERMAL ANALYSIS...</div>
        </div>
    `;

    const log = document.getElementById('thermalLog');
    const codeDisplay = document.getElementById('thermalCode');
    let extractedCode = '';
    let clickedSpots = new Set();
    const hotspots = digitalPuzzleArea.querySelectorAll('.thermal-hotspot');

    // Sort spots by temperature for reference
    const sortedByTemp = Array.from(thermalSpots).sort((a, b) => a.temp - b.temp);

    hotspots.forEach(spot => {
        spot.addEventListener('click', () => {
            if (isLockedOut) return;

            const digit = spot.getAttribute('data-digit');
            const temp = parseInt(spot.getAttribute('data-temp'));
            const spotId = `${digit}-${temp}`;

            if (clickedSpots.has(spotId)) {
                showToast("هذه النقطة تم تحليلها بالفعل.", "warning");
                return;
            }

            // Play thermal detection sound
            playSynthTone(400 + temp * 3, 'sine', 0.2, 0.1);
            
            clickedSpots.add(spotId);
            extractedCode += digit;
            
            // Visual feedback
            spot.style.transform = 'translate(-50%, -50%) scale(1.2)';
            spot.style.opacity = '0.7';
            
            codeDisplay.textContent = extractedCode.padEnd(4, '-');
            log.innerHTML = `THERMAL POINT DETECTED: ${temp}°C<br>CODE PROGRESS: ${extractedCode || '...'}`;

            // Check if code matches the expected sequence (1->7->0->4 based on temperature order)
            if (extractedCode.length === 4) {
                if (extractedCode === '1704') {
                    // Success - correct order
                    setTimeout(() => {
                        log.innerHTML = '✓ THERMAL TRAIL VERIFIED.';
                        playSuccessChime();
                        codeDisplay.style.color = 'var(--terminal-green)';
                    }, 300);

                    setTimeout(() => {
                        log.innerHTML += '<br>MOVEMENT PATTERN ANALYZED.';
                    }, 1500);

                    setTimeout(() => {
                        log.innerHTML += '<br>المريب تحرك من الزاوية الباردة إلى الأسخن.';
                    }, 2800);

                    setTimeout(() => {
                        log.innerHTML += '<br><br><span style="color: var(--terminal-green); font-weight: bold;">الحركة تحدد الدليل التالي.</span>';
                    }, 4200);

                    setTimeout(() => {
                        solveStepB();
                    }, 6200);
                } else {
                    // Failure - wrong order
                    showToast("ترتيب التحليل الحراري خاطئ. أعد المحاولة.", "error");
                    triggerGlobalLockout(10);
                    
                    // Reset
                    extractedCode = '';
                    clickedSpots.clear();
                    codeDisplay.textContent = '----';
                    codeDisplay.style.color = 'var(--neon-blue)';
                    hotspots.forEach(h => {
                        h.style.transform = 'translate(-50%, -50%) scale(1)';
                        h.style.opacity = '1';
                    });
                    log.innerHTML = 'THERMAL SCAN FAILED. RESTART ANALYSIS...';
                }
            }
        });

        // Hover effect
        spot.addEventListener('mouseenter', () => {
            if (!isLockedOut) {
                spot.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }
        });

        spot.addEventListener('mouseleave', () => {
            const digit = spot.getAttribute('data-digit');
            const temp = parseInt(spot.getAttribute('data-temp'));
            const spotId = `${digit}-${temp}`;
            
            if (clickedSpots.has(spotId)) {
                spot.style.transform = 'translate(-50%, -50%) scale(1.2)';
            } else {
                spot.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    });
}

/* ==========================================================================
   MINI-GAME 3: Wave Tuning (Frequency Slider)
   ========================================================================== */
function initFrequencyTuningGame() {
    const targetFreq = selectedTeam === 'blue' ? 440 : 880;
    document.getElementById('stepBInstruction').textContent = `الرمز صحيح! وازن الترددات عن طريق تحريك المنزلق لتطابق التردد: ${targetFreq} هرتز.`;

    digitalPuzzleArea.innerHTML = `
        <div class="frequency-game">
            <canvas class="wave-canvas" id="frequencyCanvas" width="300" height="120"></canvas>
            <div class="circuit-sum-display">التردد الحالي: <span id="currentFreq">100</span> هرتز</div>
            <input type="range" min="100" max="1000" value="100" class="wave-slider" id="freqSlider" style="width: 100%;">
            <button type="button" class="terminal-btn" id="verifyFreqBtn" style="margin-top: 1.5rem; width: 100%;">تثبيت وتأكيد التردد</button>
        </div>
    `;

    const canvas = document.getElementById('frequencyCanvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('freqSlider');
    const freqDisplay = document.getElementById('currentFreq');
    const verifyBtn = document.getElementById('verifyFreqBtn');

    let currentVal = 100;
    let isSolved = false;

    // Draw the sine waves loop
    let offset = 0;
    function drawWaves() {
        if (isSolved) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Target Wave (Dim Static Wave)
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2;
        const targetCycles = targetFreq / 100;
        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + Math.sin(x * (Math.PI * 2 / canvas.width) * targetCycles + offset) * 35;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw User Wave
        ctx.beginPath();
        ctx.strokeStyle = selectedTeam === 'blue' ? "#00f3ff" : "#ff0055";
        ctx.lineWidth = 2;
        const userCycles = currentVal / 100;
        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + Math.sin(x * (Math.PI * 2 / canvas.width) * userCycles + offset) * 35;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        offset += 0.05;
        requestAnimationFrame(drawWaves);
    }

    slider.addEventListener('input', (e) => {
        if (isLockedOut) {
            e.preventDefault();
            slider.value = currentVal;
            return;
        }
        currentVal = parseInt(e.target.value);
        freqDisplay.textContent = currentVal;

        // Feedback tone (dynamic pitch scaling)
        playSynthTone(currentVal, 'sine', 0.02, 0.03);
    });

    verifyBtn.addEventListener('click', () => {
        if (isLockedOut) return;

        if (Math.abs(currentVal - targetFreq) <= 15) {
            isSolved = true;
            slider.disabled = true;
            slider.style.opacity = '0.5';
            verifyBtn.disabled = true;
            showToast("تم معايرة التردد بنجاح!", "success");
            setTimeout(solveStepB, 600);
        } else {
            showToast("فشل التثبيت: التردد غير متوافق. تم حظر لوحة التحكم.", "error");
            triggerGlobalLockout(10);
        }
    });

    drawWaves();
}


/* ==========================================================================
   MINI-GAME 4: Simon Says Sequence Matching
   ========================================================================== */
function initSequenceMatchingGame() {
    document.getElementById('stepBInstruction').textContent = "الرمز صحيح! تطابق تسلسل الأزرار لإلغاء القفل الفرعي للمنشأة.";

    digitalPuzzleArea.innerHTML = `
        <div class="memory-grid">
            <div class="memory-btn" data-key="UP">⬆</div>
            <div class="memory-btn" data-key="DOWN">⬇</div>
            <div class="memory-btn" data-key="LEFT">⬅</div>
            <div class="memory-btn" data-key="RIGHT">➡</div>
        </div>
    `;

    const seq = selectedTeam === 'blue' 
        ? ["LEFT", "UP", "RIGHT", "DOWN"] 
        : ["RIGHT", "DOWN", "LEFT", "UP"];
        
    const btns = digitalPuzzleArea.querySelectorAll('.memory-btn');
    
    // Auto sequence playback
    let playIdx = 0;
    function playSeq() {
        if (playIdx >= seq.length) return;
        const key = seq[playIdx];
        const btn = Array.from(btns).find(b => b.getAttribute('data-key') === key);
        
        btn.classList.add('lit');
        playSynthTone(600 + playIdx * 100, 'sine', 0.2, 0.1);
        
        setTimeout(() => {
            btn.classList.remove('lit');
            playIdx++;
            setTimeout(playSeq, 150);
        }, 350);
    }
    
    // Play after short initial setup delay
    setTimeout(playSeq, 1000);

    let userIdx = 0;
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isLockedOut) return;
            const key = btn.getAttribute('data-key');
            btn.classList.add('lit');
            playSynthTone(500, 'sine', 0.1, 0.08);

            setTimeout(() => btn.classList.remove('lit'), 150);

            if (key === seq[userIdx]) {
                userIdx++;
                if (userIdx === seq.length) {
                    setTimeout(solveStepB, 500);
                }
            } else {
                showToast("فشل المطابقة! تكرار الرمز الصوتي خطأ. تم حظر لوحة التحكم.", "error");
                userIdx = 0;
                triggerGlobalLockout(10);
                // Replay sequence
                setTimeout(() => {
                    playIdx = 0;
                    playSeq();
                }, 11000);
            }
        });
    });
}


/* ==========================================================================
   MINI-GAME 5: Hex Search Matrix
   ========================================================================== */
function initHexSearchGame() {
    const targetHex = selectedTeam === 'blue' ? "E5" : "A9";
    document.getElementById('stepBInstruction').textContent = `الرمز صحيح! اعثر على كود التفعيل الرقمي ${targetHex} داخل المصفوفة المشوشة:`;

    // Hex pool generator
    const hexPool = ["FF", "2A", "C8", "D3", "0F", "E4", "B1", "7C", "9A", "5B", "3D", "6E", "10", "4C", "85", "A1", "BF", "C2", "DF", "0A", "1B", "CC", "A3", targetHex];
    
    // Shuffle array helper
    const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

    function drawGrid() {
        const shuffled = shuffleArray([...hexPool]);
        digitalPuzzleArea.innerHTML = `
            <div class="hex-target-display">ابحث عن: ${targetHex}</div>
            <div class="hex-board">
                ${shuffled.map(code => `<div class="hex-cell" data-val="${code}">${code}</div>`).join('')}
            </div>
        `;

        const cells = digitalPuzzleArea.querySelectorAll('.hex-cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (isLockedOut) return;
                const val = cell.getAttribute('data-val');
                if (val === targetHex) {
                    cell.style.background = "var(--terminal-green)";
                    cell.style.color = "#000";
                    setTimeout(solveStepB, 500);
                } else {
                    cell.style.background = "var(--neon-red)";
                    showToast("خطأ: عنوان وصول غير صالح! تم حظر لوحة التشفير.", "error");
                    triggerGlobalLockout(10);
                    setTimeout(drawGrid, 10000); // Redraw after lockout
                }
            });
        });
    }

    drawGrid();
}


/* ==========================================================================
   MINI-GAME 6: Level 6 Forensic Final Board
   ========================================================================== */
function initLevel6FinalInvestigationBoard() {
    const isBlue = (selectedTeam === 'blue');
    
    document.getElementById('stepBInstruction').textContent = isBlue ? 
        "أدخل اللائحة النهائية لربط المشتبه به بمسار الجريمة والقرائن المادية لإدانته:" :
        "قم بإعادة بناء خط النقل والقرائن الزمنية والمستندات لإغلاق تحقيق الجناح 13:";

    if (isBlue) {
        digitalPuzzleArea.innerHTML = `
            <div class="level6-board">
                <div class="level6-grid">
                    <!-- LEFT COLUMN: Dropdowns -->
                    <div class="level5-panel">
                        <div class="level5-panel-title">
                            <span>اللائحة النهائية للاتهام</span>
                            <span style="font-size:0.75rem; opacity:0.7;">Accusation List</span>
                        </div>
                        
                        <div class="level6-field-group">
                            <label class="level6-label">من هو القاتل؟ (Suspect Identity)</label>
                            <select class="level6-select" id="l6BlueSuspect">
                                <option value="">-- اختر المشتبه به --</option>
                                <option value="david_miller">David Miller (ديفيد ميلر)</option>
                                <option value="daniel_roth">Daniel Roth (دانيال روث)</option>
                                <option value="thomas_cole">Thomas Cole (توماس كول)</option>
                            </select>
                        </div>
                        
                        <div class="level6-field-group">
                            <label class="level6-label">ما هو التوقيت المطابق للنمط؟ (Pattern Time)</label>
                            <select class="level6-select" id="l6BlueTime">
                                <option value="">-- اختر التوقيت --</option>
                                <option value="23:17">23:17</option>
                                <option value="23:36">23:36</option>
                                <option value="02:17">02:17</option>
                                <option value="22:08">22:08</option>
                            </select>
                        </div>
                        
                        <div class="level6-field-group">
                            <label class="level6-label">ما هو الاتجاه الموثق؟ (Pattern Direction)</label>
                            <select class="level6-select" id="l6BlueDirection">
                                <option value="">-- اختر الاتجاه --</option>
                                <option value="west">WEST (غرب)</option>
                                <option value="east">EAST (شرق)</option>
                                <option value="north">NORTH (شمال)</option>
                                <option value="south">SOUTH (جنوب)</option>
                            </select>
                        </div>
                        
                        <div class="level6-field-group">
                            <label class="level6-label">ما هي علامة النمط؟ (Pattern Mark)</label>
                            <select class="level6-select" id="l6BlueMark">
                                <option value="">-- اختر علامة النمط --</option>
                                <option value="red">RED (أحمر)</option>
                                <option value="blue">BLUE (أزرق)</option>
                                <option value="black">BLACK (أسود)</option>
                                <option value="white">WHITE (أبيض)</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- RIGHT COLUMN: Checkboxes -->
                    <div class="level5-panel">
                        <div class="level5-panel-title">
                            <span>الأدلة والقرائن الرابطة</span>
                            <span style="font-size:0.75rem; opacity:0.7;">Evidence Linking</span>
                        </div>
                        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.2rem;">
                            حدد الأدلة المادية التي تربط المشتبه به بمسرح الجريمة بشكل قاطع:
                        </div>
                        
                        <div class="level6-checkbox-list">
                            <label class="level6-checkbox-item">
                                <input type="checkbox" id="l6BlueEv1" value="ev1">
                                <span>بصمة الإصبع B-3 على التقارير تطابق المشتبه به (Fingerprint B-3 match)</span>
                            </label>
                            <label class="level6-checkbox-item">
                                <input type="checkbox" id="l6BlueEv2" value="ev2">
                                <span>موقع الهاتف الجوال للمشتبه به داخل EAST-04 عند 02:17</span>
                            </label>
                            <label class="level6-checkbox-item">
                                <input type="checkbox" id="l6BlueEv3" value="ev3">
                                <span>سجل الدخول يثبت عبور شخص للممر الشرقي عند 02:17</span>
                            </label>
                            <label class="level6-checkbox-item">
                                <input type="checkbox" id="l6BlueEv4" value="ev4">
                                <span>مكالمة مكتب التحقيق الواردة عند الساعة 23:21</span>
                            </label>
                            <label class="level6-checkbox-item">
                                <input type="checkbox" id="l6BlueEv5" value="ev5">
                                <span>توقيع المشرف المفقود من سجل الإغلاق الورقي</span>
                            </label>
                        </div>
                        
                        <!-- Terminal Log -->
                        <div class="level6-terminal-log" id="l6TerminalLog">
                            <div>[SYSTEM] Final Case Accusation Engine online.</div>
                            <div>[SYSTEM] Awaiting forensic input matrix...</div>
                        </div>
                    </div>
                </div>
                
                <button type="button" class="terminal-btn" id="l6SubmitBtn" style="width:100%; padding:0.8rem; font-size:1.1rem; border:2px solid var(--panel-border); margin-top:0.5rem;">
                    تقديم لائحة الاتهام النهائية وإغلاق القضية
                </button>
            </div>
        `;
    } else {
        digitalPuzzleArea.innerHTML = `
            <div class="level6-board">
                <div class="level6-grid">
                    <!-- LEFT COLUMN: Dropdowns -->
                    <div class="level5-panel">
                        <div class="level5-panel-title">
                            <span>إعادة بناء مسار نقل الجثة</span>
                            <span style="font-size:0.75rem; opacity:0.7;">Reconstruction List</span>
                        </div>
                        
                        <div class="level6-field-group">
                            <label class="level6-label">من المسؤول عن نقل جثة المريض 404؟</label>
                            <select class="level6-select" id="l6RedSuspect">
                                <option value="">-- اختر الفاعل --</option>
                                <option value="nurse_eleanor">Nurse Eleanor (الممرضة إلينور)</option>
                                <option value="dr_victor">Dr. Victor Hartmann (د. فيكتور هارتمان)</option>
                                <option value="patient_404">Patient 404 (المريض 404 نفسه)</option>
                            </select>
                        </div>
                        
                        <div class="level6-field-group">
                            <label class="level6-label">ما هو وقت الوفاة الفعلي المسجل؟</label>
                            <select class="level6-select" id="l6RedTimeDeath">
                                <option value="">-- اختر وقت الوفاة --</option>
                                <option value="21:49">21:49</option>
                                <option value="21:56">21:56</option>
                                <option value="22:08">22:08</option>
                                <option value="22:12">22:12</option>
                            </select>
                        </div>
                        
                        <div class="level6-field-group">
                            <label class="level6-label">ما هو وقت اكتشاف اختفاء الجثة؟</label>
                            <select class="level6-select" id="l6RedTimeMissing">
                                <option value="">-- اختر وقت اكتشاف الاختفاء --</option>
                                <option value="21:56">21:56</option>
                                <option value="22:08">22:08</option>
                                <option value="22:12">22:12</option>
                                <option value="22:31">22:31</option>
                            </select>
                        </div>
                        
                        <div class="level6-field-group">
                            <label class="level6-label">ما هو مسار النقل السري المستخدم؟</label>
                            <select class="level6-select" id="l6RedRoute">
                                <option value="">-- اختر مسار النقل --</option>
                                <option value="main_lobby">Main lobby (البهو الرئيسي)</option>
                                <option value="east_corridor">East corridor (الممر الشرقي)</option>
                                <option value="service_corridor">Service corridor (ممر الخدمة السري)</option>
                            </select>
                        </div>
                        
                        <div class="level6-field-group">
                            <label class="level6-label">ما هي الوجهة النهائية للجثة؟</label>
                            <select class="level6-select" id="l6RedDestination">
                                <option value="">-- اختر الوجهة النهائية --</option>
                                <option value="morgue_bed">Morgue bed (سرير المشرحة)</option>
                                <option value="lower_chamber">Lower chamber / Room 13 (الحجرة السفلية)</option>
                                <option value="ward_12">Ward 12 (الجناح 12)</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- RIGHT COLUMN: Checkboxes -->
                    <div class="level5-panel">
                        <div class="level5-panel-title">
                            <span>القرائن والأدلة المادية</span>
                            <span style="font-size:0.75rem; opacity:0.7;">Proof & Logs</span>
                        </div>
                        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.2rem;">
                            حدد القرائن وسجلات الأنظمة التي تثبت واقعة النقل والتوقيت:
                        </div>
                        
                        <div class="level6-checkbox-list">
                            <label class="level6-checkbox-item">
                                <input type="checkbox" id="l6RedProof1" value="proof1">
                                <span>سجل باب الخدمة: فتح 22:09 وأغلق 22:16</span>
                            </label>
                            <label class="level6-checkbox-item">
                                <input type="checkbox" id="l6RedProof2" value="proof2">
                                <span>انقطاع بث الكاميرا CAM-13 عند الساعة 22:07</span>
                            </label>
                            <label class="level6-checkbox-item">
                                <input type="checkbox" id="l6RedProof3" value="proof3">
                                <span>دخول عربة النقل المحملة للمنطقة غير المسجلة 22:10</span>
                            </label>
                            <label class="level6-checkbox-item">
                                <input type="checkbox" id="l6RedProof4" value="proof4">
                                <span>حركة سرير المشرحة المسجلة عند الساعة 21:56</span>
                            </label>
                            <label class="level6-checkbox-item">
                                <input type="checkbox" id="l6RedProof5" value="proof5">
                                <span>تقرير الصيانة الخاص بالجناح 13 ومفاتيح التشغيل</span>
                            </label>
                        </div>
                        
                        <!-- Terminal Log -->
                        <div class="level6-terminal-log" id="l6TerminalLog">
                            <div>[SYSTEM] Body Route Reconstruction Engine online.</div>
                            <div>[SYSTEM] Awaiting corridor logging data...</div>
                        </div>
                    </div>
                </div>
                
                <button type="button" class="terminal-btn" id="l6SubmitBtn" style="width:100%; padding:0.8rem; font-size:1.1rem; border:2px solid var(--panel-border); margin-top:0.5rem;">
                    تقديم التقرير النهائي وإغلاق القضية
                </button>
            </div>
        `;
    }

    const terminalLogEl = document.getElementById('l6TerminalLog');
    const submitBtn = document.getElementById('l6SubmitBtn');

    function appendLog(message, color = 'var(--terminal-green)') {
        const line = document.createElement('div');
        line.style.color = color;
        line.textContent = `> ${message}`;
        terminalLogEl.appendChild(line);
        terminalLogEl.scrollTop = terminalLogEl.scrollHeight;
    }

    // Attach change listeners to log user actions in real-time
    if (isBlue) {
        document.getElementById('l6BlueSuspect').addEventListener('change', (e) => {
            if (e.target.value) {
                appendLog(`Suspect focused: Daniel Roth (ID target)`, 'var(--neon-main)');
                playTickSound();
            }
        });
        document.getElementById('l6BlueTime').addEventListener('change', (e) => {
            if (e.target.value) {
                appendLog(`Time window selected: ${e.target.value}`, 'var(--text-main)');
                playTickSound();
            }
        });
        document.getElementById('l6BlueDirection').addEventListener('change', (e) => {
            if (e.target.value) {
                appendLog(`Direction vector set: ${e.target.value.toUpperCase()}`, 'var(--text-main)');
                playTickSound();
            }
        });
        document.getElementById('l6BlueMark').addEventListener('change', (e) => {
            if (e.target.value) {
                appendLog(`Mark pattern color: ${e.target.value.toUpperCase()}`, 'var(--text-main)');
                playTickSound();
            }
        });
        document.querySelectorAll('.level6-checkbox-item input').forEach(box => {
            box.addEventListener('change', () => {
                appendLog(`Evidence matrix updated: ${box.value.toUpperCase()} = ${box.checked}`, 'var(--text-muted)');
                playTickSound();
            });
        });
    } else {
        document.getElementById('l6RedSuspect').addEventListener('change', (e) => {
            if (e.target.value) {
                appendLog(`Primary subject set: Dr. Victor Hartmann`, 'var(--neon-main)');
                playTickSound();
            }
        });
        document.getElementById('l6RedTimeDeath').addEventListener('change', (e) => {
            if (e.target.value) {
                appendLog(`Death time window: ${e.target.value}`, 'var(--text-main)');
                playTickSound();
            }
        });
        document.getElementById('l6RedTimeMissing').addEventListener('change', (e) => {
            if (e.target.value) {
                appendLog(`Disappearance alert time: ${e.target.value}`, 'var(--text-main)');
                playTickSound();
            }
        });
        document.getElementById('l6RedRoute').addEventListener('change', (e) => {
            if (e.target.value) {
                appendLog(`Transport pathway selected: ${e.target.value.toUpperCase()}`, 'var(--text-main)');
                playTickSound();
            }
        });
        document.getElementById('l6RedDestination').addEventListener('change', (e) => {
            if (e.target.value) {
                appendLog(`Destination terminal chamber: ${e.target.value.toUpperCase()}`, 'var(--text-main)');
                playTickSound();
            }
        });
        document.querySelectorAll('.level6-checkbox-item input').forEach(box => {
            box.addEventListener('change', () => {
                appendLog(`Reconstruction log updated: ${box.value.toUpperCase()} = ${box.checked}`, 'var(--text-muted)');
                playTickSound();
            });
        });
    }

    // Submit Validation Logic
    submitBtn.addEventListener('click', () => {
        if (isLockedOut) return;

        appendLog("Analyzing submission parameters...", "var(--neon-main)");

        let isCorrect = false;

        if (isBlue) {
            const suspect = document.getElementById('l6BlueSuspect').value;
            const time = document.getElementById('l6BlueTime').value;
            const dir = document.getElementById('l6BlueDirection').value;
            const mark = document.getElementById('l6BlueMark').value;
            const ev1 = document.getElementById('l6BlueEv1').checked;
            const ev2 = document.getElementById('l6BlueEv2').checked;
            const ev3 = document.getElementById('l6BlueEv3').checked;
            const ev4 = document.getElementById('l6BlueEv4').checked;
            const ev5 = document.getElementById('l6BlueEv5').checked;

            if (suspect === 'daniel_roth' && 
                time === '02:17' && 
                dir === 'east' && 
                mark === 'black' && 
                ev1 && ev2 && ev3 && 
                !ev4 && !ev5) {
                isCorrect = true;
            }
        } else {
            const suspect = document.getElementById('l6RedSuspect').value;
            const timeDeath = document.getElementById('l6RedTimeDeath').value;
            const timeMissing = document.getElementById('l6RedTimeMissing').value;
            const route = document.getElementById('l6RedRoute').value;
            const dest = document.getElementById('l6RedDestination').value;
            const p1 = document.getElementById('l6RedProof1').checked;
            const p2 = document.getElementById('l6RedProof2').checked;
            const p3 = document.getElementById('l6RedProof3').checked;
            const p4 = document.getElementById('l6RedProof4').checked;
            const p5 = document.getElementById('l6RedProof5').checked;

            if (suspect === 'dr_victor' && 
                timeDeath === '21:49' && 
                timeMissing === '22:08' && 
                route === 'service_corridor' && 
                dest === 'lower_chamber' && 
                p1 && p2 && p3 && 
                !p4 && !p5) {
                isCorrect = true;
            }
        }

        setTimeout(() => {
            if (isCorrect) {
                appendLog("CASE SOLVED. Verification success.", "var(--terminal-green)");
                if (isBlue) {
                    appendLog("THE SERIAL KILLER HAS BEEN IDENTIFIED: DANIEL ROTH", "var(--terminal-green)");
                    showToast("✓ تم كشف هوية القاتل المتسلسل بنجاح!", "success");

                    document.getElementById('stepBInstruction').innerHTML = `
                        <div style="font-size: 1.25rem; font-weight: bold; color: var(--terminal-green); margin-bottom: 0.5rem;">✓ CASE SOLVED - تم حل القضية بالكامل</div>
                        <div style="color: var(--text-main); margin-bottom: 0.6rem; font-size: 1.05rem; font-weight: bold;">
                            تم كشف وتوثيق هوية القاتل المتسلسل: دانيال روث (Daniel Roth).
                        </div>
                        <div style="color: var(--text-muted); font-size: 0.9rem;">
                            تم إنقاذ ملفات القضية وتوثيق السلسلة الجنائية. اضغط على الزر أدناه للحصول على الرمز النهائي لفتح القفل المادي.
                        </div>
                    `;
                } else {
                    appendLog("BODY DISPLACEMENT PATHWAY CONFIRMED: DR. VICTOR HARTMANN", "var(--terminal-green)");
                    showToast("✓ تم كشف مسار نقل الجثة بنجاح!", "success");

                    document.getElementById('stepBInstruction').innerHTML = `
                        <div style="font-size: 1.25rem; font-weight: bold; color: var(--terminal-green); margin-bottom: 0.5rem;">✓ CASE SOLVED - تم حل القضية بالكامل</div>
                        <div style="color: var(--text-main); margin-bottom: 0.6rem; font-size: 1.05rem; font-weight: bold;">
                            تم إثبات نقل جثة المريض 404 بواسطة الدكتور فيكتور هارتمان (Dr. Victor Hartmann) إلى الحجرة السفلية الملحقة بالغرفة 13.
                        </div>
                        <div style="color: var(--text-muted); font-size: 0.9rem;">
                            تم تتبع الجثة وكشف الحقيقة كاملة. اضغط على الزر أدناه للحصول على الرمز النهائي لفتح القفل المادي.
                        </div>
                    `;
                }

                setTimeout(solveStepB, 1800);
            } else {
                playErrorAlarm();
                appendLog("[ERROR] Submission parameters verification failed.", "var(--neon-red)");
                appendLog("[ERROR] Final deduction matrix mismatch.", "var(--neon-red)");
                showToast("فشل التحقق: عناصر الاتهام/التحقيق غير متطابقة. تم حظر لوحة التحكم.", "error");
                triggerGlobalLockout(10);
            }
        }, 1200);
    });
}


// --- VICTORY STATE PANEL ---
function triggerVictoryState() {
    victoryScreen.classList.remove('hidden');
    
    // Stop ambient audio loops
    if (ambientOsc1) ambientOsc1.stop();
    if (ambientOsc2) ambientOsc2.stop();

    // Pull correct passcode
    const finalCode = ENVELOPE_DATA[selectedTeam].finalCode;
    finalLockCode.textContent = finalCode;

    playSuccessChime();
    showToast("تهانينا! تم كسر الحماية النهائية بنجاح.", "success");

    // Trigger premium confetti rain
    if (typeof confetti === 'function') {
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1600 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
}


/* ==========================================================================
   MINI-GAME 5: Level 5 - The Black File (الملف الأسود)
   ========================================================================== */
function initLevel5BlackFileBoard() {
    // 1. Data Definition
    const blueData = [
        { id: "CARD A", time: "23:17", desc: "فتح باب الممر الشرقي. يقول سجل الباب إن الباب فُتح، لكن كاميرا 02 لا تسجل مرور شخص.", letter: "C", verified: true, echo: true },
        { id: "CARD B", time: "23:21", desc: "اتصال وارد لمكتب التحقيق انتهى 23:25:12. ميكروفون المكتب سجل حركة كرسي في 23:23.", letter: "Y", verified: true, echo: true },
        { id: "CARD C", time: "23:27", desc: "بطاقة الموظف #17 دخلت غرفة الملفات. كاميرا الممر سجلت خروج الشخص نفسه من الممر الشرقي قبلها بدقيقتين.", letter: "P", verified: true, echo: true },
        { id: "CARD D", time: "23:31", desc: "باب المختبر فُتح 19 ثانية. سجل الإنذار يؤكد أن الباب لم يُفتح من الداخل.", letter: "H", verified: true, echo: true },
        { id: "CARD E", time: "23:36", desc: "التقاط صورة الدليل #221. ساعة الكاميرا وساعة الخادم متزامنتان، لكن ساعة الحائط في الصورة لا تطابقهما.", letter: "E", verified: true, echo: false },
        { id: "CARD F", time: "23:42", desc: "اتصال صادر من مكتب التحقيق يبدأ 23:42:11. سجل المقسم يطابق البداية والنهاية.", letter: "R", verified: true, echo: true },
        { id: "CARD G", time: "23:49", desc: "قفل الممر الشرقي. السجل الرقمي يحمل توقيعاً صحيحاً، لكن النسخة المطبوعة لا تحمل توقيع المشرف.", letter: "M", verified: false, echo: false },
        { id: "CARD H", time: "23:27", desc: "بطاقة الموظف #17. رقم البطاقة صحيح، لكن سجل الخادم يضعها في غرفة 07 بدلاً من غرفة الملفات.", letter: "Q", verified: false, echo: false }
    ];

    const redData = [
        { id: "CARD A", time: "21:49", desc: "باب الجناح 13 فُتح. سجل الطاقة يثبت تشغيل قفل الباب في اللحظة نفسها.", letter: "G", verified: true, echo: true },
        { id: "CARD B", time: "21:53", desc: "العينة 404-A سُحبت. سجل الثلاجة يسجل إدخال العينة بعد 21:53 مباشرة.", letter: "H", verified: true, echo: true },
        { id: "CARD C", time: "22:01", desc: "جهاز التخدير يعمل. سجل الصيانة يسجل دورة تشغيل بدأت 22:01:08.", letter: "O", verified: true, echo: true },
        { id: "CARD D", time: "22:07", desc: "الكاميرا 13 انقطعت. سجل الشبكة يؤكد انقطاع 41 ثانية.", letter: "S", verified: true, echo: true },
        { id: "CARD E", time: "22:12", desc: "إغلاق الجناح. سجل الطاقة لا يسجل أي فتح حتى 22:24.", letter: "T", verified: true, echo: true },
        { id: "CARD F", time: "22:18", desc: "توقيع V.H. موجود على الورقة، لكن سجل القلم الرقمي يضع التوقيع في 22:41.", letter: "L", verified: false, echo: false },
        { id: "CARD G", time: "22:24", desc: "باب الخدمة فُتح. سجل الكاميرا الخلفية لا يرى الباب، لكن حساس القفل يؤكد الفتح.", letter: "N", verified: false, echo: false },
        { id: "CARD H", time: "22:31", desc: "باب الخدمة أُغلق. سجل الحساس صحيح، لكن توقيت نسخة الورق متأخر 7 دقائق.", letter: "Q", verified: false, echo: false }
    ];

    const targetCards = selectedTeam === 'blue' ? blueData : redData;
    const numSlots = selectedTeam === 'blue' ? 6 : 5;

    // 2. State Management
    let userClassifications = {};
    targetCards.forEach(card => {
        userClassifications[card.id] = {
            status: 'unclassified', // 'verified', 'rejected'
            isEcho: false
        };
    });

    let timelineSlots = Array(numSlots).fill(null); // stores card IDs
    let selectedCard = null;
    let currentHintIdx = 0;

    const hints = [
        "قبل أن تبحث عن كلمة، حدّد أي الأحداث يمكن إثباتها.",
        "الدليل الواحد لا يكفي.",
        "ابحث عن مصدر مستقل يؤكد الحدث نفسه.",
        "بعد التحقق، رتّب الأحداث زمنيًا.",
        "أنت حصلت على كلمة... لكن الملف لم ينتهِ.",
        "ما الذي تكرر فعلًا في مصدر مستقل؟",
        "ليس كل Verified Event هو Echo."
    ];

    // 3. Render HTML Layout inside digitalPuzzleArea
    digitalPuzzleArea.innerHTML = `
        <div class="level5-board">
            <div class="level5-main-layout">
                <!-- LEFT: Evidence List -->
                <div class="level5-panel">
                    <div class="level5-panel-title">
                        <span>قائمة الأدلة</span>
                        <span style="font-size:0.75rem; opacity:0.7;">Evidence List</span>
                    </div>
                    <div class="level5-evidence-list" id="l5EvidenceList"></div>
                </div>

                <!-- CENTER: Timeline & Board -->
                <div class="level5-panel" style="gap:0.8rem;">
                    <div class="level5-panel-title">
                        <span>لوحة التحقيق الجنائي والترتيب الزمني</span>
                        <button type="button" class="terminal-btn" id="l5HintBtn" style="padding: 2px 10px; font-size: 0.8rem;">طلب تلميح 💡</button>
                    </div>

                    <div style="font-size:0.8rem; color:var(--text-muted); line-height:1.5;">
                        قم بتصنيف كل بطاقة على اليمين (مؤكد أو مستبعد). الكروت المؤكدة فقط تظهر في الخيارات لوضعها في الخط الزمني الأدناه لترتيبها زمنياً من الأقدم إلى الأحدث.
                    </div>

                    <!-- Timeline Slots -->
                    <div class="level5-timeline" id="l5Timeline"></div>

                    <!-- Extracted Word -->
                    <div class="level5-extracted-container">
                        <span>الكلمة المستخرجة:</span>
                        <span class="level5-extracted-word" id="l5ExtractedWord">------</span>
                    </div>

                    <!-- Terminal Status / Logs -->
                    <div class="level5-terminal-log" id="l5TerminalLog">
                        <div>[SYSTEM] File L5 Decryption Engine initialized.</div>
                        <div>[SYSTEM] Awaiting forensic input classification...</div>
                    </div>
                </div>

                <!-- RIGHT: Detail / Verification Panel -->
                <div class="level5-panel">
                    <div class="level5-panel-title">
                        <span>تفاصيل الدليل</span>
                        <span style="font-size:0.75rem; opacity:0.7;">Evidence Details</span>
                    </div>
                    <div class="level5-details-box" id="l5DetailsBox"></div>
                </div>
            </div>

            <!-- BOTTOM: Submit Button -->
            <button type="button" class="terminal-btn" id="l5SubmitBtn" style="width: 100%; padding: 0.8rem 1.5rem; font-size: 1.1rem; margin-top: 0.5rem; border: 2px solid var(--panel-border);">
                تقديم التحقيق الجنائي وتأكيد السلسلة الجنائية
            </button>
        </div>
    `;

    const evidenceListEl = document.getElementById('l5EvidenceList');
    const timelineEl = document.getElementById('l5Timeline');
    const detailsBoxEl = document.getElementById('l5DetailsBox');
    const extractedWordEl = document.getElementById('l5ExtractedWord');
    const terminalLogEl = document.getElementById('l5TerminalLog');
    const submitBtn = document.getElementById('l5SubmitBtn');
    const hintBtn = document.getElementById('l5HintBtn');

    // 4. Update Terminal Log Helper
    function appendLog(message, color = 'var(--terminal-green)') {
        const line = document.createElement('div');
        line.style.color = color;
        line.textContent = `> ${message}`;
        terminalLogEl.appendChild(line);
        terminalLogEl.scrollTop = terminalLogEl.scrollHeight;
    }

    // 5. Hint Mechanism
    hintBtn.addEventListener('click', () => {
        if (isLockedOut) return;
        const hint = hints[currentHintIdx];
        appendLog(`[HINT] ${hint}`, 'var(--neon-main)');
        currentHintIdx = (currentHintIdx + 1) % hints.length;
        playTickSound();
    });

    // 6. Timeline Slot Choice Handler
    function openSlotSelectionModal(slotIndex) {
        if (isLockedOut) return;

        // Get all cards classified as verified
        const verifiedCardIds = targetCards
            .filter(card => userClassifications[card.id].status === 'verified')
            .map(card => card.id);

        if (verifiedCardIds.length === 0) {
            showToast("يجب تصنيف دليل واحد على الأقل كـ (مؤكد) ليظهر في خيارات الخط الزمني.", "error");
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'level5-modal-overlay';

        overlay.innerHTML = `
            <div class="level5-modal">
                <div class="level5-modal-title">اختر الدليل المناسب للسلسلة:</div>
                <div class="level5-modal-options">
                    <div class="level5-modal-option" data-card-id="REMOVE" style="color:var(--neon-red); font-weight:bold; justify-content:center;">
                        [ إزالة الكارت من هذه الخانة ]
                    </div>
                    ${targetCards.map(card => {
                        const isVerified = userClassifications[card.id].status === 'verified';
                        if (!isVerified) return '';
                        return `
                            <div class="level5-modal-option" data-card-id="${card.id}">
                                <span>${card.id} (${card.time})</span>
                                <span style="font-weight:bold; color:var(--neon-main);">${card.letter}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <button type="button" class="terminal-btn level5-modal-close" id="l5ModalCloseBtn">إلغاء</button>
            </div>
        `;

        document.body.appendChild(overlay);

        const options = overlay.querySelectorAll('.level5-modal-option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                const cardId = opt.getAttribute('data-card-id');
                if (cardId === 'REMOVE') {
                    timelineSlots[slotIndex] = null;
                    appendLog(`Slot ${slotIndex + 1} cleared.`);
                } else {
                    // Check if card is already placed elsewhere, and clear it
                    const existingIdx = timelineSlots.indexOf(cardId);
                    if (existingIdx !== -1) {
                        timelineSlots[existingIdx] = null;
                    }
                    timelineSlots[slotIndex] = cardId;
                    const card = targetCards.find(c => c.id === cardId);
                    appendLog(`Slot ${slotIndex + 1} assigned to ${cardId} (${card.time}).`);
                }
                overlay.remove();
                playTickSound();
                renderTimeline();
                updateExtractedWord();
            });
        });

        const closeBtn = overlay.querySelector('#l5ModalCloseBtn');
        closeBtn.addEventListener('click', () => {
            overlay.remove();
            playTickSound();
        });
    }

    // 7. Update Extracted Word Helper
    function updateExtractedWord() {
        let word = '';
        for (let i = 0; i < numSlots; i++) {
            const cardId = timelineSlots[i];
            if (cardId) {
                const card = targetCards.find(c => c.id === cardId);
                word += card.letter;
            } else {
                word += '_';
            }
        }
        extractedWordEl.textContent = word;
    }

    // 8. Render List of Cards
    function renderEvidenceList() {
        evidenceListEl.innerHTML = targetCards.map(card => {
            const classif = userClassifications[card.id];
            let badgeClass = 'badge-unclassified';
            let badgeText = 'غير مصنف';
            if (classif.status === 'verified') {
                badgeClass = 'badge-verified';
                badgeText = 'مؤكد ✓';
            } else if (classif.status === 'rejected') {
                badgeClass = 'badge-rejected';
                badgeText = 'مستبعد ✗';
            }

            const itemClass = `level5-evidence-item ${classif.status} ${selectedCard && selectedCard.id === card.id ? 'selected' : ''}`;

            return `
                <div class="${itemClass}" data-card-id="${card.id}">
                    <span style="font-family:'Share Tech Mono', monospace; font-weight:bold;">${card.id}</span>
                    <span class="level5-badge ${badgeClass}">${badgeText}</span>
                </div>
            `;
        }).join('');

        // Bind clicks
        evidenceListEl.querySelectorAll('.level5-evidence-item').forEach(item => {
            item.addEventListener('click', () => {
                const cardId = item.getAttribute('data-card-id');
                selectedCard = targetCards.find(c => c.id === cardId);
                playTickSound();
                renderEvidenceList();
                renderDetails();
            });
        });
    }

    // 9. Render Timeline Slots
    function renderTimeline() {
        timelineEl.innerHTML = '';
        for (let i = 0; i < numSlots; i++) {
            const cardId = timelineSlots[i];
            const slot = document.createElement('div');
            slot.className = `level5-timeline-slot ${cardId ? 'filled' : ''}`;
            slot.dataset.index = i;

            if (cardId) {
                const card = targetCards.find(c => c.id === cardId);
                slot.innerHTML = `
                    <div class="level5-slot-number">SLOT ${i + 1}</div>
                    <div class="level5-slot-letter">${card.letter}</div>
                    <div class="level5-slot-time">${card.time}</div>
                `;
            } else {
                slot.innerHTML = `
                    <div class="level5-slot-number">SLOT ${i + 1}</div>
                    <div style="font-size:1.8rem; opacity:0.3; font-weight:bold;">?</div>
                    <div style="font-size:0.7rem; color:var(--text-muted);">انقر للاختيار</div>
                `;
            }

            slot.addEventListener('click', () => {
                openSlotSelectionModal(i);
            });

            timelineEl.appendChild(slot);
        }
    }

    // 10. Render Right Details Panel
    function renderDetails() {
        if (!selectedCard) {
            detailsBoxEl.innerHTML = `
                <div class="level5-details-empty">
                    <span>💡 اختر بطاقة أثر من القائمة الجانبية لعرض محتوياتها الجنائية وإجراء التحقق.</span>
                </div>
            `;
            return;
        }

        const classif = userClassifications[selectedCard.id];

        detailsBoxEl.innerHTML = `
            <div class="level5-details-content">
                <div class="level5-details-field">
                    <span class="level5-field-label">رقم الدليل</span>
                    <span class="level5-field-value highlight">${selectedCard.id}</span>
                </div>
                <div class="level5-details-field">
                    <span class="level5-field-label">الوقت المسجل</span>
                    <span class="level5-field-value highlight">${selectedCard.time}</span>
                </div>
                <div class="level5-details-field">
                    <span class="level5-field-label">الحرف المشفر</span>
                    <span class="level5-field-value highlight">${selectedCard.letter}</span>
                </div>
                <div class="level5-details-field">
                    <span class="level5-field-label">محتوى الأثر</span>
                    <span class="level5-field-value" style="font-size: 0.85rem;">${selectedCard.desc}</span>
                </div>

                <div style="border-top: 1px solid var(--panel-border); margin: 0.5rem 0; padding-top: 0.5rem;"></div>

                <div class="level5-field-label" style="margin-bottom: 0.4rem;">تصنيف موثوقية الأثر:</div>
                <div style="display:flex; gap:0.5rem;">
                    <button type="button" class="level5-action-btn btn-verify ${classif.status === 'verified' ? 'active' : ''}" id="btnVerifyCard">
                        مؤكد ✓
                    </button>
                    <button type="button" class="level5-action-btn btn-reject ${classif.status === 'rejected' ? 'active' : ''}" id="btnRejectCard">
                        مستبعد ✗
                    </button>
                </div>

                <div class="level5-echo-switch">
                    <div class="level5-echo-label">
                        <span class="level5-echo-title">له صدى مستقل (Echo)</span>
                        <span class="level5-echo-desc">يتطابق مع مصدرين مستقلين</span>
                    </div>
                    <input type="checkbox" class="level5-echo-checkbox" id="echoCheckbox" ${classif.isEcho ? 'checked' : ''}>
                </div>
            </div>
        `;

        // Bind verification buttons
        const btnVerify = detailsBoxEl.querySelector('#btnVerifyCard');
        const btnReject = detailsBoxEl.querySelector('#btnRejectCard');
        const echoCheckbox = detailsBoxEl.querySelector('#echoCheckbox');

        btnVerify.addEventListener('click', () => {
            if (isLockedOut) return;
            userClassifications[selectedCard.id].status = 'verified';
            appendLog(`${selectedCard.id} marked as VERIFIED.`);
            playTickSound();
            renderEvidenceList();
            renderDetails();
            renderTimeline();
        });

        btnReject.addEventListener('click', () => {
            if (isLockedOut) return;
            userClassifications[selectedCard.id].status = 'rejected';
            // If it was in the timeline, remove it
            const idx = timelineSlots.indexOf(selectedCard.id);
            if (idx !== -1) {
                timelineSlots[idx] = null;
                renderTimeline();
                updateExtractedWord();
            }
            appendLog(`${selectedCard.id} marked as REJECTED.`);
            playTickSound();
            renderEvidenceList();
            renderDetails();
        });

        echoCheckbox.addEventListener('change', (e) => {
            if (isLockedOut) {
                e.preventDefault();
                echoCheckbox.checked = classif.isEcho;
                return;
            }
            userClassifications[selectedCard.id].isEcho = e.target.checked;
            appendLog(`${selectedCard.id} Echo property set to ${e.target.checked}.`);
            playTickSound();
        });
    }

    // 11. Submit / Verification Logic
    submitBtn.addEventListener('click', () => {
        if (isLockedOut) return;

        appendLog("System checking forensic logic alignment...", "var(--neon-main)");

        // 11a. Check Classification correctness
        let classificationError = false;
        let incorrectVerified = [];
        let incorrectRejected = [];

        targetCards.forEach(card => {
            const classif = userClassifications[card.id];
            if (card.verified && classif.status !== 'verified') {
                classificationError = true;
                incorrectVerified.push(card.id);
            }
            if (!card.verified && classif.status !== 'rejected') {
                classificationError = true;
                incorrectRejected.push(card.id);
            }
        });

        // 11b. Check Timeline correctness
        let timelineError = false;
        // Correct chronological order cards: A to F (for blue) or A to E (for red)
        for (let i = 0; i < numSlots; i++) {
            const slotCardId = timelineSlots[i];
            const expectedCard = targetCards[i]; // cards are defined in chronological order in array
            if (!slotCardId || slotCardId !== expectedCard.id) {
                timelineError = true;
            }
        }

        // 11c. Check Echo correctness
        let echoError = false;
        let cardEHasEchoSelected = false;

        targetCards.forEach(card => {
            const classif = userClassifications[card.id];
            if (card.echo !== classif.isEcho) {
                echoError = true;
            }
            // For Blue Team card E check
            if (selectedTeam === 'blue' && card.id === 'CARD E' && classif.isEcho) {
                cardEHasEchoSelected = true;
            }
        });

        // Evaluate Results
        setTimeout(() => {
            if (!classificationError && !timelineError && !echoError) {
                // SUCCESS SCREEN
                appendLog("Forensic chain verified successfully.", "var(--terminal-green)");
                appendLog("BLACK FILE DECRYPTED.", "var(--terminal-green)");
                appendLog("Evidence chain reconstructed.", "var(--terminal-green)");
                appendLog("LEVEL 6 ACCESS GRANTED.", "var(--terminal-green)");
                
                showToast("✓ تم فك تشفير الملف الأسود بنجاح!", "success");

                // Customize Step B instruction after success
                document.getElementById('stepBInstruction').innerHTML = `
                    <div style="font-size: 1.25rem; font-weight: bold; color: var(--terminal-green); margin-bottom: 0.5rem;">✓ BLACK FILE DECRYPTED</div>
                    <div style="color: var(--text-main); margin-bottom: 0.6rem; font-size: 1.05rem; font-weight: bold;">
                        تم ربط السلسلة الزمنية بنجاح. كل شيء قمت بحله حتى الآن يشير إلى حدث واحد مشترك...
                    </div>
                    <div style="color: var(--text-muted); font-size: 0.9rem;">
                        تم كشف الحقيقة جزئياً. استعد لفك تشفير بروتوكول الأمان الأخير.
                    </div>
                `;

                setTimeout(solveStepB, 1800);
            } else {
                // FAILURE / Lockout
                playErrorAlarm();
                
                if (classificationError) {
                    appendLog("[ERROR] Evidence classification mismatch.", "var(--neon-red)");
                }
                if (timelineError) {
                    appendLog("[ERROR] Timeline chronological mismatch.", "var(--neon-red)");
                }
                if (echoError) {
                    appendLog("[ERROR] Echo independent confirmation mismatch.", "var(--neon-red)");
                    if (cardEHasEchoSelected) {
                        appendLog("[WARNING] VERIFIED does not always mean ECHO.", "var(--neon-red)");
                        showToast("تنبيه: مؤكد (VERIFIED) لا يعني دائماً صدى مستقل (ECHO).", "error");
                    }
                }

                if (!cardEHasEchoSelected || (!classificationError && !timelineError)) {
                    showToast("فشل التحقق: السلسلة الجنائية غير متطابقة. تم حظر لوحة التحكم.", "error");
                }

                triggerGlobalLockout(10);
            }
        }, 1200);
    });

    // 12. Run Initial Layout Render
    renderEvidenceList();
    renderTimeline();
    renderDetails();
}


// Start Dashboard Routine
// Make sure colors are applied immediately when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    // DOM is already loaded
    initDashboard();
}

window.onload = function() {
    console.log('Dashboard fully loaded');
};
