"use client";

import { Heart, Volume2 } from "lucide-react";
import { useState } from "react";
import { ChordDiagram } from "@/components/chords/chord-diagram";
import { FingeringList } from "@/components/chords/fingering-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { playNotes } from "@/lib/chords/audio";
import type { ChordVariant, ChordVariantType } from "@/lib/chords/types";
import { cn } from "@/lib/utils";

const VARIANT_LABEL: Record<ChordVariantType, string> = {
  open: "Open",
  barre: "Barre",
  power: "Power",
};

interface ChordCardProps {
  variant: ChordVariant;
  groupName: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  compact?: boolean;
}

export function ChordCard({
  variant,
  groupName,
  isFavorite,
  onToggleFavorite,
  compact = false,
}: ChordCardProps) {
  const [playing, setPlaying] = useState(false);

  async function handlePlay() {
    setPlaying(true);
    try {
      await playNotes(variant.notes);
    } finally {
      setTimeout(() => setPlaying(false), 1200);
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/60 bg-card/80",
        compact && "shadow-none",
      )}
    >
      <CardHeader className="gap-3 border-b border-border/50 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="font-heading text-2xl tracking-tight">
              {variant.symbol}
            </CardTitle>
            <CardDescription className="mt-1">
              {groupName} · {variant.label}
            </CardDescription>
          </div>
          <Badge variant="secondary">{VARIANT_LABEL[variant.variant]}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="lg"
            className="min-h-11 gap-2"
            onClick={handlePlay}
            disabled={playing}
            aria-label={`Spill ${variant.symbol}`}
          >
            <Volume2 className="size-4" />
            Spill akkord
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="min-h-11 gap-2"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? "Fjern fra favoritter" : "Legg til favoritter"
            }
          >
            <Heart
              className={cn("size-4", isFavorite && "fill-amber-500 text-amber-500")}
            />
            {isFavorite ? "Favoritt" : "Lagre"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 pt-6 sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="flex justify-center rounded-xl bg-secondary/40 p-4">
          <ChordDiagram variant={variant} size={compact ? "sm" : "md"} />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Fingring
          </h3>
          <FingeringList variant={variant} />
        </div>
      </CardContent>
    </Card>
  );
}
