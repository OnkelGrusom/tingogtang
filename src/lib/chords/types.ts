export type ChordVariantType = "open" | "barre" | "power";

/** String index: 6 = low E, 1 = high e */
export type StringNumber = 1 | 2 | 3 | 4 | 5 | 6;

/** Finger: 1=index, 2=middle, 3=ring, 4=pinky, T=thumb */
export type FingerNumber = 1 | 2 | 3 | 4 | "T";

/** Fret value per string: number = fretted, 0 = open, "x" = muted */
export type FretValue = number | 0 | "x";

export interface ChordFinger {
  string: StringNumber;
  fret: number;
  finger: FingerNumber;
}

export interface Barre {
  fret: number;
  fromString: StringNumber;
  toString: StringNumber;
}

export interface ChordVariant {
  id: string;
  /** Display name e.g. "C", "F barre", "Em power" */
  label: string;
  /** Root chord symbol for search/transpose matching e.g. "C", "Am", "F" */
  symbol: string;
  variant: ChordVariantType;
  /** First fret shown on the diagram (1 = nut/open position) */
  baseFret: number;
  /** Frets from low E (index 0) to high e (index 5) */
  frets: [FretValue, FretValue, FretValue, FretValue, FretValue, FretValue];
  fingers: ChordFinger[];
  barres?: Barre[];
  /** MIDI-ish note names for audio, low to high sounding notes */
  notes: string[];
}

export interface ChordGroup {
  symbol: string;
  name: string;
  quality: "major" | "minor" | "dominant7" | "minor7" | "other";
  variants: ChordVariant[];
}

export const STRING_NAMES = ["E", "A", "D", "G", "B", "e"] as const;
export const STRING_LABELS_NO = [
  "6. streng (lav E)",
  "5. streng (A)",
  "4. streng (D)",
  "3. streng (G)",
  "2. streng (B)",
  "1. streng (høy e)",
] as const;

export const FINGER_NAMES_NO: Record<FingerNumber, string> = {
  1: "1. finger (pekefinger)",
  2: "2. finger (langfinger)",
  3: "3. finger (ringfinger)",
  4: "4. finger (lillefinger)",
  T: "Tommel",
};
