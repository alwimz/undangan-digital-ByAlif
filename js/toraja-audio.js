/**
 * Toraja Traditional Music Synthesizer & Player (Suling Lembang & Gendang Toraja)
 * Memainkan alunan musik tiupan Suling Lembang dan harmoni bambu Toraja yang syahdu
 * untuk perayaan sukacita pernikahan adat (Rambu Tuka' / Rampanan Kapa').
 */

class TorajaMusicPlayer {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.customAudio = null;
    this.timerId = null;
    this.gainNode = null;
    this._eventsBound = false;

    // Skala nada khas Suling Lembang Toraja (Lydian / Pentatonik Toraja)
    // D4, F#4, G4, A4, B4, D5, E5, F#5
    this.scale = [293.66, 369.99, 392.00, 440.00, 493.88, 587.33, 659.25, 739.99];

    // Melodi Rambu Tuka' Toraja: Mengalir tenang, penuh doa syukur dan berkah
    this.melodyPattern = [
      { note: 0, dur: 1.4 }, { note: 2, dur: 0.9 }, { note: 3, dur: 1.6 },
      { note: 4, dur: 1.2 }, { note: 3, dur: 0.8 }, { note: 2, dur: 1.0 },
      { note: 1, dur: 1.8 }, { note: 3, dur: 1.1 }, { note: 5, dur: 1.5 },
      { note: 4, dur: 0.9 }, { note: 3, dur: 1.3 }, { note: 2, dur: 1.0 },
      { note: 0, dur: 2.2 }
    ];

    this.melodyIndex = 0;
  }

  init() {
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
      this.gainNode.gain.setValueAtTime(0.32, this.audioContext.currentTime);
      this.gainNode.connect(this.audioContext.destination);
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  // Sintesis tiupan bambu Suling Lembang Toraja dengan resonansi getar alami
  playSulingLembang(freq, time, duration = 2.8) {
    if (!this.audioContext) return;
    const ctx = this.audioContext;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const toneGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 2.002, time); // Harmoni oktaf bambu

    // Vibrato nafas lembut khas musisi Suling Lembang
    vibrato.frequency.setValueAtTime(5.2, time);
    vibratoGain.gain.setValueAtTime(4.0, time);
    vibrato.connect(osc1.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, time);
    filter.Q.setValueAtTime(3.5, time);

    // Envelope tiupan Suling
    toneGain.gain.setValueAtTime(0.001, time);
    toneGain.gain.linearRampToValueAtTime(0.08, time + 0.4);
    toneGain.gain.setValueAtTime(0.08, time + duration - 0.6);
    toneGain.gain.linearRampToValueAtTime(0.0001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(toneGain);
    toneGain.connect(this.gainNode);

    vibrato.start(time);
    osc1.start(time);
    osc2.start(time);
    vibrato.stop(time + duration);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  // Nada dasar rendah bambu Pa'pompang (Bass Bamboo Drone)
  playBambooBass(freq, time, duration = 3.2) {
    if (!this.audioContext) return;
    const ctx = this.audioContext;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);

    osc.start(time);
    osc.stop(time + duration);
  }

  stepMelody() {
    if (!this.isPlaying) return;
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;

    const item = this.melodyPattern[this.melodyIndex];
    const freq = this.scale[item.note % this.scale.length];

    // Mainkan Suling Lembang
    this.playSulingLembang(freq, now, item.dur * 1.6);

    // Dentum Pa'pompang bass bambu lembut di ketukan awal
    if (this.melodyIndex % 3 === 0) {
      const bassFreq = this.scale[0] / 2; // D3
      this.playBambooBass(bassFreq, now, 2.5);
    }

    this.melodyIndex = (this.melodyIndex + 1) % this.melodyPattern.length;

    this.timerId = setTimeout(() => {
      this.stepMelody();
    }, item.dur * 880);
  }

  play() {
    this.init();
    if (this.useCustom && this.customAudio) {
      this.customAudio.play().then(() => {
        this.isPlaying = true;
        this.updateUI(true);
      }).catch(() => {
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

window.torajaMusic = new TorajaMusicPlayer();
