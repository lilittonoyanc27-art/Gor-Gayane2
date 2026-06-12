/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple synthesizer using Web Audio API to produce athletic game sound effects
class AudioSynth {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // Play standard success sound (Basketball hoop, tennis hit, or cheering)
  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(261.63, t); // C4
      osc.frequency.exponentialRampToValueAtTime(523.25, t + 0.15); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, t + 0.3); // G5

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

      osc.start(t);
      osc.stop(t + 0.35);
    } catch (e) {
      console.warn('Audio failed to play:', e);
    }
  }

  playScoreGoal() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      // High-pitched whistle + C4 to E4 to G4 to C5 arpeggio
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t);
      osc.frequency.setValueAtTime(659.25, t + 0.08);
      osc.frequency.setValueAtTime(783.99, t + 0.16);
      osc.frequency.setValueAtTime(1046.50, t + 0.24);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

      osc.start(t);
      osc.stop(t + 0.5);
    } catch {
      // ignore
    }
  }

  playFail() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220.00, t); // A3
      osc.frequency.linearRampToValueAtTime(110.00, t + 0.35); // A2

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.4);

      osc.start(t);
      osc.stop(t + 0.4);
    } catch {
      // ignore
    }
  }

  playHitTennis() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.08);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

      osc.start(t);
      osc.stop(t + 0.1);
    } catch {
      // ignore
    }
  }

  playArrowRelease() {
    try {
      this.init();
      if (!this.ctx) return;
      // Synthesize string bow release (low noise frequency sliding up then decaying)
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, t);
      osc.frequency.linearRampToValueAtTime(400, t + 0.08);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.12);

      osc.start(t);
      osc.stop(t + 0.12);
    } catch {
      // ignore
    }
  }

  playArrowBullseye() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      // High ding
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, t); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, t + 0.08); // E6

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      osc.start(t);
      osc.stop(t + 0.4);
    } catch {
      // ignore
    }
  }

  playHeavyLift() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, t);
      osc.frequency.linearRampToValueAtTime(120, t + 0.2);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      osc.start(t);
      osc.stop(t + 0.4);
    } catch {}
  }
}

export const audioSynth = new AudioSynth();
