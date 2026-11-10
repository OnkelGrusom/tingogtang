import { findGroupBySymbol, getPrimaryVariant } from "./data";
import { parseChord } from "./transpose";
import type { ChordVariant } from "./types";

/**
 * Best-effort lookup for diagrams when the exact symbol
 * (e.g. G/B, Am7, Fmaj7) is missing from the library.
 */
export function resolveChordVariant(symbol: string): ChordVariant | null {
  const direct = getPrimaryVariant(symbol);
  if (direct) return direct;

  const parsed = parseChord(symbol);
  if (!parsed) return null;

  const withoutBass = `${parsed.root}${parsed.quality}`;
  const byQuality = getPrimaryVariant(withoutBass);
  if (byQuality) return byQuality;

  // Strip digits / extensions gradually: Am7 -> Am, Cmaj7 -> Cmaj -> C
  const quality = parsed.quality;
  const candidates = [
    `${parsed.root}${quality.replace(/maj7|add9|sus4|sus2|dim|aug/, "")}`,
    `${parsed.root}${quality.replace(/[0-9]/g, "")}`,
    `${parsed.root}m`,
    parsed.root,
  ];

  for (const c of candidates) {
    if (!c || c === withoutBass) continue;
    const found = getPrimaryVariant(c);
    if (found) return found;
  }

  // Last resort: any group whose symbol starts with the root
  const group = findGroupBySymbol(parsed.root);
  return group?.variants[0] ?? null;
}
