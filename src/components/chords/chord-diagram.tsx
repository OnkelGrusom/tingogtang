"use client";

import { cn } from "@/lib/utils";
import type { ChordVariant } from "@/lib/chords/types";
import { fingerDisplay, stringToIndex } from "@/lib/chords/fingerings";

interface ChordDiagramProps {
  variant: ChordVariant;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { w: 112, h: 148, padX: 18, padY: 28, fretH: 22, font: 10 },
  md: { w: 160, h: 210, padX: 26, padY: 36, fretH: 32, font: 13 },
  lg: { w: 200, h: 260, padX: 30, padY: 42, fretH: 40, font: 15 },
};

export function ChordDiagram({
  variant,
  className,
  size = "md",
}: ChordDiagramProps) {
  const s = SIZES[size];
  const stringCount = 6;
  const fretCount = 4;
  const gridW = s.w - s.padX * 2;
  const gridH = s.fretH * fretCount;
  const stringGap = gridW / (stringCount - 1);

  const xForString = (stringNum: number) =>
    s.padX + stringToIndex(stringNum) * stringGap;

  const yForFret = (absoluteFret: number) => {
    const relative = absoluteFret - variant.baseFret + 1;
    return s.padY + (relative - 0.5) * s.fretH;
  };

  return (
    <svg
      viewBox={`0 0 ${s.w} ${s.h}`}
      width={s.w}
      height={s.h}
      className={cn("select-none", className)}
      role="img"
      aria-label={`Akkorddiagram for ${variant.label}`}
    >
      {/* Nut or base fret label */}
      {variant.baseFret === 1 ? (
        <rect
          x={s.padX - 2}
          y={s.padY - 4}
          width={gridW + 4}
          height={4}
          rx={1}
          className="fill-foreground"
        />
      ) : (
        <text
          x={s.padX - 10}
          y={s.padY + s.fretH * 0.55}
          textAnchor="end"
          className="fill-muted-foreground"
          fontSize={s.font}
          fontFamily="var(--font-mono)"
        >
          {variant.baseFret}
        </text>
      )}

      {/* Frets */}
      {Array.from({ length: fretCount + 1 }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={s.padX}
          y1={s.padY + i * s.fretH}
          x2={s.padX + gridW}
          y2={s.padY + i * s.fretH}
          className="stroke-foreground/70"
          strokeWidth={i === 0 && variant.baseFret === 1 ? 0 : 1.5}
        />
      ))}

      {/* Strings */}
      {Array.from({ length: stringCount }, (_, i) => (
        <line
          key={`string-${i}`}
          x1={s.padX + i * stringGap}
          y1={s.padY}
          x2={s.padX + i * stringGap}
          y2={s.padY + gridH}
          className="stroke-foreground/80"
          strokeWidth={1 + (stringCount - 1 - i) * 0.25}
        />
      ))}

      {/* Open / muted markers above nut */}
      {variant.frets.map((fret, i) => {
        const stringNum = (6 - i) as 1 | 2 | 3 | 4 | 5 | 6;
        const x = xForString(stringNum);
        const y = s.padY - 14;
        if (fret === "x") {
          return (
            <text
              key={`mute-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize={s.font + 2}
              fontWeight={600}
            >
              ×
            </text>
          );
        }
        if (fret === 0) {
          return (
            <circle
              key={`open-${i}`}
              cx={x}
              cy={y - 2}
              r={s.font * 0.45}
              className="fill-none stroke-foreground"
              strokeWidth={1.5}
            />
          );
        }
        return null;
      })}

      {/* Barres */}
      {variant.barres?.map((barre, i) => {
        const x1 = xForString(barre.fromString);
        const x2 = xForString(barre.toString);
        const y = yForFret(barre.fret);
        const left = Math.min(x1, x2);
        const width = Math.abs(x2 - x1);
        return (
          <rect
            key={`barre-${i}`}
            x={left - 10}
            y={y - 10}
            width={width + 20}
            height={20}
            rx={10}
            className="fill-amber-500"
          />
        );
      })}

      {/* Finger dots */}
      {variant.fingers.map((finger, i) => {
        // Skip drawing dots covered by barre except we still show numbers on barre
        const x = xForString(finger.string);
        const y = yForFret(finger.fret);
        const onBarre = variant.barres?.some(
          (b) =>
            b.fret === finger.fret &&
            finger.string <= b.fromString &&
            finger.string >= b.toString,
        );

        if (onBarre && finger.finger === 1) {
          const barre = variant.barres?.find((b) => b.fret === finger.fret);
          const isEdge =
            finger.string === barre?.fromString ||
            finger.string === barre?.toString;
          if (!isEdge) return null;
        }

        return (
          <g key={`finger-${i}`}>
            {!onBarre && (
              <circle
                cx={x}
                cy={y}
                r={11}
                className="fill-amber-500"
              />
            )}
            <text
              x={x}
              y={y + 4}
              textAnchor="middle"
              className={onBarre ? "fill-zinc-950" : "fill-zinc-950"}
              fontSize={s.font}
              fontWeight={700}
              fontFamily="var(--font-sans)"
            >
              {fingerDisplay(finger.finger)}
            </text>
          </g>
        );
      })}

      {/* String labels */}
      {["E", "A", "D", "G", "B", "e"].map((label, i) => (
        <text
          key={`label-${label}-${i}`}
          x={s.padX + i * stringGap}
          y={s.padY + gridH + 18}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={s.font - 1}
          fontFamily="var(--font-mono)"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
