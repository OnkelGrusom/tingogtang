/**
 * Karaoke song parsing.
 *
 * Format:
 *   [Am]hello [C]world
 *   [G:2]short [D:4]longer hold
 *
 * Optional `:N` sets duration in beats for that chord.
 */

export interface KaraokeSegment {
  id: string;
  lineIndex: number;
  chord: string | null;
  /** Lyric text belonging to this chord (may be empty) */
  text: string;
  /** Duration in beats */
  beats: number;
  /** Absolute start beat in the song timeline */
  startBeat: number;
}

export interface KaraokeSongTimeline {
  segments: KaraokeSegment[];
  totalBeats: number;
  lines: string[];
}

const TOKEN =
  /\[([A-Ga-g][#b]?(?:[^\]:/]*)?(?:\/[A-Ga-g][#b]?)?)(?::(\d+(?:\.\d+)?))?\]/g;

export function parseKaraokeSong(
  text: string,
  defaultBeatsPerChord = 4,
): KaraokeSongTimeline {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const segments: KaraokeSegment[] = [];
  let beatCursor = 0;
  let id = 0;

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trimEnd();
    if (trimmed.length === 0) {
      // Empty line = short breath (half a measure)
      const beats = Math.max(1, defaultBeatsPerChord / 2);
      segments.push({
        id: `seg-${id++}`,
        lineIndex,
        chord: null,
        text: "",
        beats,
        startBeat: beatCursor,
      });
      beatCursor += beats;
      return;
    }

    TOKEN.lastIndex = 0;
    const matches = [...trimmed.matchAll(TOKEN)];

    if (matches.length === 0) {
      // Lyric-only line — keep previous chord feel with default beats
      segments.push({
        id: `seg-${id++}`,
        lineIndex,
        chord: null,
        text: trimmed,
        beats: defaultBeatsPerChord,
        startBeat: beatCursor,
      });
      beatCursor += defaultBeatsPerChord;
      return;
    }

    matches.forEach((match, i) => {
      const chord = match[1];
      const explicitBeats = match[2] ? Number(match[2]) : defaultBeatsPerChord;
      const start = match.index ?? 0;
      const end = start + match[0].length;
      const nextStart =
        i + 1 < matches.length ? (matches[i + 1].index ?? trimmed.length) : trimmed.length;
      const lyric = trimmed.slice(end, nextStart);

      segments.push({
        id: `seg-${id++}`,
        lineIndex,
        chord,
        text: lyric,
        beats: explicitBeats > 0 ? explicitBeats : defaultBeatsPerChord,
        startBeat: beatCursor,
      });
      beatCursor += explicitBeats > 0 ? explicitBeats : defaultBeatsPerChord;
    });
  });

  return {
    segments,
    totalBeats: beatCursor,
    lines,
  };
}

export function findActiveSegment(
  segments: KaraokeSegment[],
  beat: number,
): KaraokeSegment | null {
  if (segments.length === 0) return null;
  if (beat < 0) return segments[0];
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i];
    if (beat >= seg.startBeat) return seg;
  }
  return segments[0];
}

export function beatToMs(beats: number, bpm: number): number {
  return (beats * 60000) / Math.max(1, bpm);
}

export function msToBeat(ms: number, bpm: number): number {
  return (ms * Math.max(1, bpm)) / 60000;
}

export function formatClock(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
