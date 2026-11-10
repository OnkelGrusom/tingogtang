const FAVORITES_KEY = "guitar-learn:favorites";
const SONGS_KEY = "guitar-learn:songs";

export interface SavedSong {
  id: string;
  title: string;
  originalText: string;
  semitones: number;
  updatedAt: number;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadFavorites(): string[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids: string[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function loadSongs(): SavedSong[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(SONGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as SavedSong[]) : [];
  } catch {
    return [];
  }
}

export function saveSongs(songs: SavedSong[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(SONGS_KEY, JSON.stringify(songs));
}

export function upsertSong(song: SavedSong): SavedSong[] {
  const songs = loadSongs();
  const idx = songs.findIndex((s) => s.id === song.id);
  if (idx >= 0) songs[idx] = song;
  else songs.unshift(song);
  saveSongs(songs);
  return songs;
}

export function deleteSong(id: string): SavedSong[] {
  const songs = loadSongs().filter((s) => s.id !== id);
  saveSongs(songs);
  return songs;
}
