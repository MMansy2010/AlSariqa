/**
 * Cyberpunk Escape Room Welcome Screen Script
 * Features: Web Audio API Synthesizer, Dynamic Themes, LocalStorage, Screen Transitions
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const body = document.body;
    const selectTeam = document.getElementById('player-team');
    const inputName = document.getElementById('player-name');
    const btnStart = document.getElementById('btn-start');
    const liveTime = document.getElementById('live-time');
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    const toast = document.getElementById('cyber-toast');
    const toastMessage = document.getElementById('toast-message');

    // Team Members dynamic elements
    const teamMembersGroup = document.getElementById('team-members-group');
    const inputMemberName = document.getElementById('member-name-input');
    const btnAddMember = document.getElementById('btn-add-member');
    const membersListContainer = document.getElementById('members-list-container');
    
    let teamMembers = [];

    // Render team members tags list
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

        // Add delete click listeners
        const removeBtns = membersListContainer.querySelectorAll('.remove-member');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                teamMembers.splice(idx, 1);
                renderMembers();
                playSynthSound('click');
            });
        });
    }

    function addMember() {
        const nameVal = inputMemberName.value.trim();
        if (!nameVal) return;
        
        teamMembers.push(nameVal);
        renderMembers();
        inputMemberName.value = '';
        inputMemberName.focus();
        playSynthSound('click');
    }

    btnAddMember.addEventListener('click', addMember);
    inputMemberName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addMember();
        }
    });

    // Load saved player details if available (Premium UX enhancement)
    const savedName = localStorage.getItem('escape_room_player_name');
    const savedTeam = localStorage.getItem('escape_room_player_team');
    const savedMembers = localStorage.getItem('escape_room_team_members');
    
    if (savedName) {
        inputName.value = savedName;
    }
    if (savedTeam) {
        selectTeam.value = savedTeam;
        body.classList.remove('theme-blue', 'theme-red');
        if (savedTeam === 'blue') {
            body.classList.add('theme-blue');
        } else if (savedTeam === 'red') {
            body.classList.add('theme-red');
        }
        
        // Show team members group since team is pre-selected
        teamMembersGroup.style.display = 'flex';
        setTimeout(() => {
            teamMembersGroup.style.opacity = '1';
            teamMembersGroup.style.transform = 'translateY(0)';
        }, 50);
    }

    if (savedMembers) {
        try {
            teamMembers = JSON.parse(savedMembers) || [];
            renderMembers();
        } catch (e) {
            teamMembers = [];
        }
    }

    // 2. Audio State & Web Audio API Synthesizer
    let audioEnabled = true;
    let audioCtx = null;

    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Play synthesized cyberpunk sounds (no external file dependencies)
    function playSynthSound(type) {
        if (!audioEnabled) return;
        
        try {
            initAudioContext();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            const now = audioCtx.currentTime;
            
            if (type === 'click') {
                // Short retro synth tick
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } 
            else if (type === 'theme-switch') {
                // Retro sci-fi sweep up/down
                osc.type = 'triangle';
                const isRed = body.classList.contains('theme-red');
                const startFreq = isRed ? 220 : 330;
                const endFreq = isRed ? 440 : 660;
                
                osc.frequency.setValueAtTime(startFreq, now);
                osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.35);
                
                // Add second oscillator for rich detuned chord
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc2.type = 'sawtooth';
                osc2.frequency.setValueAtTime(startFreq * 1.5, now);
                osc2.frequency.exponentialRampToValueAtTime(endFreq * 1.5, now + 0.35);
                
                // Connect oscillator 2
                osc2.connect(gain2);
                // Reduce volume of raw sawtooth
                gain2.gain.setValueAtTime(0.02, now);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                gain2.connect(audioCtx.destination);
                
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                
                osc.start(now);
                osc.stop(now + 0.35);
                osc2.start(now);
                osc2.stop(now + 0.35);
            } 
            else if (type === 'error') {
                // Low alert warning hum
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(130, now);
                osc.frequency.linearRampToValueAtTime(80, now + 0.25);
                
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                
                osc.start(now);
                osc.stop(now + 0.3);
            } 
            else if (type === 'success') {
                // Dual chord positive alert
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
                osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
                
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
                
                osc.start(now);
                osc.stop(now + 0.45);
            }
        } catch (e) {
            console.warn('Audio Synthesis failed:', e);
        }
    }

    // Toggle sound settings
    audioToggle.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        if (audioEnabled) {
            audioToggle.classList.remove('muted');
            audioIcon.className = 'fas fa-volume-high';
            audioToggle.querySelector('span').textContent = 'المؤثرات الصوتية: نشطة';
            initAudioContext();
            playSynthSound('click');
        } else {
            audioToggle.classList.add('muted');
            audioIcon.className = 'fas fa-volume-xmark';
            audioToggle.querySelector('span').textContent = 'المؤثرات الصوتية: معطلة';
        }
    });

    // 3. System Digital Clock ticking
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        liveTime.textContent = `${hrs}:${mins}:${secs}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // 4. Dynamic Theme Switcher
    selectTeam.addEventListener('change', () => {
        const team = selectTeam.value;
        
        // Remove previous themes
        body.classList.remove('theme-blue', 'theme-red');
        
        if (team === 'blue') {
            body.classList.add('theme-blue');
            // Show members list group with transition
            teamMembersGroup.style.display = 'flex';
            // Force reflow
            teamMembersGroup.offsetHeight;
            teamMembersGroup.style.opacity = '1';
            teamMembersGroup.style.transform = 'translateY(0)';
        } else if (team === 'red') {
            body.classList.add('theme-red');
            // Show members list group with transition
            teamMembersGroup.style.display = 'flex';
            // Force reflow
            teamMembersGroup.offsetHeight;
            teamMembersGroup.style.opacity = '1';
            teamMembersGroup.style.transform = 'translateY(0)';
        } else {
            // Hide members list group
            teamMembersGroup.style.opacity = '0';
            teamMembersGroup.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (selectTeam.value === '') {
                    teamMembersGroup.style.display = 'none';
                }
            }, 400);
        }
        
        // Play theme switch visual / sound feedback
        playSynthSound('theme-switch');
    });

    // Play subtle audio keypress on input fields
    inputName.addEventListener('input', () => {
        // Debounced or extremely short tap sound for typewriter feel
        if (inputName.value.length % 2 === 0) {
            playSynthSound('click');
        }
    });

    // 5. System Validation & Alert Toast
    let toastTimeout;
    function showToast(message, isBlueTheme = false) {
        clearTimeout(toastTimeout);
        toastMessage.textContent = message;
        
        // Setup visual theme of toast
        if (isBlueTheme) {
            toast.classList.add('toast-blue');
        } else {
            toast.classList.remove('toast-blue');
        }
        
        toast.classList.add('show');
        playSynthSound('error');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // 6. Form Submission / Transition Trigger
    btnStart.addEventListener('click', () => {
        initAudioContext();
        const nameVal = inputName.value.trim();
        const teamVal = selectTeam.value;
        const currentThemeIsBlue = body.classList.contains('theme-blue');

        // Check if name is blank
        if (!nameVal) {
            showToast('🚨 فشل النظام: يرجى إدخال اسم قائد الفريق لتنشيط بروتوكول التحدي!', currentThemeIsBlue);
            inputName.focus();
            return;
        }

        // Check if team is blank
        if (!teamVal) {
            showToast('⚠️ تحذير: يجب اختيار فريق (أزرق/أحمر) لتهيئة التوجيه الأمني!', currentThemeIsBlue);
            selectTeam.focus();
            return;
        }

        // Success: Store to localStorage
        localStorage.setItem('escape_room_player_name', nameVal);
        localStorage.setItem('escape_room_player_team', teamVal);
        localStorage.setItem('escape_room_team_members', JSON.stringify(teamMembers));
        
        // Clean all previous session states
        localStorage.removeItem('escape_room_timer_end');
        localStorage.removeItem('escape_room_timer_remaining');
        localStorage.removeItem('escape_room_solved');
        localStorage.removeItem('blue_level_1');
        localStorage.removeItem('blue_level_2');
        localStorage.removeItem('blue_level_3');
        localStorage.removeItem('blue_level_4');
        localStorage.removeItem('blue_level_5');
        localStorage.removeItem('blue_level_6');
        localStorage.removeItem('red_level_1');
        localStorage.removeItem('red_level_2');
        localStorage.removeItem('red_level_3');
        localStorage.removeItem('red_level_4');
        localStorage.removeItem('red_level_5');
        localStorage.removeItem('red_level_6');
        localStorage.removeItem('red_level_7');
        localStorage.removeItem('red_level_3_step_a');
        localStorage.removeItem('red_level_3_completed');
        localStorage.removeItem('hint_level_1_used');
        localStorage.removeItem('hint_level_2_used');
        localStorage.removeItem('hint_level_3_used');
        localStorage.removeItem('hint_level_4_used');
        localStorage.removeItem('hint_level_5_used');
        localStorage.removeItem('escape_room_win_time');
        localStorage.removeItem('escape_room_panic_active');
        localStorage.removeItem('escape_room_panic_timer_end');
        
        playSynthSound('success');
        
        // Trigger immersive fullscreen transition
        executeSystemTransition(nameVal, teamVal);
    });

    // 7. Fullscreen Glitch System transition out
    function executeSystemTransition(name, team) {
        // Create full screen overlay dynamically
        const overlay = document.createElement('div');
        overlay.className = 'cyber-transition-overlay';
        
        const teamText = team === 'blue' ? 'الفريق الأزرق 🟦' : 'الفريق الأحمر 🟥';
        const teamColor = team === 'blue' ? '#00f3ff' : '#ff0055';
        
        const membersCount = teamMembers.length;
        const membersText = membersCount > 0 ? `أعضاء الفريق: ${teamMembers.join('، ')}` : 'لا يوجد أعضاء إضافيين';

        overlay.innerHTML = `
            <div class="overlay-content" style="color: ${teamColor}; text-shadow: 0 0 12px ${teamColor}">
                <div style="font-size: 3rem; margin-bottom: 20px;"><i class="fas fa-shield-halved"></i></div>
                <div style="font-size: 1.6rem; font-weight: 900; margin-bottom: 10px;">تم التحقق من الهوية ✅</div>
                <div style="font-size: 0.95rem; opacity: 0.8; margin-bottom: 5px;">قائد الفريق: ${name}</div>
                <div style="font-size: 0.85rem; opacity: 0.7; margin-bottom: 5px; max-width: 300px; text-align: center; word-break: break-word;">${membersText}</div>
                <div style="font-size: 0.95rem; opacity: 0.8; margin-bottom: 25px;">بروتوكول القفل: ${teamText}</div>
                
                <div style="font-size: 0.8rem; letter-spacing: 2px; margin-bottom: 10px;">تفعيل نظام فك التشفير الهروبي...</div>
                <div class="loading-bar" style="border-color: rgba(${team === 'blue' ? '0, 243, 255' : '255, 0, 85'}, 0.4)">
                    <div class="loading-bar-fill" id="progress-bar-fill" style="background-color: ${teamColor}; box-shadow: 0 0 10px ${teamColor}"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Force Reflow
        overlay.offsetWidth;
        
        // Activate opacity overlay
        overlay.classList.add('active');
        
        // Disable page scroll/actions
        body.style.overflow = 'hidden';

        // Animate progress bar fill after short delay
        setTimeout(() => {
            const bar = document.getElementById('progress-bar-fill');
            if (bar) bar.style.width = '100%';
        }, 100);

        // Slow build up synth sound for transition
        if (audioEnabled) {
            try {
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(900, now + 1.8);
                gain.connect(audioCtx.destination);
                osc.connect(gain);
                gain.gain.setValueAtTime(0.01, now);
                gain.gain.exponentialRampToValueAtTime(0.12, now + 1.5);
                gain.gain.linearRampToValueAtTime(0.001, now + 1.8);
                osc.start(now);
                osc.stop(now + 1.9);
            } catch(e) {}
        }

        // Redirect after animation completes
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 1800);
    }

    // Restore page state if restored from back/forward cache (bfcache)
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            const activeOverlays = document.querySelectorAll('.cyber-transition-overlay');
            activeOverlays.forEach(o => o.remove());
            body.style.overflow = '';
        }
    });
});
