/** Quick sanity checks for transpose helpers (mirrored logic). */
const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const ENHARMONIC = { Db:"C#", Eb:"D#", Gb:"F#", Ab:"G#", Bb:"A#" };

function noteToIndex(note) {
  const n = ENHARMONIC[note] ?? note;
  const i = NOTES.indexOf(n);
  if (i < 0) throw new Error(note);
  return i;
}

function transposeNote(note, semitones) {
  return NOTES[(noteToIndex(note) + semitones + 120) % 12];
}

function parseChord(raw) {
  const match = raw.trim().match(/^([A-Ga-g])([#b]?)(.*?)(?:\/([A-Ga-g][#b]?))?$/);
  if (!match) return null;
  const [, letter, accidental = "", quality = "", bass] = match;
  return {
    root: `${letter.toUpperCase()}${accidental}`,
    quality,
    bass: bass ? `${bass[0].toUpperCase()}${bass.slice(1)}` : null,
  };
}

function transposeChordSymbol(symbol, semitones) {
  const p = parseChord(symbol);
  if (!p) return symbol;
  const root = transposeNote(p.root, semitones);
  const bass = p.bass ? transposeNote(p.bass, semitones) : null;
  return bass ? `${root}${p.quality}/${bass}` : `${root}${p.quality}`;
}

const cases = [
  ["Am", 2, "Bm"],
  ["C", -1, "B"],
  ["C/G", 2, "D/A"],
  ["Am7", 3, "Cm7"],
  ["Am7", 4, "C#m7"],
  ["F#m", 1, "Gm"],
  ["Bb", 1, "B"],
];

let failed = 0;
for (const [input, semis, expected] of cases) {
  const got = transposeChordSymbol(input, semis);
  if (got !== expected) {
    console.error(`FAIL ${input} +${semis} => ${got} (expected ${expected})`);
    failed++;
  } else {
    console.log(`OK   ${input} +${semis} => ${got}`);
  }
}

const song = "[Am]hei [C/G]på [F]deg";
const out = song.replace(/\[([^\]]+)\]/g, (_, c) => `[${transposeChordSymbol(c, 2)}]`);
const expectedSong = "[Bm]hei [D/A]på [G]deg";
if (out !== expectedSong) {
  console.error(`FAIL song => ${out}`);
  failed++;
} else {
  console.log(`OK   song => ${out}`);
}

process.exit(failed ? 1 : 0);
