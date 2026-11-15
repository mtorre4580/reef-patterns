/**
 * Ship sounds synthesized with the Web Audio API (no audio files to download):
 * a wooden creak when the helm starts, a ratchet tick per sector, and a ship's bell.
 * Every function is a no-op where Web Audio is not available (tests, old browsers).
 */

type AudioContextCtor = typeof AudioContext;

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

const getContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  const Ctor: AudioContextCtor | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx ??= new Ctor();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
};

const noiseBuffer = (ac: AudioContext): AudioBuffer => {
  if (noise) return noise;
  const length = Math.floor(ac.sampleRate * 0.25);
  noise = ac.createBuffer(1, length, ac.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return noise;
};

/** Short wooden click of the helm's ratchet. `strength` goes from 0 to 1. */
export const playTick = (strength = 1): void => {
  const ac = getContext();
  if (!ac) return;
  const t = ac.currentTime;
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac);
  const band = ac.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1700 + Math.random() * 400;
  band.Q.value = 6;
  const gain = ac.createGain();
  const peak = 0.05 + 0.25 * Math.min(1, Math.max(0, strength));
  gain.gain.setValueAtTime(peak, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  src.connect(band).connect(gain).connect(ac.destination);
  src.start(t);
  src.stop(t + 0.06);
};

/** Low wooden creak when the wheel starts turning. */
export const playCreak = (): void => {
  const ac = getContext();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(95, t);
  osc.frequency.linearRampToValueAtTime(70, t + 0.18);
  osc.frequency.linearRampToValueAtTime(110, t + 0.32);
  osc.frequency.linearRampToValueAtTime(80, t + 0.5);
  const low = ac.createBiquadFilter();
  low.type = 'lowpass';
  low.frequency.value = 520;
  low.Q.value = 8;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.09, t + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  osc.connect(low).connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.6);
};

/** Ship's bell: a few inharmonic partials with a long decay. `strikes` rings it that many times. */
export const playBell = (strikes = 1): void => {
  const ac = getContext();
  if (!ac) return;
  const partials: [ratio: number, gain: number, decay: number][] = [
    [1, 0.28, 2.4],
    [2.0, 0.12, 1.6],
    [2.76, 0.1, 1.2],
    [4.07, 0.05, 0.8],
    [5.4, 0.03, 0.5],
  ];
  for (let s = 0; s < strikes; s++) {
    const t = ac.currentTime + s * 0.32;
    for (const [ratio, peak, decay] of partials) {
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 659 * ratio;
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.connect(gain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + decay + 0.05);
    }
  }
};
