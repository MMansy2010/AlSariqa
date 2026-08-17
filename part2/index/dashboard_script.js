const ENVELOPE_DATA = {
    blue: {
        passwords: ["8143", "BLUE_DECRYPT_2", "MATRIX_KEY_3", "SIGNAL_LOCK_4", "CYPHER_ECHO_5", "FINAL_SYSTEM_6"],
        locations: [
            "🔎 تم مطابقة الصوت بنجاح! الظرف رقم (2) مخبأ خلف الستارة البيضاء.",
            "🔎 ممتاز! الظرف رقم (3) مخبأ تحت لوحة المفاتيح الاحتياطية في غرفة التحكم.",
            "🔎 ممتاز! الظرف رقم (4) مخبأ داخل كتاب 'تاريخ البرمجة' على الرف الخشبي.",
            "🔎 ممتاز! الظرف رقم (5) مخبأ تحت كرسي قائد الفريق في غرفة العمليات.",
            "🔎 ممتاز! الظرف رقم (6) مخبأ داخل علبة الإسعافات الأولية المعلقة على الحائط.",
            "🏁 لقد فككت تشفير كل الأظرفة بنجاح! هذا هو الرمز النهائي لفتح صندوق القفل الفعلي."
        ],
        finalCode: "1984"
    },
    red: {
        passwords: ["531", "RED_DECRYPT_2", "CORRUPT_KEY_3", "ALARM_LOCK_4", "GHOST_ECHO_5", "FINAL_OVERRIDE_6"],
        locations: [
            "🔎 تم استقرار الدائرة الكهربائية! الظرف رقم (2) مخبأ أسفل طاولة الطعام.",
            "🔎 ممتاز! الظرف رقم (3) مخبأ خلف مرآة الحمام الرئيسي.",
            "🔎 ممتاز! الظرف رقم (4) مخبأ داخل الميكروويف في المطبخ.",
            "🔎 ممتاز! الظرف رقم (5) مخبأ خلف شاشة التلفاز في غرفة المعيشة.",
            "🔎 ممتاز! الظرف رقم (6) مخبأ تحت فازة الزهور الكبيرة بجوار الباب.",
            "🏁 لقد فككت تشفير كل الأظرفة بنجاح! هذا هو الرمز النهائي لفتح صندوق القفل الفعلي."
        ],
        finalCode: "2077"
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
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = 3600 - elapsed; // 60 minutes total

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


// --- INITIALIZATION ---
function initDashboard() {
    // 1. Display state
    leaderDisplay.textContent = leaderName;
    teamDisplay.textContent = selectedTeam === 'blue' ? "الفريق الأزرق" : "الفريق الأحمر";
    
    // Set theme custom variable
    const themeColor = selectedTeam === 'blue' ? 'var(--neon-blue)' : 'var(--neon-red)';
    const borderColor = selectedTeam === 'blue' ? 'rgba(0, 243, 255, 0.25)' : 'rgba(255, 0, 85, 0.25)';
    root.style.setProperty('--neon-main', themeColor);
    root.style.setProperty('--panel-border', borderColor);

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

function loadLevel(level) {
    if (level >= 6) {
        triggerVictoryState();
        return;
    }

    // Update Briefing Text
    envelopeBriefing.textContent = BRIEFINGS[level];

    // Reset Workspace Elements and render digit boxes dynamically
    const correctPass = ENVELOPE_DATA[selectedTeam].passwords[level];
    renderDigitInputs(correctPass.length);

    stepAError.textContent = '';
    stepABox.classList.remove('hidden');
    stepBBox.classList.add('hidden');
    successBox.classList.add('hidden');

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
    const inputs = digitInputContainer.querySelectorAll('.digit-input');
    let value = '';
    inputs.forEach(input => {
        value += input.value.trim();
    });
    return value.toUpperCase();
}

// --- Dynamic Digit Inputs Renderer ---
function renderDigitInputs(length) {
    digitInputContainer.innerHTML = '';
    for (let i = 0; i < length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.inputMode = 'numeric';
        input.maxLength = 1;
        input.className = 'digit-input';
        input.dataset.index = i;

        input.addEventListener('input', (e) => {
            const val = e.target.value;
            // Clean value, allow only digits
            if (!/^[0-9]$/.test(val)) {
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
    const userInput = getStepAValue();
    const correctPass = ENVELOPE_DATA[selectedTeam].passwords[currentLevel];

    if (userInput === correctPass) {
        playSuccessChime();
        stepABox.classList.add('hidden');
        stepBBox.classList.remove('hidden');
        
        // Focus or activate the digital puzzle
        showToast("نجاح: تم التحقق من الرمز المادي للظرف. بروتوكول الأمان الرقمي قيد التجهيز...", "success");
    } else {
        playErrorAlarm();
        stepAError.textContent = "رمز فك التشفير غير صالح. حاول مرة أخرى للتطابق مع قاعدة البيانات.";
        showToast("خطأ: تطابق الرمز المادي فشل!", "error");
        
        // Clear digits and focus first
        const inputs = digitInputContainer.querySelectorAll('.digit-input');
        inputs.forEach(input => input.value = '');
        const firstInput = digitInputContainer.querySelector('.digit-input[data-index="0"]');
        if (firstInput) firstInput.focus();
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
            initCircuitBalancingGame();
            break;
        case 2:
            initFrequencyTuningGame();
            break;
        case 3:
            initSequenceMatchingGame();
            break;
        case 4:
            initHexSearchGame();
            break;
        case 5:
            initReactorOverloadGame();
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
    nextLocationText.textContent = nextLoc;
    
    showToast("نجاح: تم تجاوز الحماية الرقمية! موقع التوثيق التالي متاح الآن.", "success");
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
    document.getElementById('stepBInstruction').textContent = "الرمز صحيح! تطابق البصمة الصوتية للقاتل المتسلسل مع العينة المستهدفة للوصول إلى الملفات:";

    digitalPuzzleArea.innerHTML = `
        <div class="voiceprint-container">
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
            <div class="voice-sample-grid">
                <button class="voice-btn" data-wave="1">🔊 عينة الصوت 1</button>
                <button class="voice-btn" data-wave="2">🔊 عينة الصوت 2</button>
                <button class="voice-btn" data-wave="3">🔊 عينة الصوت 3 (المتطابقة)</button>
                <button class="voice-btn" data-wave="4">🔊 عينة الصوت 4</button>
            </div>
        </div>
    `;

    const btns = digitalPuzzleArea.querySelectorAll('.voice-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const waveNum = btn.getAttribute('data-wave');
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (waveNum === "3") {
                playSynthTone(500, 'sine', 0.2, 0.1);
                setTimeout(() => playSynthTone(750, 'sine', 0.3, 0.1), 150);
                showToast("تطابق البصمة الصوتية بنسبة 99.8%! تم التأكيد.", "success");
                setTimeout(solveStepB, 1500);
            } else {
                playSynthTone(120, 'sawtooth', 0.4, 0.15);
                showToast("فشل المطابقة: تردد غير متوافق مع العينة المستهدفة.", "error");
            }
        });
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
            playSynthTone(600, 'sine', 0.05, 0.05);
            wires.forEach(w => w.classList.remove('selected'));
            wire.classList.add('selected');
            selectedWire = wire.getAttribute('data-color');
        });
    });

    slots.forEach(slot => {
        slot.addEventListener('click', () => {
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
                showToast("تنبيه: الجهد الكهربي غير صحيح أو الدائرة غير مكتملة.", "error");
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
                showToast("صدمة كهربائية! خطأ في تسلسل الأسلاك. جاري إعادة المحاولة.", "error");
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
        </div>
    `;

    const nodes = digitalPuzzleArea.querySelectorAll('.circuit-node');
    const sumDisplay = document.getElementById('currentSumVal');

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            playSynthTone(700, 'triangle', 0.08, 0.05);
            node.classList.toggle('active');

            const val = parseInt(node.getAttribute('data-val'));
            if (node.classList.contains('active')) {
                currentSum += val;
            } else {
                currentSum -= val;
            }

            sumDisplay.textContent = currentSum;

            if (currentSum === targetVal) {
                setTimeout(solveStepB, 500);
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
            <input type="range" min="100" max="1000" value="100" class="wave-slider" id="freqSlider">
        </div>
    `;

    const canvas = document.getElementById('frequencyCanvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('freqSlider');
    const freqDisplay = document.getElementById('currentFreq');

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
        currentVal = parseInt(e.target.value);
        freqDisplay.textContent = currentVal;

        // Feedback tone (dynamic pitch scaling)
        playSynthTone(currentVal, 'sine', 0.02, 0.03);

        // Check tuning within range of +/- 15Hz
        if (Math.abs(currentVal - targetFreq) <= 15) {
            isSolved = true;
            slider.disabled = true;
            slider.style.opacity = '0.5';
            setTimeout(solveStepB, 600);
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
                showToast("فشل المطابقة! تكرار الرمز الصوتي خطأ.", "error");
                userIdx = 0;
                // Replay sequence
                setTimeout(() => {
                    playIdx = 0;
                    playSeq();
                }, 1000);
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
                const val = cell.getAttribute('data-val');
                if (val === targetHex) {
                    cell.style.background = "var(--terminal-green)";
                    cell.style.color = "#000";
                    setTimeout(solveStepB, 500);
                } else {
                    cell.style.background = "var(--neon-red)";
                    showToast("خطأ: تم الكشف عن عنوان وصول غير صالح! إعادة تشفير المصفوفة.", "error");
                    setTimeout(drawGrid, 800); // Redraw
                }
            });
        });
    }

    drawGrid();
}


/* ==========================================================================
   MINI-GAME 6: Reactor Overload Stabilizer
   ========================================================================== */
function initReactorOverloadGame() {
    document.getElementById('stepBInstruction').textContent = "الرمز صحيح! مفاعل النظام على وشك الانفجار. استقر العقد غير المستقرة لمنع الضغط الكلي (100%):";

    digitalPuzzleArea.innerHTML = `
        <div class="reactor-grid">
            <div class="reactor-node" id="rn0"><div class="reactor-fill"></div><span>SYS1</span></div>
            <div class="reactor-node" id="rn1"><div class="reactor-fill"></div><span>SYS2</span></div>
            <div class="reactor-node" id="rn2"><div class="reactor-fill"></div><span>SYS3</span></div>
            <div class="reactor-node" id="rn3"><div class="reactor-fill"></div><span>SYS4</span></div>
            <div class="reactor-node" id="rn4"><div class="reactor-fill"></div><span>SYS5</span></div>
        </div>
        <div class="circuit-sum-display" style="margin-top: 1rem;">الاستقرار الحالي: <span id="stabilizedCount">0</span> / 10</div>
    `;

    const nodes = [
        { el: document.getElementById('rn0'), fill: 20 },
        { el: document.getElementById('rn1'), fill: 40 },
        { el: document.getElementById('rn2'), fill: 10 },
        { el: document.getElementById('rn3'), fill: 50 },
        { el: document.getElementById('rn4'), fill: 30 }
    ];

    const stabDisplay = document.getElementById('stabilizedCount');
    let successfulClicks = 0;
    let gameOver = false;

    // Run dynamic fill loop
    const fillInterval = setInterval(() => {
        if (gameOver) return;
        
        nodes.forEach(node => {
            if (node.el.classList.contains('stable')) return;
            node.fill += Math.floor(Math.random() * 5) + 3; // Fill increase
            node.el.querySelector('.reactor-fill').style.height = `${node.fill}%`;

            if (node.fill >= 100) {
                gameOver = true;
                clearInterval(fillInterval);
                playErrorAlarm();
                showToast("انفجار المفاعل! إعادة تشغيل نظام حماية النواة.", "error");
                setTimeout(initReactorOverloadGame, 1000);
            }
        });
    }, 120);

    nodes.forEach(node => {
        node.el.addEventListener('click', () => {
            if (gameOver) return;
            playSynthTone(400, 'triangle', 0.1, 0.1);
            node.fill = 0; // Reset fill
            node.el.querySelector('.reactor-fill').style.height = `0%`;
            
            successfulClicks++;
            stabDisplay.textContent = successfulClicks;

            if (successfulClicks >= 10) {
                gameOver = true;
                clearInterval(fillInterval);
                setTimeout(solveStepB, 500);
            }
        });
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
}


// Start Dashboard Routine
window.onload = initDashboard;
