type Genre = string;
type Song = { title: string; duration: string; genre: Genre };
type PlaytimeResult = { totalSeconds: number; formatted: string; songCount: number; skipped: string[] };
type TopGenreResult = { genre: Genre; count: number; percentage: number } | null;

export function durationToSeconds(duration: string): number {
  if (typeof duration !== "string") {
    throw new TypeError(`Expected a string, got ${typeof duration}`);
  }

  const trimmed = duration.trim();
  const match = trimmed.match(/^(\d{1,2}):([0-5]\d):([0-5]\d)$|^([0-5]?\d):([0-5]\d)$/);

  if (!match) {
    throw new Error(`Invalid duration format: "${duration}". Expected "MM:SS" or "HH:MM:SS".`);
  }

  const isHMS = match[1] !== undefined;

  if (isHMS) {
    return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
  } else {
    return Number(match[4]) * 60 + Number(match[5]);
  }
}

export function secondsToDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    throw new RangeError(`Expected a non-negative finite number, got ${totalSeconds}`);
  }

  const secs = Math.floor(totalSeconds);
  const hours   = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function calculateTotalPlaytime(songs: Song[]): PlaytimeResult {
  if (!Array.isArray(songs)) {
    throw new TypeError(`Expected an array, got ${typeof songs}`);
  }

  if (songs.length === 0) {
    return { totalSeconds: 0, formatted: "00:00", songCount: 0, skipped: [] };
  }

  const skipped: string[] = [];
  let totalSeconds = 0;

  for (const song of songs) {
    if (!song || typeof song.title !== "string" || typeof song.duration !== "string") {
      skipped.push(String(song?.title ?? "[unknown]"));
      continue;
    }

    try {
      totalSeconds += durationToSeconds(song.duration);
    } catch {
      skipped.push(song.title);
    }
  }

  return {
    totalSeconds,
    formatted: secondsToDuration(totalSeconds),
    songCount: songs.length - skipped.length,
    skipped,
  };
}

export function getTopGenre(songs: Song[]): TopGenreResult {
  if (!Array.isArray(songs)) {
    throw new TypeError(`Expected an array, got ${typeof songs}`);
  }

  const counts = new Map<Genre, number>();

  for (const song of songs) {
    const genre = song?.genre?.trim();

    if (!genre || typeof genre !== "string") continue;

    const normalized = genre.toLowerCase();
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }

  if (counts.size === 0) return null;

  const [genre, count] = [...counts.entries()].reduce((a, b) => b[1] > a[1] ? b : a);
  const total = [...counts.values()].reduce((sum, n) => sum + n, 0);

  return {
    genre,
    count,
    percentage: Math.round((count / total) * 100),
  };
}