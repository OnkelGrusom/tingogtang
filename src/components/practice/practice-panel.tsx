"use client";

import { useMemo, useState } from "react";
import { ChordDiagram } from "@/components/chords/chord-diagram";
import { Metronome } from "@/components/practice/metronome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPrimaryVariant } from "@/lib/chords/data";
import { LESSONS, PROGRESSIONS } from "@/lib/practice/lessons";
import {
  formatSemitoneLabel,
  transposeChordSymbol,
} from "@/lib/chords/transpose";
import { Minus, Plus } from "lucide-react";

export function PracticePanel() {
  const [lessonId, setLessonId] = useState(LESSONS[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [progId, setProgId] = useState(PROGRESSIONS[0].id);
  const [semitones, setSemitones] = useState(0);

  const lesson = LESSONS.find((l) => l.id === lessonId)!;
  const step = lesson.steps[stepIndex];
  const progression = PROGRESSIONS.find((p) => p.id === progId)!;

  const transposedChords = useMemo(
    () => progression.chords.map((c) => transposeChordSymbol(c, semitones)),
    [progression, semitones],
  );

  const stepChords = step.chords ?? step.progression ?? [];

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              Leksjoner
            </h2>
            <p className="mt-1 text-muted-foreground">
              Korte, praktiske økter du kan gjøre med gitaren i fanget.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {LESSONS.map((l) => (
              <Button
                key={l.id}
                type="button"
                size="lg"
                variant={lessonId === l.id ? "default" : "outline"}
                className="min-h-11"
                onClick={() => {
                  setLessonId(l.id);
                  setStepIndex(0);
                }}
              >
                {l.title}
              </Button>
            ))}
          </div>

          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{lesson.title}</h3>
              <Badge variant="secondary">~{lesson.durationMin} min</Badge>
            </div>
            <p className="mb-6 text-muted-foreground">{lesson.summary}</p>

            <div className="mb-4 flex flex-wrap gap-2">
              {lesson.steps.map((s, i) => (
                <Button
                  key={s.title}
                  type="button"
                  size="sm"
                  variant={stepIndex === i ? "default" : "ghost"}
                  className="min-h-10"
                  onClick={() => setStepIndex(i)}
                >
                  {i + 1}. {s.title}
                </Button>
              ))}
            </div>

            <div className="rounded-lg bg-secondary/30 p-4">
              <h4 className="mb-2 font-semibold">{step.title}</h4>
              <p className="mb-4 text-foreground/90">{step.body}</p>
              {step.strumming && (
                <p className="mb-4 font-mono text-lg tracking-widest text-amber-300">
                  {step.strumming}
                </p>
              )}
              {stepChords.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {stepChords.map((symbol) => {
                    const variant = getPrimaryVariant(symbol);
                    if (!variant) {
                      return (
                        <div
                          key={symbol}
                          className="rounded-lg border border-border/50 p-3 text-center font-semibold"
                        >
                          {symbol}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={symbol}
                        className="rounded-lg border border-border/50 bg-background/40 p-2 text-center"
                      >
                        <div className="mb-1 font-semibold">{symbol}</div>
                        <div className="flex justify-center">
                          <ChordDiagram variant={variant} size="sm" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-h-11"
                disabled={stepIndex === 0}
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              >
                Forrige
              </Button>
              <Button
                type="button"
                size="lg"
                className="min-h-11"
                disabled={stepIndex >= lesson.steps.length - 1}
                onClick={() =>
                  setStepIndex((i) => Math.min(lesson.steps.length - 1, i + 1))
                }
              >
                Neste steg
              </Button>
            </div>
          </div>
        </div>

        <Metronome defaultBpm={72} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Vanlige progresjoner
          </h2>
          <p className="mt-1 text-muted-foreground">
            Øv I–V–vi–IV og andre klassikere. Transponer til din stemme.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PROGRESSIONS.map((p) => (
            <Button
              key={p.id}
              type="button"
              size="lg"
              variant={progId === p.id ? "default" : "outline"}
              className="min-h-11"
              onClick={() => {
                setProgId(p.id);
                setSemitones(0);
              }}
            >
              {p.name}
            </Button>
          ))}
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">{progression.name}</h3>
            <Badge variant="outline">{progression.roman}</Badge>
            <Badge variant="secondary">Toneart {progression.key}</Badge>
          </div>
          <p className="mb-4 text-muted-foreground">{progression.description}</p>

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">Transponer</span>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={() => setSemitones((n) => n - 1)}
              aria-label="Ned"
            >
              <Minus className="size-4" />
            </Button>
            <span className="min-w-14 text-center font-mono text-lg text-amber-300">
              {formatSemitoneLabel(semitones)}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={() => setSemitones((n) => n + 1)}
              aria-label="Opp"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {transposedChords.map((chord, i) => (
              <div
                key={`${chord}-${i}`}
                className="min-w-16 rounded-lg bg-amber-500/15 px-4 py-3 text-center font-mono text-lg font-semibold text-amber-200"
              >
                {chord}
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...new Set(transposedChords)].slice(0, 8).map((symbol) => {
              const root = symbol.replace(/\/.*/, "");
              const variant = getPrimaryVariant(root);
              if (!variant) return null;
              return (
                <div
                  key={symbol}
                  className="rounded-lg border border-border/50 p-2 text-center"
                >
                  <div className="mb-1 text-sm font-semibold">{symbol}</div>
                  <div className="flex justify-center">
                    <ChordDiagram variant={variant} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
