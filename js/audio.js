/**
 * Bugis Traditional Ambient Music Synthesizer & Player
 * Memainkan alunan musik petikan Kecapi & Suling Bugis yang menenangkan secara otomatis
 * tanpa bergantung pada file MP3 eksternal, sekaligus mendukung pemutaran MP3 kustom jika disediakan.
 */

class BugisMusicPlayer {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.customAudio = null;
    this.timerId = null;
    this.gainNode = null;

    // Skala nada khas Kecapi Bugis (Pelog / Madenda Bugis-Makassar)
    // C4, C#4, F4, G4, G#4, C5, C#5, F5
    this.scale = [261.63, 277.18, 349.23, 392.00, 415.30, 523.25, 554.37, 698.46, 783.99];

    // Melodi tradisional Bugis yang syahdu dan mengalir
    this.melodyPattern = [
      { note: 2, dur: 1.2 }, { note: 3, dur: 0.8 }, { note: 4, dur: 1.5 },
      { note: 3, dur: 0.6 }, { note: 2, dur: 0.8 }, { note: 1, dur: 1.2 },
      { note: 0, dur: 2.0 }, { note: 2, dur: 1.0 }, { note: 4, dur: 1.2 },
      { note: 5, dur: 1.5 }, { note: 4, dur: 0.8 }, { note: 3, dur: 0.8 },
      { note: 2, dur: 1.6 }, { note: 1, dur: 0.8 }, { note: 0, dur: 2.4 }
    ];

    this.melodyIndex = 0;
  }

  init() {
    // Cek jika elemen audio eksternal ada di HTML
    this.customAudio = document.getElementById('weddingAudio');
    if (this.customAudio && (this.customAudio.src && !this.customAudio.src.endsWith('#') && !this.customAudio.src.endsWith('/') || this.customAudio.querySelector('source'))) {
      this.useCustom = true;

      if (!this._eventsBound) {
        this._eventsBound = true;
        this.customAudio.addEventListener('play', () => {
          this.isPlaying = true;
          this.updateUI(true);
        });
        this.customAudio.addEventListener('pause', () => {
          this.isPlaying = false;
          this.updateUI(false);
        });
      }
    } else {
      this.useCustom = false;
    }
  }

  getAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0.35, this.audioContext.currentTime);
      this.gainNode.connect(this.audioContext.destination);
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  // Sintesis petikan dawai Kecapi Bugis (Plucked String Physical Modeling / Karplus-Strong approximation)
  pluckString(freq, time, duration = 2.0) {
    if (!this.audioContext) return;
    const ctx = this.audioContext;

    // 2 Osilator dengan sedikit detune menghasilkan resonansi dawai kayu ganda khas Kecapi
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const noteGain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.004, time); // Subtle shimmer

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, time);
    filter.frequency.exponentialRampToValueAtTime(350, time + duration);

    // Envelope petikan: serang cepat (attack 5ms), meluruh pelan (decay)
    noteGain.gain.setValueAtTime(0.001, time);
    noteGain.gain.linearRampToValueAtTime(0.28, time + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  // Sintesis tiupan Suling Bugis lembut (Flute Pad)
  playFluteTone(freq, time, duration = 3.0) {
    if (!this.audioContext) return;
    const ctx = this.audioContext;

    const osc = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const toneGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Vibrato halus khas tiupan suling bambu
    vibrato.frequency.setValueAtTime(4.8, time);
    vibratoGain.gain.setValueAtTime(3.2, time);
    vibrato.connect(osc.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);

    // Envelope tiupan
    toneGain.gain.setValueAtTime(0.001, time);
    toneGain.gain.linearRampToValueAtTime(0.06, time + 0.6);
    toneGain.gain.setValueAtTime(0.06, time + duration - 0.7);
    toneGain.gain.linearRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(toneGain);
    toneGain.connect(this.gainNode);

    vibrato.start(time);
    osc.start(time);
    vibrato.stop(time + duration);
    osc.stop(time + duration);
  }

  // Melodi loop
  stepMelody() {
    if (!this.isPlaying) return;
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;

    const item = this.melodyPattern[this.melodyIndex];
    const freq = this.scale[item.note % this.scale.length];

    // Petikan dawai utama
    this.pluckString(freq, now, item.dur * 1.5);

    // Harmoni petikan bas rendah sesekali
    if (this.melodyIndex % 3 === 0) {
      const bassFreq = this.scale[0] / 2; // C3
      this.pluckString(bassFreq, now + 0.05, 3.0);
    }

    // Alunan suling pendamping
    if (this.melodyIndex % 5 === 0) {
      const fluteFreq = this.scale[(item.note + 4) % this.scale.length] * 1.0;
      this.playFluteTone(fluteFreq, now + 0.1, 2.5);
    }

    this.melodyIndex = (this.melodyIndex + 1) % this.melodyPattern.length;

    // Jadwal nada berikutnya
    this.timerId = setTimeout(() => {
      this.stepMelody();
    }, item.dur * 850);
  }

  play() {
    this.init();
    if (this.useCustom && this.customAudio) {
      this.customAudio.play().then(() => {
        this.isPlaying = true;
        this.updateUI(true);
      }).catch(() => {
        // Fallback ke synth jika pemutaran audio browser diblokir/gagal
        this.playSynth();
      });
    } else {
      this.playSynth();
    }
  }

  playSynth() {
    this.getAudioContext();
    this.isPlaying = true;
    this.stepMelody();
    this.updateUI(true);
  }

  pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.customAudio) {
      try { this.customAudio.pause(); } catch(e){}
    }
    this.updateUI(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateUI(playing) {
    const btn = document.getElementById('musicToggleBtn');
    if (!btn) return;
    if (playing) {
      btn.classList.add('playing');
      btn.setAttribute('aria-label', 'Jeda Musik');
    } else {
      btn.classList.remove('playing');
      btn.setAttribute('aria-label', 'Putar Musik');
    }
  }
}

window.bugisMusic = new BugisMusicPlayer();
