"use client";

import {
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChordDiagram } from "@/components/chords/chord-diagram";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { playNotes } from "@/lib/chords/audio";
import { resolveChordVariant } from "@/lib/chords/resolve";
import { transposeSongText } from "@/lib/chords/transpose";
import {
  beatToMs,
  findActiveSegment,
  formatClock,
  msToBeat,
  parseKaraokeSong,
  type KaraokeSegment,
} from "@/lib/karaoke/parse";
import { KARAOKE_PRESETS } from "@/lib/karaoke/songs";
import { cn } from "@/lib/utils";

export function KaraokePlayer() {
  const [presetId, setPresetId] = useState(KARAOKE_PRESETS[0].id);
  const preset = KARAOKE_PRESETS.find((p) => p.id === presetId)!;

  const [text, setText] = useState(preset.text);
  const [bpm, setBpm] = useState(preset.bpm);
  const [beatsPerChord, setBeatsPerChord] = useState(preset.beatsPerChord);
  const [semitones, setSemitones] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [title, setTitle] = useState(preset.title);

  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const baseElapsedRef = useRef(0);
  const lastChordRef = useRef<string | null>(null);
  const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const songText = useMemo(
    () => transposeSongText(text, semitones),
    [text, semitones],
  );

  const timeline = useMemo(
    () => parseKaraokeSong(songText, beatsPerChord),
    [songText, beatsPerChord],
  );

  const totalMs = beatToMs(timeline.totalBeats, bpm);
  const currentBeat = msToBeat(elapsedMs, bpm);
  const active = findActiveSegment(timeline.segments, currentBeat);
  const activeIndex = active
    ? timeline.segments.findIndex((s) => s.id === active.id)
    : -1;
  const nextChordSeg = timeline.segments
    .slice(activeIndex + 1)
    .find((s) => s.chord);

  const activeVariant = active?.chord
    ? resolveChordVariant(active.chord)
    : null;
  const nextVariant = nextChordSeg?.chord
    ? resolveChordVariant(nextChordSeg.chord)
    : null;

  // Group segments by line for rendering
  const lineGroups = useMemo(() => {
    const map = new Map<number, KaraokeSegment[]>();
    for (const seg of timeline.segments) {
      const list = map.get(seg.lineIndex) ?? [];
      list.push(seg);
      map.set(seg.lineIndex, list);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [timeline.segments]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startedAtRef.current = null;
      return;
    }

    startedAtRef.current = performance.now();
    const tick = (now: number) => {
      const started = startedAtRef.current ?? now;
      const next = baseElapsedRef.current + (now - started);
      if (next >= totalMs) {
        setElapsedMs(totalMs);
        setPlaying(false);
        baseElapsedRef.current = totalMs;
        return;
      }
      setElapsedMs(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, totalMs]);

  // Chord change sound + auto-scroll
  useEffect(() => {
    if (!active) return;

    if (active.chord && active.chord !== lastChordRef.current) {
      lastChordRef.current = active.chord;
      if (soundOn && playing) {
        const variant = resolveChordVariant(active.chord);
        if (variant) void playNotes(variant.notes, { duration: 0.9, stagger: 0.03 });
      }
    }

    const el = lineRefs.current.get(active.lineIndex);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [active, soundOn, playing]);

  function loadPreset(id: string) {
    const p = KARAOKE_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPresetId(id);
    setText(p.text);
    setBpm(p.bpm);
    setBeatsPerChord(p.beatsPerChord);
    setTitle(p.title);
    setSemitones(0);
    resetPlayback();
  }

  function resetPlayback() {
    setPlaying(false);
    setElapsedMs(0);
    baseElapsedRef.current = 0;
    lastChordRef.current = null;
  }

  function togglePlay() {
    if (elapsedMs >= totalMs && totalMs > 0) {
      baseElapsedRef.current = 0;
      setElapsedMs(0);
      lastChordRef.current = null;
    } else {
      baseElapsedRef.current = elapsedMs;
    }
    setPlaying((v) => !v);
  }

  function seekToSegment(seg: KaraokeSegment) {
    const ms = beatToMs(seg.startBeat, bpm);
    baseElapsedRef.current = ms;
    setElapsedMs(ms);
    lastChordRef.current = null;
    if (!playing) {
      // peek state only
    }
  }

  const progress = totalMs > 0 ? Math.min(1, elapsedMs / totalMs) : 0;
  const beatInBar = Math.floor(currentBeat % 4) + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {KARAOKE_PRESETS.map((p) => (
          <Button
            key={p.id}
            type="button"
            size="lg"
            variant={presetId === p.id ? "default" : "outline"}
            className="min-h-11"
            onClick={() => loadPreset(p.id)}
          >
            {p.title}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Stage */}
        <div className="space-y-4">
          <div className="sticky top-20 z-20 space-y-4 rounded-2xl border border-amber-500/25 bg-zinc-950/90 p-4 shadow-lg backdrop-blur-md sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {preset.artistHint} · {formatClock(elapsedMs)} /{" "}
                  {formatClock(totalMs)}
                </p>
              </div>
              <Badge variant="secondary" className="font-mono">
                slag {beatInBar}/4
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="rounded-xl border border-border/50 bg-secondary/30 p-3 text-center">
                <div className="mb-1 text-[10px] tracking-wider text-muted-foreground uppercase">
                  Nå
                </div>
                <div className="font-mono text-3xl font-bold text-amber-300 sm:text-4xl">
                  {active?.chord ?? "—"}
                </div>
                {activeVariant ? (
                  <div className="mt-2 flex justify-center">
                    <ChordDiagram variant={activeVariant} size="sm" />
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">
                    {active?.chord
                      ? "Ingen diagram i biblioteket"
                      : "Pause / intro"}
                  </p>
                )}
              </div>

              <div className="hidden flex-col items-center gap-2 sm:flex">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={cn(
                        "size-3 rounded-full transition-colors",
                        playing && beatInBar === n
                          ? n === 1
                            ? "bg-amber-400"
                            : "bg-amber-400/70"
                          : "bg-secondary",
                      )}
                    />
                  ))}
                </div>
                <span className="font-mono text-sm text-muted-foreground">
                  {Math.round(bpm)} BPM
                </span>
              </div>

              <div className="rounded-xl border border-border/40 bg-card/40 p-3 text-center opacity-80">
                <div className="mb-1 text-[10px] tracking-wider text-muted-foreground uppercase">
                  Neste
                </div>
                <div className="font-mono text-2xl font-semibold text-zinc-300">
                  {nextChordSeg?.chord ?? "—"}
                </div>
                {nextVariant && (
                  <div className="mt-2 flex justify-center scale-90">
                    <ChordDiagram variant={nextVariant} size="sm" />
                  </div>
                )}
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-amber-500 transition-[width] duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="lg"
                className="min-h-12 min-w-28 gap-2 bg-amber-500 text-zinc-950 hover:bg-amber-400"
                onClick={togglePlay}
              >
                {playing ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
                {playing ? "Pause" : "Spill"}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="min-h-12"
                onClick={resetPlayback}
                aria-label="Til start"
              >
                <SkipBack className="size-4" />
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="min-h-12 gap-2"
                onClick={() => setSoundOn((v) => !v)}
                aria-pressed={soundOn}
              >
                {soundOn ? (
                  <Volume2 className="size-4" />
                ) : (
                  <VolumeX className="size-4" />
                )}
                {soundOn ? "Lyd på" : "Lyd av"}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="ghost"
                className="min-h-12 gap-2"
                onClick={() => {
                  setSemitones(0);
                  resetPlayback();
                }}
              >
                <RotateCcw className="size-4" />
                Nullstill toneart
              </Button>
            </div>
          </div>

          {/* Lyrics stage */}
          <div
            className="max-h-[min(60vh,520px)] space-y-3 overflow-y-auto rounded-2xl border border-border/50 bg-card/30 p-4 sm:p-6"
            aria-live="polite"
          >
            {lineGroups.map(([lineIndex, segs]) => {
              const isActiveLine = active?.lineIndex === lineIndex;
              const onlyBreath =
                segs.length === 1 && !segs[0].chord && !segs[0].text;
              if (onlyBreath) {
                return (
                  <div
                    key={lineIndex}
                    ref={(el) => {
                      if (el) lineRefs.current.set(lineIndex, el);
                      else lineRefs.current.delete(lineIndex);
                    }}
                    className="h-4"
                  />
                );
              }

              return (
                <div
                  key={lineIndex}
                  ref={(el) => {
                    if (el) lineRefs.current.set(lineIndex, el);
                    else lineRefs.current.delete(lineIndex);
                  }}
                  className={cn(
                    "rounded-xl px-3 py-3 transition-colors",
                    isActiveLine && "bg-amber-500/10 ring-1 ring-amber-500/30",
                  )}
                >
                  <div className="flex flex-wrap items-end gap-x-1 gap-y-3">
                    {segs.map((seg) => {
                      const isActive = active?.id === seg.id;
                      return (
                        <button
                          key={seg.id}
                          type="button"
                          onClick={() => seekToSegment(seg)}
                          className={cn(
                            "inline-flex min-h-11 flex-col items-start rounded-lg px-1.5 py-1 text-left transition-all",
                            isActive
                              ? "bg-amber-500/20 scale-[1.03]"
                              : "hover:bg-secondary/60",
                          )}
                        >
                          {seg.chord && (
                            <span
                              className={cn(
                                "font-mono text-sm font-bold leading-none",
                                isActive ? "text-amber-300" : "text-amber-500/70",
                              )}
                            >
                              {seg.chord}
                            </span>
                          )}
                          <span
                            className={cn(
                              "text-lg leading-snug sm:text-xl",
                              isActive
                                ? "font-semibold text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {seg.text || (seg.chord ? "·" : "")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls / editor */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-3 rounded-xl border border-border/60 bg-card/50 p-4">
            <div className="flex items-center justify-between">
              <Label>Tempo</Label>
              <span className="font-mono text-lg font-semibold text-amber-300">
                {bpm} BPM
              </span>
            </div>
            <Slider
              min={50}
              max={160}
              step={1}
              value={[bpm]}
              onValueChange={(value) => {
                const next = Array.isArray(value) ? value[0] : value;
                if (typeof next !== "number") return;
                // Keep musical position when changing tempo mid-song
                const beat = msToBeat(elapsedMs, bpm);
                setBpm(next);
                const ms = beatToMs(beat, next);
                setElapsedMs(ms);
                baseElapsedRef.current = ms;
              }}
              className="py-2"
              aria-label="BPM"
            />
            <p className="text-xs text-muted-foreground">{preset.tip}</p>
          </div>

          <div className="space-y-3 rounded-xl border border-border/60 bg-card/50 p-4">
            <div className="flex items-center justify-between">
              <Label>Slag per akkord</Label>
              <span className="font-mono text-lg font-semibold">{beatsPerChord}</span>
            </div>
            <Slider
              min={1}
              max={8}
              step={1}
              value={[beatsPerChord]}
              onValueChange={(value) => {
                const next = Array.isArray(value) ? value[0] : value;
                if (typeof next === "number") {
                  setBeatsPerChord(next);
                  resetPlayback();
                }
              }}
              className="py-2"
              aria-label="Standard slag per akkord"
            />
            <p className="text-xs text-muted-foreground">
              Brukes når akkorden ikke har <code className="font-mono">:N</code>{" "}
              (f.eks. <code className="font-mono">[Am:2]</code>).
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-border/60 bg-card/50 p-4">
            <div className="flex items-center justify-between">
              <Label>Transponering</Label>
              <span className="font-mono text-lg font-semibold text-amber-300">
                {semitones === 0 ? "0" : semitones > 0 ? `+${semitones}` : semitones}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[-2, -1, 0, 1, 2].map((n) => (
                <Button
                  key={n}
                  type="button"
                  size="sm"
                  variant={semitones === n ? "default" : "outline"}
                  className="min-h-10 min-w-12"
                  onClick={() => {
                    setSemitones(n);
                    resetPlayback();
                  }}
                >
                  {n === 0 ? "0" : n > 0 ? `+${n}` : `${n}`}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Transponering oppdaterer både tekst, akkorder og grep-diagram live.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="karaoke-text">Sangtekst</Label>
            <Textarea
              id="karaoke-text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setTitle("Egen sang");
                resetPlayback();
              }}
              className="min-h-44 font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
            <p className="text-xs text-muted-foreground">
              Format:{" "}
              <code className="rounded bg-secondary px-1 font-mono">
                [Am]tekst [C:2]kort
              </code>
              . Klikk et ord for å hoppe dit.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
