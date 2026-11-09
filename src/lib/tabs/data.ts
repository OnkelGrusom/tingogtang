export interface TabExercise {
  id: string;
  title: string;
  description: string;
  difficulty: "nybegynner" | "middels" | "avansert";
  /** ASCII tab, high e to low E */
  tab: string;
  tips: string[];
}

export const TAB_EXERCISES: TabExercise[] = [
  {
    id: "open-strings",
    title: "Åpne strenger",
    description: "Lær strengene ovenfra og ned. Spill én og én.",
    difficulty: "nybegynner",
    tab: `e|---0-----------|
B|-----0---------|
G|-------0-------|
D|---------0-----|
A|-----------0---|
E|-------------0-|`,
    tips: [
      "Tell strengene: 1 (e), 2 (B), 3 (G), 4 (D), 5 (A), 6 (E).",
      "Bruk høyre hånd (eller plukkefinger) og lytt til tonen.",
    ],
  },
  {
    id: "spider-walk",
    title: "Edderkopp-øvelse",
    description: "Klassisk fingeruavhengighet på 1.–4. bånd.",
    difficulty: "middels",
    tab: `e|----------------|
B|----------------|
G|----------------|
D|----------------|
A|--------------1-2-3-4-|
E|--1-2-3-4-1-2-3-4-----|`,
    tips: [
      "Én finger per bånd: 1. på 1., 2. på 2., osv.",
      "Hold tempo jevnt – bruk metronom på 60 BPM.",
    ],
  },
  {
    id: "smoke-riff",
    title: "Enkelt power-riff",
    description: "Klassisk power chord-bevegelse i Em.",
    difficulty: "middels",
    tab: `e|----------------|
B|----------------|
G|----------------|
D|------2-----2---|
A|------2-----2---|
E|--0-0---0-3-----|`,
    tips: [
      "Bruk 1. finger på 3. bånd (lav E) og 3./4. på A/D.",
      "Dempet strengeklikk (palm mute) gir mer groove.",
    ],
  },
  {
    id: "g-c-d",
    title: "G–C–D arpeggio",
    description: "Spill akkordtonene én etter én.",
    difficulty: "nybegynner",
    tab: `e|------3-------0-------2---|
B|----0-------1-------3-----|
G|--0-------0-------2-------|
D|--------------------------|
A|----------3---------------|
E|--3-----------------------|`,
    tips: [
      "Form G, C og D med venstre hånd mens du plukker.",
      "Spill sakte og la tonene ringe.",
    ],
  },
];

export function chordProgressionToTab(
  fretsList: Array<[string | number, string | number, string | number, string | number, string | number, string | number]>,
  labels: string[],
): string {
  const names = ["e", "B", "G", "D", "A", "E"] as const;
  const columns = fretsList.map((frets) =>
    [...frets].reverse().map((f) => (f === "x" ? "x" : String(f))),
  );

  const header =
    labels.length > 0
      ? labels.map((l) => l.padStart(3, " ").slice(0, 3)).join(" ")
      : "";

  const lines = names.map((name, stringIdx) => {
    const cells = columns
      .map((col) => {
        const cell = col[stringIdx];
        return cell.length === 1 ? `-${cell}-` : `-${cell}`;
      })
      .join("");
    return `${name}|${cells}|`;
  });

  return header ? `${header}\n${lines.join("\n")}` : lines.join("\n");
}
