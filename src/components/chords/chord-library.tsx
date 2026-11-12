"use client";

import { GraduationCap, Search, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ChordCard } from "@/components/chords/chord-card";
import { ChordDiagram } from "@/components/chords/chord-diagram";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CHORD_GROUPS } from "@/lib/chords/data";
import type { ChordVariantType } from "@/lib/chords/types";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

const VARIANT_FILTERS: Array<{ value: "all" | ChordVariantType; label: string }> = [
  { value: "all", label: "Alle" },
  { value: "open", label: "Open" },
  { value: "barre", label: "Barre" },
  { value: "power", label: "Power" },
];

export function ChordLibrary() {
  const [query, setQuery] = useState("");
  const [variantFilter, setVariantFilter] = useState<"all" | ChordVariantType>(
    "all",
  );
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(
    CHORD_GROUPS[0]?.variants[0]?.id ?? "",
  );
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CHORD_GROUPS.map((group) => {
      if (beginnerOnly && !group.isBeginnerChord) {
        return { ...group, variants: [] };
      }
      const variants = group.variants.filter((v) => {
        if (beginnerOnly && v.variant !== "open") return false;
        if (variantFilter !== "all" && v.variant !== variantFilter) return false;
        if (favoritesOnly && !favorites.includes(v.id)) return false;
        if (!q) return true;
        return (
          group.symbol.toLowerCase().includes(q) ||
          group.name.toLowerCase().includes(q) ||
          v.label.toLowerCase().includes(q)
        );
      });
      return { ...group, variants };
    }).filter((g) => g.variants.length > 0);
  }, [query, variantFilter, favoritesOnly, favorites, beginnerOnly]);

  // Keep selection valid when filter hides the current chord
  useEffect(() => {
    if (!filtered.some((g) => g.variants.some((v) => v.id === selectedId))) {
      const first = filtered[0]?.variants[0];
      if (first) setSelectedId(first.id);
    }
  }, [filtered, selectedId]);

  const selected = useMemo(() => {
    for (const group of CHORD_GROUPS) {
      const found = group.variants.find((v) => v.id === selectedId);
      if (found) return { group, variant: found };
    }
    const first = filtered[0]?.variants[0];
    if (first) {
      const group = CHORD_GROUPS.find((g) =>
        g.variants.some((v) => v.id === first.id),
      )!;
      return { group, variant: first };
    }
    return null;
  }, [selectedId, filtered]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Søk etter akkord (C, Am, F…)"
            className="h-12 pl-10 text-base"
            aria-label="Søk i akkordbiblioteket"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup
            value={[variantFilter]}
            onValueChange={(values) => {
              const next = values[0] as "all" | ChordVariantType | undefined;
              if (next) setVariantFilter(next);
            }}
            variant="outline"
            size="lg"
            className="flex flex-wrap justify-start gap-1"
          >
            {VARIANT_FILTERS.map((f) => (
              <ToggleGroupItem
                key={f.value}
                value={f.value}
                className="min-h-11 px-4"
              >
                {f.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Button
            type="button"
            variant={beginnerOnly ? "default" : "outline"}
            size="lg"
            className="min-h-11 gap-2"
            onClick={() => {
              setBeginnerOnly((v) => {
                const next = !v;
                if (next) setVariantFilter("all");
                return next;
              });
            }}
            aria-pressed={beginnerOnly}
          >
            <GraduationCap className="size-4" />
            Nybegynner
          </Button>

          <Button
            type="button"
            variant={favoritesOnly ? "default" : "outline"}
            size="lg"
            className="min-h-11 gap-2"
            onClick={() => setFavoritesOnly((v) => !v)}
            aria-pressed={favoritesOnly}
          >
            <Star className={cn("size-4", favoritesOnly && "fill-current")} />
            Favoritter
          </Button>
        </div>

        {beginnerOnly && (
          <p className="text-sm text-muted-foreground">
            Viser åpne nybegynnergrep: Em, Am, C, G, D, E, A og Dm. Barre og
            power er skjult.
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border/70 p-8 text-center text-muted-foreground">
              Ingen akkorder matcher søket.
            </p>
          ) : (
            filtered.map((group) => (
              <section key={group.symbol} className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-lg font-semibold tracking-tight">
                    {group.symbol}
                  </h2>
                  <Badge variant="outline">{group.name}</Badge>
                  {group.isBeginnerChord && (
                    <Badge variant="secondary">Nybegynner</Badge>
                  )}
                </div>
                {beginnerOnly && group.troubleshootingTip && (
                  <p className="text-sm text-muted-foreground">
                    {group.troubleshootingTip}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {group.variants.map((variant) => {
                    const active = selected?.variant.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedId(variant.id)}
                        className={cn(
                          "rounded-xl border bg-card/60 p-3 text-left transition-colors",
                          "hover:border-amber-500/50 hover:bg-card",
                          "focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:outline-none",
                          "min-h-11",
                          active
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-border/60",
                        )}
                        aria-pressed={active}
                      >
                        <div className="mb-2 flex items-center justify-between gap-1">
                          <span className="text-sm font-semibold">
                            {variant.label}
                          </span>
                          {isFavorite(variant.id) && (
                            <Star className="size-3.5 fill-amber-500 text-amber-500" />
                          )}
                        </div>
                        <div className="flex justify-center">
                          <ChordDiagram variant={variant} size="sm" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          {selected ? (
            <ChordCard
              variant={selected.variant}
              groupName={selected.group.name}
              isFavorite={isFavorite(selected.variant.id)}
              onToggleFavorite={() => toggleFavorite(selected.variant.id)}
            />
          ) : (
            <p className="text-muted-foreground">Velg en akkord for detaljer.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
