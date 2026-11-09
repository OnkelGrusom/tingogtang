import type { Metadata } from "next";
import { ChordLibrary } from "@/components/chords/chord-library";

export const metadata: Metadata = {
  title: "Akkorder",
  description: "Interaktivt gitar-akkordbibliotek med diagrammer, fingring og lyd.",
};

export default function AkkorderPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Akkordbibliotek
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Velg en akkord for diagram, nøyaktige fingeringsinstruksjoner og
          avspilling. Filtrer på open, barre eller power chords.
        </p>
      </header>
      <ChordLibrary />
    </div>
  );
}
