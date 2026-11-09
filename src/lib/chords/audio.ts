/** Map note names like C4, F#3 to frequency in Hz */
const NOTE_OFFSETS: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

function noteToFrequency(note: string): number {
  const match = note.match(/^([A-G][#b]?)(-?\d+)$/);
  if (!match) return 440;
  const [, name, octaveStr] = match;
  const octave = Number(octaveStr);
  const semitone = NOTE_OFFSETS[name] ?? 0;
  // A4 = 440 Hz at MIDI 69; C0 MIDI = 12
  const midi = (octave + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("Audio only available in browser");
  }
  if (!sharedCtx || sharedCtx.state === "closed") {
    sharedCtx = new AudioContext();
  }
  return sharedCtx;
}

export async function playNotes(
  notes: string[],
  options?: { duration?: number; stagger?: number },
): Promise<void> {
  const duration = options?.duration ?? 1.4;
  const stagger = options?.stagger ?? 0.04;
  const ctx = getAudioContext();

  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.55, now + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  master.connect(ctx.destination);

  notes.forEach((note, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + i * stagger;

    osc.type = "triangle";
    osc.frequency.value = noteToFrequency(note);

    // Soft pluck envelope per string
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.35, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration - i * stagger * 0.3);

    osc.connect(gain);
    gain.connect(master);
    osc.start(start);
    osc.stop(start + duration);
  });
}

export async function playMetronomeClick(accent = false): Promise<void> {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = accent ? 1200 : 800;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(accent ? 0.4 : 0.25, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}
