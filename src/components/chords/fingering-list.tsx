"use client";

import { getFingeringInstructions } from "@/lib/chords/fingerings";
import type { ChordVariant } from "@/lib/chords/types";

interface FingeringListProps {
  variant: ChordVariant;
}

export function FingeringList({ variant }: FingeringListProps) {
  const instructions = getFingeringInstructions(variant);

  return (
    <ol className="space-y-2 text-sm leading-relaxed text-muted-foreground">
      {instructions.map((text, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">
            {i + 1}
          </span>
          <span className="pt-0.5 text-foreground/90">{text}</span>
        </li>
      ))}
    </ol>
  );
}
