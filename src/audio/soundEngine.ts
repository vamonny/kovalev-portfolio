/**
 * Procedural Web Audio API micro-acoustic library.
 * Zero background music — pure tactile interface acoustics.
 * Enabled by default; unlocks cleanly on the user's first interaction per browser autoplay policy.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private lastHoverAt = 0;

  private ensureContext(requireRunning = false): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      if (requireRunning) return null;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === 'suspended') {
      if (requireRunning) return null;
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Unlock/resume AudioContext on first user gesture (pointerdown/keydown/touchstart) */
  public unlock(onUnlocked?: () => void): void {
    if (!this.enabled || typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'running') {
      onUnlocked?.();
      return;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx
        .resume()
        .then(() => {
          if (this.ctx?.state === 'running') {
            onUnlocked?.();
          }
        })
        .catch(() => {});
    }
  }

  public setEnabled(next: boolean, silent = false): void {
    this.enabled = next;
    if (next && !silent) {
      this.unlock();
      if (this.ctx) {
        this.playToggleOn();
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /** Soft filtered impulse tick on interactive hover */
  public playHover(): void {
    const nowMs = performance.now();
    if (nowMs - this.lastHoverAt < 55) return;
    this.lastHoverAt = nowMs;

    const ctx = this.ensureContext(true);
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1180, t);
    osc.frequency.exponentialRampToValueAtTime(620, t + 0.032);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, t);
    filter.Q.setValueAtTime(2.2, t);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.035, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.045);
  }

  /** Tactile mechanical shutter click */
  public playClick(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, t);
    osc.frequency.exponentialRampToValueAtTime(95, t + 0.055);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.09, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.065);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  /** Elastic tension string pluck */
  public playPluck(pitchFactor = 1): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const baseFreq = Math.max(130, Math.min(440, 210 * pitchFactor));

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(baseFreq * 1.06, t);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.08);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 2, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, t);
    filter.frequency.exponentialRampToValueAtTime(320, t + 0.28);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.32);
    osc2.stop(t + 0.32);
  }

  /** Soft harmonic morph glide */
  public playMorph(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.14);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.055, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.17);
  }

  /** Subtle spatial transition air sweep */
  public playTransition(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.24);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, t);
    filter.frequency.exponentialRampToValueAtTime(1400, t + 0.12);
    filter.frequency.exponentialRampToValueAtTime(460, t + 0.24);
    filter.Q.setValueAtTime(1.8, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.045, t + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
    noise.stop(t + 0.25);
  }

  /** Warm confirmation two-note interval */
  public playSuccess(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    [330, 495].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = t + idx * 0.09;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.07, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.26);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.28);
    });
  }

  /**
   * Synchronized multi-layered Web Audio soundscape for the Liquid Glass 'K' reveal.
   * Returns true if AudioContext is actively running and audio started immediately.
   */
  public playIntroReveal(): boolean {
    if (!this.enabled || typeof window === 'undefined') return false;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
    }

    const ctx = this.ctx;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
      return false;
    }
    if (ctx.state !== 'running') return false;

    const t = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.85, t);
    master.connect(ctx.destination);

    // 1. Sub-bass glass bloom (droplet emergence)
    const subOsc = ctx.createOscillator();
    const subFilter = ctx.createBiquadFilter();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(56, t);
    subOsc.frequency.exponentialRampToValueAtTime(112, t + 0.55);
    subOsc.frequency.exponentialRampToValueAtTime(82.41, t + 1.85);

    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(240, t);

    subGain.gain.setValueAtTime(0.0001, t);
    subGain.gain.linearRampToValueAtTime(0.11, t + 0.14);
    subGain.gain.exponentialRampToValueAtTime(0.04, t + 1.25);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.35);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(master);
    subOsc.start(t);
    subOsc.stop(t + 2.4);

    // 2. Two liquid droplet pitch-chirp transients
    [
      { offset: 0.04, f0: 310, f1: 790, dur: 0.085, amp: 0.045 },
      { offset: 0.42, f0: 460, f1: 1080, dur: 0.095, amp: 0.04 },
    ].forEach((drop) => {
      const start = t + drop.offset;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(drop.f0, start);
      osc.frequency.exponentialRampToValueAtTime(drop.f1, start + drop.dur);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(drop.f1 * 0.85, start);
      filter.Q.setValueAtTime(4.2, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(drop.amp, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + drop.dur + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start(start);
      osc.stop(start + drop.dur + 0.07);
    });

    // 3. Prismatic optical diagonal sheen sweep (filtered pink-like air)
    const sweepDur = 1.9;
    const bufferSize = Math.floor(ctx.sampleRate * sweepDur);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.95 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2 + white * 0.18) * 0.35;
    }

    const air = ctx.createBufferSource();
    air.buffer = noiseBuffer;
    const airFilter = ctx.createBiquadFilter();
    airFilter.type = 'bandpass';
    airFilter.frequency.setValueAtTime(260, t + 0.12);
    airFilter.frequency.exponentialRampToValueAtTime(2400, t + 1.05);
    airFilter.frequency.exponentialRampToValueAtTime(620, t + sweepDur);
    airFilter.Q.setValueAtTime(2.6, t);

    const airGain = ctx.createGain();
    airGain.gain.setValueAtTime(0.0001, t + 0.1);
    airGain.gain.linearRampToValueAtTime(0.065, t + 0.72);
    airGain.gain.exponentialRampToValueAtTime(0.0001, t + sweepDur);

    air.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(master);
    air.start(t + 0.1);
    air.stop(t + sweepDur + 0.02);

    // 4. Crystalline glass-harp E-major-9 harmonic resolve staggered across bevel focus
    const partials = [
      { freq: 329.63, delay: 0.65, amp: 0.032, decay: 1.55 },
      { freq: 493.88, delay: 0.79, amp: 0.03, decay: 1.48 },
      { freq: 739.99, delay: 0.94, amp: 0.026, decay: 1.4 },
      { freq: 830.61, delay: 1.12, amp: 0.022, decay: 1.32 },
      { freq: 987.77, delay: 1.32, amp: 0.018, decay: 1.2 },
    ];
    partials.forEach((p) => {
      const start = t + p.delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq * 0.996, start);
      osc.frequency.exponentialRampToValueAtTime(p.freq, start + 0.12);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(p.amp, start + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + p.decay);

      osc.connect(gain);
      gain.connect(master);
      osc.start(start);
      osc.stop(start + p.decay + 0.03);
    });

    // 5. Crisp optical lock ping as the solid 'K' settles
    const lockStart = t + 1.92;
    const lockOsc = ctx.createOscillator();
    const lockGain = ctx.createGain();
    lockOsc.type = 'sine';
    lockOsc.frequency.setValueAtTime(1480, lockStart);
    lockOsc.frequency.exponentialRampToValueAtTime(1472, lockStart + 0.35);
    lockGain.gain.setValueAtTime(0.0001, lockStart);
    lockGain.gain.linearRampToValueAtTime(0.026, lockStart + 0.008);
    lockGain.gain.exponentialRampToValueAtTime(0.0001, lockStart + 0.38);
    lockOsc.connect(lockGain);
    lockGain.connect(master);
    lockOsc.start(lockStart);
    lockOsc.stop(lockStart + 0.4);

    return true;
  }

  /** Concise crystalline liquid-glass resolve chime when user unlocks/enters */
  public playIntroResolve(): boolean {
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== 'running') return false;

    const t = ctx.currentTime;
    [329.63, 493.88, 739.99, 987.77].forEach((freq, idx) => {
      const start = t + idx * 0.055;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.034 - idx * 0.004, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.72);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.75);
    });

    return true;
  }

  private playToggleOn(): void {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(660, t + 0.09);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }
}

export const soundEngine = new SoundEngine();
