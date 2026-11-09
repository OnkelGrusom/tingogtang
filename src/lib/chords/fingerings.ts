import type { ChordFinger, ChordVariant, FingerNumber } from "./types";
import { FINGER_NAMES_NO, STRING_LABELS_NO } from "./types";

/** Convert string number (6=low E) to frets array index (0=low E) */
export function stringToIndex(string: number): number {
  return 6 - string;
}

export function formatFingeringInstruction(finger: ChordFinger): string {
  const fingerName = FINGER_NAMES_NO[finger.finger];
  const stringLabel = STRING_LABELS_NO[stringToIndex(finger.string)];
  return `${fingerName} på ${finger.fret}. bånd, ${stringLabel}`;
}

export function getFingeringInstructions(variant: ChordVariant): string[] {
  const instructions: string[] = [];

  if (variant.barres?.length) {
    for (const barre of variant.barres) {
      const from = STRING_LABELS_NO[stringToIndex(barre.fromString)];
      const to = STRING_LABELS_NO[stringToIndex(barre.toString)];
      instructions.push(
        `Barré med 1. finger på ${barre.fret}. bånd (${from} → ${to})`,
      );
    }
  }

  // Skip individual fingers that are part of a barre on the same fret with finger 1
  const barreFrets = new Set(
    (variant.barres ?? [])
      .filter(() => true)
      .map((b) => b.fret),
  );

  const sorted = [...variant.fingers].sort((a, b) => {
    if (a.finger === "T") return -1;
    if (b.finger === "T") return 1;
    return (a.finger as number) - (b.finger as number);
  });

  for (const finger of sorted) {
    if (
      finger.finger === 1 &&
      barreFrets.has(finger.fret) &&
      variant.barres?.some(
        (b) =>
          b.fret === finger.fret &&
          finger.string <= b.fromString &&
          finger.string >= b.toString,
      )
    ) {
      continue;
    }
    instructions.push(formatFingeringInstruction(finger));
  }

  // Open / muted strings
  variant.frets.forEach((fret, i) => {
    if (fret === 0) {
      instructions.push(`Åpen streng: ${STRING_LABELS_NO[i]}`);
    } else if (fret === "x") {
      instructions.push(`Dempet (ikke spill): ${STRING_LABELS_NO[i]}`);
    }
  });

  return instructions;
}

export function fingerDisplay(finger: FingerNumber): string {
  return String(finger);
}

/** Convert chord frets to ASCII tab lines (high e → low E) */
export function variantToTabLines(variant: ChordVariant): string[] {
  const names = ["e", "B", "G", "D", "A", "E"];
  const fretsHighToLow = [...variant.frets].reverse();

  return names.map((name, i) => {
    const f = fretsHighToLow[i];
    const cell = f === "x" ? "x" : String(f);
    const pad = cell.length === 1 ? `-${cell}-` : `-${cell}`;
    return `${name}|${pad}|`;
  });
}
