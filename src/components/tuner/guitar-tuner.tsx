"use client";

import { Mic, MicOff, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { noteToFrequency, playNotes } from "@/lib/chords/audio";
import {
  clamp,
  detectPitchAutocorrelation,
  frequencyToCents,
} from "@/lib/chords/pitch";
import { cn } from "@/lib/utils";

interface GuitarString {
  id: number;
  label: string;
  note: string;
  freq: number;
}

const STRINGS: GuitarString[] = [
  { id: 6, label: "6E", note: "E2", freq: noteToFrequency("E2") },
  { id: 5, label: "5A", note: "A2", freq: noteToFrequency("A2") },
  { id: 4, label: "4D", note: "D3", freq: noteToFrequency("D3") },
  { id: 3, label: "3G", note: "G3", freq: noteToFrequency("G3") },
  { id: 2, label: "2B", note: "B3", freq: noteToFrequency("B3") },
  { id: 1, label: "1e", note: "E4", freq: noteToFrequency("E4") },
];

type TunerStatus = "idle" | "listening" | "denied" | "unsupported" | "error";

function nearestString(freq: number): GuitarString {
  let best = STRINGS[0];
  let bestDiff = Infinity;
  for (const s of STRINGS) {
    const diff = Math.abs(frequencyToCents(freq, s.freq));
    if (diff < bestDiff) {
      bestDiff = diff;
      best = s;
    }
  }
  return best;
}

export function GuitarTuner() {
  const [status, setStatus] = useState<TunerStatus>("idle");
  const [selectedId, setSelectedId] = useState(6);
  const [detectedHz, setDetectedHz] = useState<number | null>(null);
  const [cents, setCents] = useState(0);
  const [lockedString, setLockedString] = useState<GuitarString | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const bufferRef = useRef<Float32Array | null>(null);
  const selectedIdRef = useRef(selectedId);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    return () => {
      stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cleanup only on unmount
  }, []);

  function stopListening() {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    if (ctxRef.current && ctxRef.current.state !== "closed") {
      void ctxRef.current.close();
    }
    ctxRef.current = null;
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    bufferRef.current = null;
    setDetectedHz(null);
    setCents(0);
    setLockedString(null);
  }

  async function startListening() {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    try {
      stopListening();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const ctx = new AudioContext();
      ctxRef.current = ctx;
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      sourceRef.current = source;
      analyserRef.current = analyser;
      bufferRef.current = new Float32Array(analyser.fftSize);

      setStatus("listening");

      const tick = () => {
        const analyserNode = analyserRef.current;
        const buf = bufferRef.current;
        const audioCtx = ctxRef.current;
        if (!analyserNode || !buf || !audioCtx) return;

        // AnalyserNode typings vs ArrayBufferView — cast for runtime fill
        analyserNode.getFloatTimeDomainData(
          buf as unknown as Float32Array<ArrayBuffer>,
        );
        const freq = detectPitchAutocorrelation(buf, audioCtx.sampleRate);

        if (freq > 0) {
          const selected = STRINGS.find((s) => s.id === selectedIdRef.current);
          const target = selected ?? nearestString(freq);
          const c = frequencyToCents(freq, target.freq);
          setDetectedHz(freq);
          setCents(clamp(c, -50, 50));
          setLockedString(target);
        } else {
          setDetectedHz(null);
          setCents(0);
        }

        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      stopListening();
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setStatus("denied");
      } else {
        setStatus("error");
      }
    }
  }

  function toggleMic() {
    if (status === "listening") {
      stopListening();
      setStatus("idle");
    } else {
      void startListening();
    }
  }

  async function playReference(stringDef: GuitarString) {
    setSelectedId(stringDef.id);
    await playNotes([stringDef.note], { duration: 1.6, stagger: 0 });
  }

  const inTune = Math.abs(cents) <= 5 && detectedHz != null;
  const needlePct = ((cents + 50) / 100) * 100;
  const statusLabel =
    detectedHz == null
      ? "Spill en åpen streng…"
      : inTune
        ? "Stemmer!"
        : cents < 0
          ? "For lav — stram opp"
          : "For høy — slakk litt";

  return (
    <section className="rounded-2xl border border-border/60 bg-card/50 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Stemmeapparat
          </h2>
          <p className="text-sm text-muted-foreground">
            Standardstemming E–A–D–G–B–e. Bruk mikrofon eller referansetone.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          className="min-h-11 gap-2"
          onClick={toggleMic}
          aria-pressed={status === "listening"}
        >
          {status === "listening" ? (
            <>
              <MicOff className="size-4" />
              Stopp mikrofon
            </>
          ) : (
            <>
              <Mic className="size-4" />
              Start mikrofon
            </>
          )}
        </Button>
      </div>

      {status === "denied" && (
        <p className="mb-3 rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">
          Mikrofontilgang ble avslått. Du kan fortsatt stemme med
          referansetonene under.
        </p>
      )}
      {status === "unsupported" && (
        <p className="mb-3 rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">
          Denne nettleseren støtter ikke mikrofon. Bruk referansetonene.
        </p>
      )}
      {status === "error" && (
        <p className="mb-3 rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">
          Klarte ikke å starte mikrofonen. Prøv igjen, eller bruk referansetone.
        </p>
      )}

      <div className="mb-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="space-y-3">
          <div className="relative h-3 rounded-full bg-secondary">
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-foreground/40" />
            <div
              className={cn(
                "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-950 transition-[left,background-color]",
                inTune ? "bg-emerald-400" : "bg-amber-400",
              )}
              style={{ left: `${needlePct}%` }}
              aria-hidden
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>−50¢</span>
            <span className={cn("font-medium", inTune && "text-emerald-400")}>
              {statusLabel}
            </span>
            <span>+50¢</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-3 font-mono">
            <span className="text-3xl font-semibold text-amber-300">
              {lockedString?.note ?? STRINGS.find((s) => s.id === selectedId)?.note}
            </span>
            <span className="text-sm text-muted-foreground">
              {detectedHz != null
                ? `${detectedHz.toFixed(1)} Hz · ${cents > 0 ? "+" : ""}${cents.toFixed(0)}¢`
                : status === "listening"
                  ? "Lytter…"
                  : "Klar"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          {STRINGS.map((s) => {
            const active = selectedId === s.id;
            const matched =
              lockedString?.id === s.id && detectedHz != null && status === "listening";
            return (
              <div key={s.id} className="flex flex-col gap-1">
                <Button
                  type="button"
                  size="lg"
                  variant={active ? "default" : "outline"}
                  className={cn(
                    "min-h-11 min-w-14 font-mono",
                    matched && inTune && "ring-2 ring-emerald-400",
                    matched && !inTune && "ring-2 ring-amber-400/70",
                  )}
                  onClick={() => setSelectedId(s.id)}
                  aria-pressed={active}
                >
                  {s.label}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="min-h-9 gap-1 text-xs"
                  onClick={() => void playReference(s)}
                  aria-label={`Spill referansetone ${s.note}`}
                >
                  <Volume2 className="size-3.5" />
                  Hør
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Tips: Stem én streng om gangen i et stille rom. Grønn nål = innenfor ±5
        cent.
      </p>
    </section>
  );
}
