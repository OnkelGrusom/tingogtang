export interface LessonStep {
  title: string;
  body: string;
  chords?: string[];
  progression?: string[];
  strumming?: string;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  durationMin: number;
  steps: LessonStep[];
}

export interface ProgressionExample {
  id: string;
  name: string;
  roman: string;
  key: string;
  chords: string[];
  description: string;
}

export const LESSONS: Lesson[] = [
  {
    id: "five-chords",
    title: "Lær de 5 viktigste akkordene",
    summary: "C, G, D, Am og Em – grunnlaget for hundrevis av sanger.",
    durationMin: 15,
    steps: [
      {
        title: "Em – den enkleste",
        body: "Bare to fingre. Øv til lyden er ren på alle strenger.",
        chords: ["Em"],
      },
      {
        title: "Am og C",
        body: "Am og C deler nesten samme form. Flytt bare fingrene litt.",
        chords: ["Am", "C"],
      },
      {
        title: "G og D",
        body: "G bruker flere fingre. D spilles på de tre tynneste strengene.",
        chords: ["G", "D"],
      },
      {
        title: "Sett dem sammen",
        body: "Spill C–G–Am–Em sakte. Bytt først når lyden er ren.",
        progression: ["C", "G", "Am", "Em"],
      },
    ],
  },
  {
    id: "chord-changes",
    title: "Bytte mellom akkorder",
    summary: "Raskere bytter uten å miste rytmen.",
    durationMin: 12,
    steps: [
      {
        title: "Pivot-fingre",
        body: "Finn fingre som kan bli liggende når du bytter (f.eks. Am → C).",
        chords: ["Am", "C"],
      },
      {
        title: "Fire slag per akkord",
        body: "Spill fire jevne nedslag, bytt, gjenta. Start på 60 BPM.",
        progression: ["G", "D", "Em", "C"],
        strumming: "↓ ↓ ↓ ↓",
      },
      {
        title: "To slag per akkord",
        body: "Når fire slag er trygt, halvér tiden. Hold håndleddet løst.",
        progression: ["G", "D", "Em", "C"],
        strumming: "↓ ↓",
      },
    ],
  },
  {
    id: "strumming",
    title: "Strumming-mønstre",
    summary: "Fra enkle nedslag til grove som svinger.",
    durationMin: 10,
    steps: [
      {
        title: "Kun nedslag",
        body: "Tell 1-2-3-4. Ett nedslag per tell. Hold tempoet med metronom.",
        progression: ["G", "C", "D", "G"],
        strumming: "↓   ↓   ↓   ↓",
      },
      {
        title: "Ned og opp",
        body: "Ned på tellingen, opp mellom. Hold armen i bevegelse hele tiden.",
        progression: ["Em", "C", "G", "D"],
        strumming: "↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑",
      },
      {
        title: "Klassisk pop-mønster",
        body: "Utelat noen slag for mer groove: ned – ned-opp – opp-ned-opp.",
        progression: ["C", "G", "Am", "F"],
        strumming: "↓   ↓ ↑   ↑ ↓ ↑",
      },
    ],
  },
];

export const PROGRESSIONS: ProgressionExample[] = [
  {
    id: "axis",
    name: "I–V–vi–IV",
    roman: "I–V–vi–IV",
    key: "C",
    chords: ["C", "G", "Am", "F"],
    description: "Det mest brukte pop-progresjonsmønsteret.",
  },
  {
    id: "vi-iv-i-v",
    name: "vi–IV–I–V",
    roman: "vi–IV–I–V",
    key: "C",
    chords: ["Am", "F", "C", "G"],
    description: "Samme akkorder, mer emosjonell start på moll.",
  },
  {
    id: "blues",
    name: "12-takters blues",
    roman: "I–I–I–I–IV–IV–I–I–V–IV–I–V",
    key: "A",
    chords: ["A7", "A7", "A7", "A7", "D7", "D7", "A7", "A7", "E7", "D7", "A7", "E7"],
    description: "Klassisk bluesform – øv med shuffle-følelse.",
  },
  {
    id: "folk",
    name: "I–vi–IV–V",
    roman: "I–vi–IV–V",
    key: "G",
    chords: ["G", "Em", "C", "D"],
    description: "Vanlig i folke- og visesang.",
  },
];
