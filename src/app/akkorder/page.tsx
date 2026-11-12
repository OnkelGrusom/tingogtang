import type { Metadata } from "next";
import { ChordLibrary } from "@/components/chords/chord-library";
import { GuitarTuner } from "@/components/tuner/guitar-tuner";

export const metadata: Metadata = {
  title: "Akkorder",
  description:
    "Stem gitaren og utforsk akkordbiblioteket med diagrammer, fingring og lyd.",
};

export default function AkkorderPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Akkordbibliotek
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Stem gitaren først, deretter velg akkorder for diagram, fingring og
          avspilling. Bruk «Nybegynner» for å skjule barre og komplekse grep.
        </p>
      </header>
      <GuitarTuner />
      <ChordLibrary />
    </div>
  );
}
