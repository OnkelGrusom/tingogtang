"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { playMetronomeClick } from "@/lib/chords/audio";

interface MetronomeProps {
  defaultBpm?: number;
}

export function Metronome({ defaultBpm = 80 }: MetronomeProps) {
  const [bpm, setBpm] = useState(defaultBpm);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const beatRef = useRef(0);

  useEffect(() => {
    if (!running) return;

    const intervalMs = 60000 / bpm;
    const id = window.setInterval(() => {
      const next = (beatRef.current % 4) + 1;
      beatRef.current = next;
      setBeat(next);
      void playMetronomeClick(next === 1);
    }, intervalMs);

    // Immediate first click
    beatRef.current = 1;
    setBeat(1);
    void playMetronomeClick(true);

    return () => window.clearInterval(id);
  }, [running, bpm]);

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">Metronom</h3>
          <p className="text-sm text-muted-foreground">Hold tempoet jevnt</p>
        </div>
        <Button
          type="button"
          size="lg"
          className="min-h-12 min-w-12 gap-2"
          onClick={() => setRunning((v) => !v)}
          aria-pressed={running}
        >
          {running ? <Pause className="size-4" /> : <Play className="size-4" />}
          {running ? "Stopp" : "Start"}
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-3 flex-1 rounded-full transition-colors ${
              beat === n
                ? n === 1
                  ? "bg-amber-400"
                  : "bg-amber-400/60"
                : "bg-secondary"
            }`}
            aria-hidden
          />
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="bpm">Tempo</Label>
          <span className="font-mono text-lg font-semibold text-amber-300">
            {bpm} BPM
          </span>
        </div>
        <Slider
          id="bpm"
          min={40}
          max={160}
          step={1}
          value={[bpm]}
          onValueChange={(value) => {
            const next = Array.isArray(value) ? value[0] : value;
            if (typeof next === "number") setBpm(next);
          }}
          className="py-2"
          aria-label="BPM"
        />
      </div>
    </div>
  );
}
