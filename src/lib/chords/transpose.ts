/** Chromatic notes using sharps as canonical form */
export const NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type NoteName = (typeof NOTES)[number];

const ENHARMONIC: Record<string, NoteName> = {
  Db: "C#",
  Eb: "D#",
  Fb: "E",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
  Cb: "B",
  "E#": "F",
  "B#": "C",
};

/** Prefer flats in flat keys when showing output */
const FLAT_KEYS = new Set(["F", "Bb", "Eb", "Ab", "Db", "Gb"]);

const SHARP_TO_FLAT: Record<string, string> = {
  "C#": "Db",
  "D#": "Eb",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb",
};

export interface ParsedChord {
  root: string;
  quality: string;
  bass: string | null;
  raw: string;
}

/**
 * Parse chord symbols like Am, C/G, F#m7, Bbmaj7, Dsus4
 */
export function parseChord(raw: string): ParsedChord | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const match = trimmed.match(
    /^([A-Ga-g])([#b]?)(.*?)(?:\/([A-Ga-g][#b]?))?$/,
  );
  if (!match) return null;

  const [, letter, accidental = "", quality = "", bass] = match;
  const root = `${letter.toUpperCase()}${accidental}`;
  return {
    root,
    quality,
    bass: bass ? `${bass[0].toUpperCase()}${bass.slice(1)}` : null,
    raw: trimmed,
  };
}

export function noteToIndex(note: string): number {
  const normalized = ENHARMONIC[note] ?? (note as NoteName);
  const idx = NOTES.indexOf(normalized as NoteName);
  if (idx === -1) {
    throw new Error(`Unknown note: ${note}`);
  }
  return idx;
}

export function transposeNote(
  note: string,
  semitones: number,
  preferFlats = false,
): string {
  const idx = noteToIndex(note);
  const next = NOTES[(idx + semitones + 120) % 12];
  if (preferFlats && SHARP_TO_FLAT[next]) {
    return SHARP_TO_FLAT[next];
  }
  return next;
}

export function transposeChordSymbol(
  symbol: string,
  semitones: number,
  preferFlats?: boolean,
): string {
  const parsed = parseChord(symbol);
  if (!parsed) return symbol;

  const useFlats =
    preferFlats ??
    (FLAT_KEYS.has(parsed.root) || parsed.root.includes("b"));

  const root = transposeNote(parsed.root, semitones, useFlats);
  const bass = parsed.bass
    ? transposeNote(parsed.bass, semitones, useFlats)
    : null;

  return bass ? `${root}${parsed.quality}/${bass}` : `${root}${parsed.quality}`;
}

/** Match [Chord] tokens in lyric lines */
const CHORD_TOKEN = /\[([^\]]+)\]/g;

export function transposeSongText(
  text: string,
  semitones: number,
): string {
  return text.replace(CHORD_TOKEN, (_, chord: string) => {
    return `[${transposeChordSymbol(chord, semitones)}]`;
  });
}

export function extractChordsFromSong(text: string): string[] {
  const found: string[] = [];
  const seen = new Set<string>();
  for (const match of text.matchAll(CHORD_TOKEN)) {
    const chord = match[1];
    if (!seen.has(chord)) {
      seen.add(chord);
      found.push(chord);
    }
  }
  return found;
}

export function formatSemitoneLabel(n: number): string {
  if (n === 0) return "Original";
  return n > 0 ? `+${n}` : `${n}`;
}
