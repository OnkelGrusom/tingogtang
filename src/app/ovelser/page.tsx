import type { Metadata } from "next";
import { PracticePanel } from "@/components/practice/practice-panel";

export const metadata: Metadata = {
  title: "Øvelser",
  description: "Leksjoner, akkordprogresjoner og metronom for gitarøving.",
};

export default function OvelserPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Øvelser
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Korte leksjoner, klassiske progresjoner du kan transponere, og en
          innebygd metronom.
        </p>
      </header>
      <PracticePanel />
    </div>
  );
}
