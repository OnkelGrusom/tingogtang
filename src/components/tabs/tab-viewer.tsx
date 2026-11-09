"use client";

import { useMemo, useState } from "react";
import { ChordDiagram } from "@/components/chords/chord-diagram";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPrimaryVariant } from "@/lib/chords/data";
import { variantToTabLines } from "@/lib/chords/fingerings";
import { getFingeringInstructions } from "@/lib/chords/fingerings";
import { chordProgressionToTab, TAB_EXERCISES } from "@/lib/tabs/data";
import type { FretValue } from "@/lib/chords/types";
import { cn } from "@/lib/utils";

const PROGRESSION_PRESETS = [
  { id: "g-c-d", label: "G – C – D", chords: ["G", "C", "D"] },
  { id: "em-c-g-d", label: "Em – C – G – D", chords: ["Em", "C", "G", "D"] },
  { id: "c-g-am-f", label: "C – G – Am – F", chords: ["C", "G", "Am", "F"] },
  { id: "am-f-c-g", label: "Am – F – C – G", chords: ["Am", "F", "C", "G"] },
];

export function TabViewer() {
  const [selectedExercise, setSelectedExercise] = useState(TAB_EXERCISES[0].id);
  const [presetId, setPresetId] = useState(PROGRESSION_PRESETS[0].id);

  const exercise = TAB_EXERCISES.find((e) => e.id === selectedExercise)!;
  const preset = PROGRESSION_PRESETS.find((p) => p.id === presetId)!;

  const generated = useMemo(() => {
    const variants = preset.chords
      .map((symbol) => getPrimaryVariant(symbol))
      .filter(Boolean);

    const fretsList = variants.map(
      (v) => v!.frets as [FretValue, FretValue, FretValue, FretValue, FretValue, FretValue],
    );
    const ascii = chordProgressionToTab(
      fretsList as Array<[string | number, string | number, string | number, string | number, string | number, string | number]>,
      preset.chords,
    );

    return { variants: variants.map((v) => v!), ascii };
  }, [preset]);

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Øvelser og riff
          </h2>
          <p className="mt-1 text-muted-foreground">
            ASCII-tabs for vanlige øvelser. Trykk for å bytte.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TAB_EXERCISES.map((ex) => (
            <Button
              key={ex.id}
              type="button"
              size="lg"
              variant={selectedExercise === ex.id ? "default" : "outline"}
              className="min-h-11"
              onClick={() => setSelectedExercise(ex.id)}
            >
              {ex.title}
            </Button>
          ))}
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">{exercise.title}</h3>
            <Badge variant="secondary">{exercise.difficulty}</Badge>
          </div>
          <p className="mb-4 text-muted-foreground">{exercise.description}</p>
          <TabAscii tab={exercise.tab} />
          <ul className="mt-4 space-y-2 text-sm text-foreground/85">
            {exercise.tips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="text-amber-400" aria-hidden>
                  •
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Generer tab fra progresjon
          </h2>
          <p className="mt-1 text-muted-foreground">
            Se hvordan hver akkord ser ut som tab, med fingring ved siden av.
          </p>
        </div>

        <div className="max-w-sm space-y-2">
          <Label>Akkordprogresjon</Label>
          <Select
            value={presetId}
            onValueChange={(value) => {
              if (value) setPresetId(value);
            }}
          >
            <SelectTrigger className="h-12 w-full text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROGRESSION_PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabAscii tab={generated.ascii} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {generated.variants.map((variant) => (
            <div
              key={variant.id}
              className="rounded-xl border border-border/60 bg-card/40 p-4"
            >
              <div className="mb-2 text-center text-lg font-semibold">
                {variant.symbol}
              </div>
              <div className="flex justify-center">
                <ChordDiagram variant={variant} size="sm" />
              </div>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-950/60 p-2 font-mono text-[11px] leading-snug text-zinc-300">
                {variantToTabLines(variant).join("\n")}
              </pre>
              <ol className="mt-3 space-y-1 text-xs text-muted-foreground">
                {getFingeringInstructions(variant)
                  .slice(0, 4)
                  .map((line) => (
                    <li key={line}>{line}</li>
                  ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TabAscii({ tab, className }: { tab: string; className?: string }) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-xl border border-border/50 bg-zinc-950/70 p-4 font-mono text-sm leading-relaxed text-emerald-300/90",
        className,
      )}
      aria-label="Gitar-tab"
    >
      {tab}
    </pre>
  );
}
