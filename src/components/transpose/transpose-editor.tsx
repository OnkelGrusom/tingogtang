"use client";

import { Minus, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteSong,
  loadSongs,
  type SavedSong,
  upsertSong,
} from "@/lib/storage";
import {
  extractChordsFromSong,
  formatSemitoneLabel,
  transposeChordSymbol,
  transposeSongText,
} from "@/lib/chords/transpose";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SAMPLE = `[G]Yesterday [C]all my [D]troubles seemed so [G]far away
[Em]Now it [A7]looks as though they're [D]here to [G]stay
Oh [C]I be[G/B]lieve in [Am]yester[D]day`;

function renderSongWithChords(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const parts: ReactNode[] = [];
    const regex = /\[([^\]]+)\]/g;
    let last = 0;
    let match: RegExpExecArray | null;
    let key = 0;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > last) {
        parts.push(
          <span key={`t-${key++}`}>{line.slice(last, match.index)}</span>,
        );
      }
      parts.push(
        <span
          key={`c-${key++}`}
          className="mx-0.5 inline-flex translate-y-[-0.15em] items-center rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-sm font-semibold text-amber-300"
        >
          {match[1]}
        </span>,
      );
      last = match.index + match[0].length;
    }
    if (last < line.length) {
      parts.push(<span key={`t-${key++}`}>{line.slice(last)}</span>);
    }
    return (
      <p key={lineIdx} className="min-h-[1.75rem] leading-8 whitespace-pre-wrap">
        {parts.length > 0 ? parts : "\u00A0"}
      </p>
    );
  });
}

export function TransposeEditor() {
  const [title, setTitle] = useState("Min sang");
  const [text, setText] = useState(SAMPLE);
  const [semitones, setSemitones] = useState(0);
  const [songs, setSongs] = useState<SavedSong[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setSongs(loadSongs());
  }, []);

  const transposed = useMemo(
    () => transposeSongText(text, semitones),
    [text, semitones],
  );

  const chordMap = useMemo(() => {
    const originals = extractChordsFromSong(text);
    return originals.map((c) => ({
      original: c,
      transposed: transposeChordSymbol(c, semitones),
    }));
  }, [text, semitones]);

  function handleSave() {
    const id = activeId ?? crypto.randomUUID();
    const song: SavedSong = {
      id,
      title: title.trim() || "Uten tittel",
      originalText: text,
      semitones,
      updatedAt: Date.now(),
    };
    setSongs(upsertSong(song));
    setActiveId(id);
  }

  function handleLoad(song: SavedSong) {
    setActiveId(song.id);
    setTitle(song.title);
    setText(song.originalText);
    setSemitones(song.semitones);
  }

  function handleDelete(id: string) {
    const next = deleteSong(id);
    setSongs(next);
    if (activeId === id) {
      setActiveId(null);
    }
  }

  function handleNew() {
    setActiveId(null);
    setTitle("Ny sang");
    setText(SAMPLE);
    setSemitones(0);
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="song-title">Tittel</Label>
            <Input
              id="song-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="song-text">
              Sangtekst med akkorder{" "}
              <span className="text-muted-foreground">([Am]tekst)</span>
            </Label>
            <Textarea
              id="song-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-56 font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-4">
            <span className="text-sm font-medium text-muted-foreground">
              Transponering
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="size-12"
                onClick={() => setSemitones((n) => n - 1)}
                aria-label="Transponer ned én halvton"
              >
                <Minus className="size-5" />
              </Button>
              <div className="min-w-20 text-center">
                <div className="font-mono text-2xl font-semibold text-amber-400">
                  {formatSemitoneLabel(semitones)}
                </div>
                <div className="text-xs text-muted-foreground">halvtoner</div>
              </div>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="size-12"
                onClick={() => setSemitones((n) => n + 1)}
                aria-label="Transponer opp én halvton"
              >
                <Plus className="size-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {[-2, -1, 0, 1, 2].map((n) => (
                <Button
                  key={n}
                  type="button"
                  size="sm"
                  variant={semitones === n ? "default" : "ghost"}
                  className="min-h-10 min-w-12"
                  onClick={() => setSemitones(n)}
                >
                  {formatSemitoneLabel(n)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" size="lg" className="min-h-11 gap-2" onClick={handleSave}>
              <Save className="size-4" />
              Lagre i nettleseren
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="min-h-11"
              onClick={handleNew}
            >
              Ny sang
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {chordMap.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-card/50 p-4">
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Akkordkart
              </h3>
              <div className="flex flex-wrap gap-2">
                {chordMap.map(({ original, transposed: t }) => (
                  <Badge
                    key={original}
                    variant="outline"
                    className="gap-2 px-3 py-1.5 font-mono text-sm"
                  >
                    <span className="text-muted-foreground">{original}</span>
                    <span aria-hidden>→</span>
                    <span className="text-amber-300">{t}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                Original
              </h3>
              <div className="text-[15px]">{renderSongWithChords(text)}</div>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <h3 className="mb-3 text-sm font-semibold text-amber-300/90">
                Transponert ({formatSemitoneLabel(semitones)})
              </h3>
              <div className="text-[15px]">{renderSongWithChords(transposed)}</div>
            </div>
          </div>
        </div>
      </div>

      {songs.length > 0 && (
        <>
          <Separator />
          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold">Lagrede sanger</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {songs.map((song) => (
                <li
                  key={song.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3"
                >
                  <button
                    type="button"
                    className="min-h-11 flex-1 text-left"
                    onClick={() => handleLoad(song)}
                  >
                    <div className="font-medium">{song.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatSemitoneLabel(song.semitones)} ·{" "}
                      {new Date(song.updatedAt).toLocaleDateString("nb-NO")}
                    </div>
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-lg"
                    className="text-destructive"
                    onClick={() => handleDelete(song.id)}
                    aria-label={`Slett ${song.title}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
