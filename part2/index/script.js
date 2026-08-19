// --- Advanced Web Audio API Synthesizer (Spooky & Cyber Ambient) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let ambientOsc1, ambientOsc2, ambientGain;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
        startAmbientDrone();
    }
}

// Low-frequency horror ambient drone
function startAmbientDrone() {
    try {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        // Two low-frequency detuned oscillators for spooky beating effect (Rumble)
        ambientOsc1 = audioCtx.createOscillator();
        ambientOsc2 = audioCtx.createOscillator();
        ambientGain = audioCtx.createGain();

        ambientOsc1.type = 'sine';
        ambientOsc1.frequency.setValueAtTime(50, audioCtx.currentTime); // 50 Hz rumble

        ambientOsc2.type = 'sine';
        ambientOsc2.frequency.setValueAtTime(50.4, audioCtx.currentTime); // Detuned by 0.4 Hz for eerie pulse

        // LFO (Low Frequency Oscillator) to modulate the volume (breathing effect)
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.15, audioCtx.currentTime); // very slow breathing (0.15Hz)

        lfoGain.gain.setValueAtTime(0.04, audioCtx.currentTime); // volume range modifier

        // Connect LFO to ambient gain
        lfo.connect(lfoGain);
        lfoGain.connect(ambientGain.gain);

        // Base volume
        ambientGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

        ambientOsc1.connect(ambientGain);
        ambientOsc2.connect(ambientGain);
        ambientGain.connect(audioCtx.destination);

        lfo.start();
        ambientOsc1.start();
        ambientOsc2.start();
    } catch (e) {
        console.error("Audio init error:", e);
    }
}

// Short sci-fi synthetic click
function playClick() {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
}

// Spooky synth hover tick
function playHover() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
}

// Horror glitch/buzz error sound
function playError() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(130, now);
    osc1.frequency.linearRampToValueAtTime(80, now + 0.35);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(132, now);
    osc2.frequency.linearRampToValueAtTime(82, now + 0.35);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
}

// Success sci-fi chiming arpeggio
function playSuccess() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5 arpeggio
    
    notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.1, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
    });
}

// Initialize audio on first click or touch
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });


// --- UI and Logic Handling ---
const root = document.documentElement;
const clockEl = document.getElementById('digitalClock');
const leaderInput = document.getElementById('leaderName');
const teamRadios = document.getElementsByName('team');
const membersSection = document.getElementById('membersSection');
const memberNameInput = document.getElementById('memberName');
const addMemberBtn = document.getElementById('addMemberBtn');
const membersBadges = document.getElementById('membersBadges');
const startBtn = document.getElementById('startProtocolBtn');
const toastContainer = document.getElementById('toastContainer');

let teamMembers = [];
let selectedTeam = null;

// --- Ticking Digital Clock with Milliseconds ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds}:${ms}`;
}
setInterval(updateClock, 33); // High resolution tick for millisecond updates

// --- Add sound effects to inputs & cards ---
document.querySelectorAll('input, button, .team-card').forEach(el => {
    el.addEventListener('mouseenter', playHover);
});
document.querySelectorAll('input[type="text"]').forEach(el => {
    el.addEventListener('focus', playClick);
});

// --- Dynamic Team Theme Switcher ---
teamRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        playClick();
        selectedTeam = e.target.value;

        if (selectedTeam === 'blue') {
            root.style.setProperty('--neon-main', 'var(--neon-blue)');
            root.style.setProperty('--panel-border', 'rgba(0, 243, 255, 0.25)');
        } else if (selectedTeam === 'red') {
            root.style.setProperty('--neon-main', 'var(--neon-red)');
            root.style.setProperty('--panel-border', 'rgba(255, 0, 85, 0.25)');
        }

        // Smoothly reveal the members section
        membersSection.classList.remove('hidden');
    });
});

// --- Team Members Badge Logic ---
function renderMembers() {
    membersBadges.innerHTML = '';
    teamMembers.forEach((member, index) => {
        const badge = document.createElement('div');
        badge.className = 'badge';
        badge.innerHTML = `
            <span>${member}</span>
            <span class="remove-btn" onclick="removeMember(${index})">×</span>
        `;
        membersBadges.appendChild(badge);
    });
}

window.removeMember = function(index) {
    playClick();
    teamMembers.splice(index, 1);
    renderMembers();
};

addMemberBtn.addEventListener('click', () => {
    const name = memberNameInput.value.trim();
    if (name) {
        playClick();
        teamMembers.push(name);
        memberNameInput.value = '';
        renderMembers();
        memberNameInput.focus();
    }
});

memberNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addMemberBtn.click();
    }
});

// --- Custom Cyber Toast Notification ---
function showToast(message, type = 'error') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon selection
    const icon = type === 'error' ? '⚠️' : '⚡';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    
    if (type === 'error') {
        playError();
    } else {
        playSuccess();
    }

    // Auto-remove toast after animation completes
    setTimeout(() => {
        toast.style.animation = 'toast-slide 0.3s cubic-bezier(0.19, 1, 0.22, 1) reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 2700);
}

// --- Submit & Redirect Validation ---
startBtn.addEventListener('click', () => {
    const leaderName = leaderInput.value.trim();

    if (!leaderName) {
        showToast('فشل التفعيل: يجب إدخال اسم قائد ملف التحقيق لتوثيق الهوية.');
        leaderInput.focus();
        return;
    }

    if (!selectedTeam) {
        showToast('فشل التفعيل: يرجى تفويض الفرقة المختصة (الأزرق أو الأحمر).');
        return;
    }

    // Success Sequence
    playSuccess();
    
    startBtn.innerHTML = `
        <span class="glitch-btn-text">جاري بدء التحقيق...</span>
        <span class="btn-status">DECRYPTING_FILES_100%</span>
    `;
    startBtn.style.pointerEvents = 'none';
    startBtn.style.borderColor = 'var(--terminal-green)';
    startBtn.style.boxShadow = '0 0 40px rgba(0, 255, 102, 0.4)';

    // Save escape protocol meta to local storage - BEFORE any navigation
    try {
        localStorage.setItem('escape_leader', leaderName);
        localStorage.setItem('escape_team', selectedTeam);
        localStorage.setItem('escape_members', JSON.stringify(teamMembers));
        localStorage.setItem('escape_level', '0');
        localStorage.setItem('escape_start_time', Date.now().toString());
        
        // Verify data was saved
        const testTeam = localStorage.getItem('escape_team');
        console.log('Team saved:', testTeam);
    } catch (e) {
        console.error('localStorage error:', e);
    }

    // Fade terminal container out before redirect
    setTimeout(() => {
        document.querySelector('.terminal-shell').style.transition = 'all 0.8s ease';
        document.querySelector('.terminal-shell').style.opacity = '0';
        document.querySelector('.terminal-shell').style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    }, 1500);
});
