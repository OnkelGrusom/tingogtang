/** Sanity checks for karaoke beat parsing (mirrored logic). */
const TOKEN =
  /\[([A-Ga-g][#b]?(?:[^\]:/]*)?(?:\/[A-Ga-g][#b]?)?)(?::(\d+(?:\.\d+)?))?\]/g;

function parse(text, defaultBeats = 4) {
  const lines = text.split("\n");
  const segments = [];
  let beat = 0;
  for (const [lineIndex, line] of lines.entries()) {
    const trimmed = line.trimEnd();
    if (!trimmed) {
      const b = Math.max(1, defaultBeats / 2);
      segments.push({ lineIndex, chord: null, text: "", beats: b, startBeat: beat });
      beat += b;
      continue;
    }
    TOKEN.lastIndex = 0;
    const matches = [...trimmed.matchAll(TOKEN)];
    if (!matches.length) {
      segments.push({
        lineIndex,
        chord: null,
        text: trimmed,
        beats: defaultBeats,
        startBeat: beat,
      });
      beat += defaultBeats;
      continue;
    }
    matches.forEach((match, i) => {
      const chord = match[1];
      const explicit = match[2] ? Number(match[2]) : defaultBeats;
      const start = match.index ?? 0;
      const end = start + match[0].length;
      const next =
        i + 1 < matches.length ? (matches[i + 1].index ?? trimmed.length) : trimmed.length;
      segments.push({
        lineIndex,
        chord,
        text: trimmed.slice(end, next),
        beats: explicit,
        startBeat: beat,
      });
      beat += explicit;
    });
  }
  return { segments, totalBeats: beat };
}

const sample = `[G:2]Yesterday [C:2]all my [D:2]troubles
[Em:2]Now it [A7:2]looks`;
const { segments, totalBeats } = parse(sample, 4);
const expectedChords = ["G", "C", "D", "Em", "A7"];
const got = segments.map((s) => s.chord).filter(Boolean);
let failed = 0;
if (JSON.stringify(got) !== JSON.stringify(expectedChords)) {
  console.error("FAIL chords", got);
  failed++;
} else console.log("OK chords", got);

if (totalBeats !== 10) {
  console.error("FAIL totalBeats", totalBeats);
  failed++;
} else console.log("OK totalBeats", totalBeats);

const withBass = parse(`[C/G:2]bass [Am7]moll`, 4);
if (withBass.segments[0].chord !== "C/G" || withBass.segments[1].chord !== "Am7") {
  console.error("FAIL bass/quality", withBass.segments);
  failed++;
} else console.log("OK bass/quality");

process.exit(failed ? 1 : 0);
