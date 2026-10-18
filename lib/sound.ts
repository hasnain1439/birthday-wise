"use client";

/**
 * Web Audio sound engine. Everything is synthesized — no audio files.
 * The AudioContext is created lazily on the first user gesture, which is
 * what browsers require before audio can play.
 */

const VOLUME = 0.85;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
const listeners = new Set<() => void>();

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : VOLUME;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  return ctx;
}

// ---- autoplay unlock ----
// Browsers keep audio suspended until the visitor taps, clicks or presses a key.
const unlockListeners = new Set<() => void>();

function isUnlocked() {
  return ctx?.state === "running";
}

export const audioStore = {
  subscribe(cb: () => void) {
    unlockListeners.add(cb);
    return () => unlockListeners.delete(cb);
  },
  getSnapshot: isUnlocked,
  getServerSnapshot: () => false,
};

/** Resume audio on the first user gesture anywhere on the page. */
export function installAudioUnlock() {
  const events = ["pointerdown", "keydown", "touchend"] as const;
  const unlock = () => {
    const ac = audio();
    if (!ac) return;
    ac.resume().then(() => {
      if (ac.state !== "running") return;
      events.forEach((e) => window.removeEventListener(e, unlock, true));
      unlockListeners.forEach((l) => l());
    }).catch(() => {});
  };
  events.forEach((e) => window.addEventListener(e, unlock, true));
  return () => events.forEach((e) => window.removeEventListener(e, unlock, true));
}

// ---- mute store (for useSyncExternalStore) ----
export const soundStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getSnapshot: () => muted,
  getServerSnapshot: () => false,
  toggle() {
    muted = !muted;
    if (ctx && master) master.gain.setTargetAtTime(muted ? 0 : VOLUME, ctx.currentTime, 0.05);
    if (muted) stopMusic();
    listeners.forEach((l) => l());
  },
};

type ToneOpts = { type?: OscillatorType; volume?: number; glideTo?: number; lowpass?: number; vibrato?: number };

function tone(freq: number, start: number, duration: number, opts: ToneOpts = {}, out?: AudioNode) {
  const { type = "triangle", volume = 0.25, glideTo, lowpass, vibrato } = opts;
  const ac = audio();
  if (!ac || !master || muted || ac.state !== "running") return;
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + duration * 0.8);
  if (vibrato) {
    const lfo = ac.createOscillator();
    const depth = ac.createGain();
    lfo.frequency.value = vibrato;
    depth.gain.value = freq * 0.03;
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(t);
    lfo.stop(t + duration + 0.05);
  }
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  let node: AudioNode = osc.connect(gain);
  if (lowpass) {
    const f = ac.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = lowpass;
    node = node.connect(f);
  }
  node.connect(out ?? master);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

function noise(
  start: number,
  duration: number,
  { from = 1800, to = 300, volume = 0.35, type = "bandpass" as BiquadFilterType, q = 0.8 } = {},
) {
  const ac = audio();
  if (!ac || !master || muted || ac.state !== "running") return;
  const t = ac.currentTime + start;
  const length = Math.max(1, Math.floor(ac.sampleRate * duration));
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + duration);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  src.connect(filter).connect(gain).connect(master);
  src.start(t);
}

const N: Record<string, number> = {
  C3: 130.81, F3: 174.61, G3: 196, A3: 220,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5, G6: 1568,
};

// ---- background music (soft music-box loop) ----
let musicTimer: ReturnType<typeof setInterval> | null = null;

function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
}

const LOOP: [number, number][] = [
  [N.C5, 0], [N.E5, 0.25], [N.G5, 0.5], [N.E5, 0.75],
  [N.F5, 1], [N.A5, 1.25], [N.C6, 1.5], [N.A5, 1.75],
  [N.G5, 2], [N.E5, 2.25], [N.C5, 2.5], [N.E5, 2.75],
  [N.D5, 3], [N.G5, 3.25], [N.F5, 3.5], [N.D5, 3.75],
];
const LOOP_BASS: [number, number][] = [[N.C3, 0], [N.F3, 1], [N.C3, 2], [N.G3, 3]];
const BAR = 0.5; // seconds per beat

function playLoopOnce() {
  for (const [f, b] of LOOP) tone(f, b * BAR, 0.7, { type: "sine", volume: 0.05 });
  for (const [f, b] of LOOP_BASS) tone(f, b * BAR, 0.9, { type: "triangle", volume: 0.07 });
}

export const sfx = {
  /** Soft breath when a candle is blown out. */
  blow() {
    noise(0, 0.5, { from: 2600, to: 350, volume: 0.45 });
  },
  /** Bright pop + sparkle. */
  pop() {
    tone(880, 0, 0.12, { type: "sine", volume: 0.3, glideTo: 1400 });
    tone(1760, 0.04, 0.2, { type: "sine", volume: 0.12 });
  },
  /** Rising chime — pitch climbs with each candle blown. */
  candle(step: number) {
    const scale = [N.C5, N.E5, N.G5, N.C6, N.E6];
    const f = scale[Math.min(step, scale.length - 1)];
    tone(f, 0.05, 0.5, { type: "sine", volume: 0.2 });
    tone(f * 1.5, 0.1, 0.4, { type: "sine", volume: 0.07 });
  },
  /** Short key click for the terminal. */
  key() {
    tone(1900 + Math.random() * 400, 0, 0.03, { type: "square", volume: 0.03, lowpass: 3000 });
  },
  /** Magical shimmer of random high pings. */
  sparkle(count = 10) {
    for (let i = 0; i < count; i++) {
      tone(1800 + Math.random() * 2200, i * 0.05, 0.25, { type: "sine", volume: 0.06 });
    }
  },
  /** Whoosh — rising filtered noise. */
  whoosh() {
    noise(0, 0.6, { from: 300, to: 5000, volume: 0.3 });
  },
  /** Accelerating snare drum roll. */
  drumroll(duration = 1.2) {
    let t = 0;
    let gap = 0.09;
    while (t < duration) {
      noise(t, 0.08, { from: 3000, to: 1500, volume: 0.12 + (t / duration) * 0.25, type: "highpass", q: 0.5 });
      t += gap;
      gap = Math.max(0.03, gap * 0.93);
    }
    // cymbal crash at the end
    noise(duration, 1.4, { from: 9000, to: 4000, volume: 0.35, type: "highpass", q: 0.3 });
  },
  /** Brassy "ta-da!" chord. */
  tada() {
    const brass = { type: "sawtooth" as OscillatorType, lowpass: 2200, vibrato: 5 };
    [N.C4, N.E4, N.G4, N.C5].forEach((f) => tone(f, 0, 0.18, { ...brass, volume: 0.12 }));
    [N.C4, N.F4, N.A4, N.C5].forEach((f) => tone(f * 1.0, 0.2, 0.9, { ...brass, volume: 0.13 }));
    tone(N.C3, 0.2, 0.9, { type: "triangle", volume: 0.25 });
  },
  /** Party horn: buzzy glide up with wobble. */
  partyHorn() {
    tone(320, 0, 0.7, { type: "sawtooth", volume: 0.18, glideTo: 640, lowpass: 2600, vibrato: 18 });
    tone(323, 0.02, 0.7, { type: "square", volume: 0.06, glideTo: 645, lowpass: 2000 });
  },
  /** Firework: whistle up, boom, crackle. */
  firework(delay = 0) {
    tone(900, delay, 0.5, { type: "sine", volume: 0.06, glideTo: 2400 });
    tone(110, delay + 0.5, 0.6, { type: "sine", volume: 0.5, glideTo: 40 });
    noise(delay + 0.5, 0.35, { from: 1200, to: 200, volume: 0.4, type: "lowpass" });
    for (let i = 0; i < 14; i++) {
      noise(delay + 0.65 + Math.random() * 0.7, 0.03, { from: 6000, to: 3000, volume: 0.15, type: "highpass" });
    }
  },
  /** Crowd cheer + applause. */
  cheer(duration = 2.8) {
    noise(0, duration, { from: 900, to: 700, volume: 0.12, q: 0.4 });
    for (let i = 0; i < 70; i++) {
      noise(Math.random() * duration, 0.025, { from: 2500, to: 1500, volume: 0.1 + Math.random() * 0.1, q: 1.2 });
    }
    tone(N.A4, 0.1, 0.5, { type: "sawtooth", volume: 0.03, glideTo: N.E5, lowpass: 1500 });
    tone(N.C5, 0.3, 0.5, { type: "sawtooth", volume: 0.03, glideTo: N.G5, lowpass: 1500 });
  },
  /** Firework crackle + rising chime. */
  fanfare() {
    noise(0, 0.6, { from: 6000, to: 1200, volume: 0.3 });
    [N.C5, N.E5, N.G5, N.C6, N.E6, N.G6].forEach((f, i) => tone(f, 0.05 + i * 0.07, 0.6, { type: "sine", volume: 0.16 }));
  },
  /** Everything at once — for blowing out the last candle. */
  bigCelebration() {
    sfx.fanfare();
    sfx.partyHorn();
    sfx.cheer();
    [0.4, 0.9, 1.5].forEach((d) => sfx.firework(d - 0.5 < 0 ? 0 : d - 0.5));
    sfx.happyBirthday(1.4);
  },
  /** Full "Happy Birthday" with bass and chords. */
  happyBirthday(delay = 0.6) {
    const beat = 0.34;
    const melody: [string, number][] = [
      ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
      ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
      ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
      ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3],
    ];
    // bass note at the start of each bar (3/4 time, pickup of 1 beat)
    const bass: [string, number][] = [
      ["C3", 1], ["G3", 4], ["G3", 7], ["C3", 10], ["C3", 13], ["F3", 16], ["C3", 19], ["G3", 22], ["C3", 25],
    ];
    let t = delay;
    for (const [n, len] of melody) {
      tone(N[n], t, len * beat * 1.1, { type: "triangle", volume: 0.26 });
      tone(N[n] * 2, t, len * beat * 0.6, { type: "sine", volume: 0.05 });
      t += len * beat;
    }
    for (const [n, b] of bass) {
      tone(N[n], delay + b * beat, beat * 2.8, { type: "sine", volume: 0.22 });
      tone(N[n] * 2, delay + b * beat, beat * 2.5, { type: "triangle", volume: 0.05 });
    }
  },
  /** Success blip. */
  success() {
    tone(N.E5, 0, 0.15, { type: "sine", volume: 0.18 });
    tone(N.A5, 0.09, 0.3, { type: "sine", volume: 0.18 });
  },
  /** Soft music-box loop that plays in the background. */
  startMusic() {
    if (musicTimer || muted || !audio()) return;
    playLoopOnce();
    musicTimer = setInterval(() => {
      if (muted) return stopMusic();
      playLoopOnce();
    }, 4 * BAR * 1000);
  },
  stopMusic,
};
