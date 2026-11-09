import type { Metadata } from "next";
import { TransposeEditor } from "@/components/transpose/transpose-editor";

export const metadata: Metadata = {
  title: "Transponer sang",
  description: "Lim inn sangtekst med akkorder og transponer i halvtoner.",
};

export default function TransponerPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Transponer sang
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Lim inn tekst i formatet{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm">
            [Am]tekst [C]tekst
          </code>
          . Støtter bassnoter som C/G og kvaliteter som Am7. Lagrede sanger
          huskes i nettleseren.
        </p>
      </header>
      <TransposeEditor />
    </div>
  );
}
