export interface KaraokePreset {
  id: string;
  title: string;
  artistHint: string;
  bpm: number;
  /** Default beats each chord lasts unless overridden with [Chord:N] */
  beatsPerChord: number;
  text: string;
  tip: string;
}

export const KARAOKE_PRESETS: KaraokePreset[] = [
  {
    id: "yesterday",
    title: "Yesterday-stil",
    artistHint: "Ballade · G-dur",
    bpm: 96,
    beatsPerChord: 2,
    tip: "Hver akkord varer 2 slag. Øv sakte først (80 BPM).",
    text: `[G:2]Yesterday [C:2]all my [D:2]troubles seemed so [G:2]far away
[Em:2]Now it [A7:2]looks as though they're [D:2]here to [G:2]stay
Oh [C:2]I be[G/B:2]lieve in [Am:2]yester[D:2]day`,
  },
  {
    id: "pop-axis",
    title: "Pop-progresjon",
    artistHint: "I–V–vi–IV · C-dur",
    bpm: 100,
    beatsPerChord: 4,
    tip: "Klassisk pop-loop. Hold hver akkord én taktslag (4 slag).",
    text: `[C:4]Sing it out [G:4]loud tonight
[Am:4]Feel the beat [F:4]under lights
[C:4]Raise your voice [G:4]to the sky
[Am:4]We can make [F:4]it if we try`,
  },
  {
    id: "campfire",
    title: "Leirbål-vise",
    artistHint: "G–Em–C–D",
    bpm: 88,
    beatsPerChord: 4,
    tip: "Rolige nedslag. Bruk metronomen i hodet: 1-2-3-4.",
    text: `[G:4]Around the fire we [Em:4]sing along
[C:4]Simple chords and a [D:4]simple song
[G:4]Pass the guitar to [Em:4]your friend
[C:4]Play it once and [D:4]start again`,
  },
  {
    id: "fast-changes",
    title: "Raske bytter",
    artistHint: "Øvelse · Em–C–G–D",
    bpm: 110,
    beatsPerChord: 2,
    tip: "Kun 2 slag per akkord — perfekt for å trene bytter.",
    text: `[Em:2]Ready [C:2]steady [G:2]go and [D:2]play
[Em:2]Keep it [C:2]moving [G:2]all the [D:2]way
[Em:2]Fingers [C:2]ready [G:2]change and [D:2]stay
[Em:2]One more [C:2]round then [G:2]rest to[D:2]day`,
  },
];
