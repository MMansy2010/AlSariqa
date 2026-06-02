/**
 * Escape Room Part 2 — Horror SFX (files + Web Audio fallback)
 */
const GameAudio = (() => {
    const BASE = 'assets/audio/';
    const tracks = {};
    let ctx = null;
    let activeLoops = [];
    let activeNodes = [];

    function init() {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    function load(name, file, loop = false) {
        if (tracks[name]) return tracks[name];
        const audio = new Audio(BASE + file);
        audio.preload = 'auto';
        audio.loop = loop;
        tracks[name] = audio;
        return audio;
    }

    function stopAll() {
        activeLoops.forEach((a) => {
            try {
                a.pause();
                a.currentTime = 0;
            } catch (_) {}
        });
        activeLoops = [];
        activeNodes.forEach((n) => {
            try {
                n.stop?.();
                n.disconnect?.();
            } catch (_) {}
        });
        activeNodes = [];
        Object.values(tracks).forEach((a) => {
            try {
                a.pause();
                a.currentTime = 0;
            } catch (_) {}
        });
    }

    function playFile(name, file, { loop = false, volume = 1 } = {}) {
        init();
        const audio = load(name, file, loop);
        audio.volume = Math.min(1, volume);
        audio.currentTime = 0;
        const p = audio.play();
        if (loop) activeLoops.push(audio);
        if (p && p.catch) {
            p.catch(() => synthFallback(name, { loop, volume }));
        }
        return audio;
    }

    function synthFallback(name, { loop = false, volume = 1 } = {}) {
        init();
        const now = ctx.currentTime;

        if (name === 'scream' || name === 'laugh') {
            const dur = 1.5;
            const len = Math.floor(ctx.sampleRate * dur);
            const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < len; i++) {
                const t = i / ctx.sampleRate;
                const env = Math.pow(1 - t / dur, 0.35);
                if (name === 'scream') {
                    data[i] =
                        env *
                        (0.65 * Math.sin(2 * Math.PI * (900 + 800 * t) * t) +
                            0.55 * (Math.random() * 2 - 1));
                } else {
                    data[i] =
                        env *
                        0.7 *
                        Math.sin(2 * Math.PI * (180 + 90 * Math.sin(2 * Math.PI * 7 * t)) * t) *
                        (Math.random() * 0.4 + 0.6);
                }
            }
            const src = ctx.createBufferSource();
            const gain = ctx.createGain();
            src.buffer = buffer;
            gain.gain.value = volume;
            src.connect(gain);
            gain.connect(ctx.destination);
            src.start(now);
            activeNodes.push(src);
            return;
        }

        if (name === 'static') {
            const dur = loop ? 8 : 3;
            const len = Math.floor(ctx.sampleRate * dur);
            const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            src.loop = loop;
            const gain = ctx.createGain();
            gain.gain.value = volume * 0.45;
            src.connect(gain);
            gain.connect(ctx.destination);
            src.start(now);
            activeNodes.push(src);
            if (loop) activeLoops.push({ pause: () => src.stop() });
            return;
        }

        if (name === 'cheer') {
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.value = freq;
                const start = now + i * 0.12;
                gain.gain.setValueAtTime(0.0001, start);
                gain.gain.exponentialRampToValueAtTime(0.14 * volume, start + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + 0.4);
                activeNodes.push(osc);
            });
            if (loop) {
                const interval = setInterval(() => synthFallback('cheer', { loop: false, volume }), 900);
                activeLoops.push({
                    pause: () => clearInterval(interval),
                });
            }
        }
    }

    return {
        init,
        stopAll,
        playScream() {
            stopAll();
            playFile('scream', 'scream.wav', { volume: 1 });
        },
        playLaugh() {
            stopAll();
            playFile('laugh', 'laugh.wav', { volume: 1 });
        },
        playStatic(loop = true) {
            playFile('static', 'static.wav', { loop, volume: 0.85 });
        },
        playCheer(loop = true) {
            playFile('cheer', 'cheer.wav', { loop, volume: 0.75 });
            if (loop) {
                const interval = setInterval(() => {
                    playFile('cheer_burst', 'cheer.wav', { loop: false, volume: 0.5 });
                }, 1100);
                activeLoops.push({ pause: () => clearInterval(interval) });
            }
        },
        playSuccess() {
            init();
            const now = ctx.currentTime;
            [440, 554, 659].forEach((f, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = f;
                gain.gain.setValueAtTime(0.12, now + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.08);
                osc.stop(now + i * 0.08 + 0.26);
            });
        },
        playError() {
            init();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.22);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.24);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
        },
    };
})();
