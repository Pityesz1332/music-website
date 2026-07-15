import type { Song } from "../types/music";
import { apiFetch } from "../utils/api";
import { swarmUrl } from "./swarm";
import { readCatalogFromFeed, publishCatalogToFeed } from "./swarmFeed";
import { SWARM_SONGS_REF } from "../utils/config";

const LOCAL_SONGS_KEY = "localSongs";

// The local overlay is an optimistic cache: it immediately shows changes an admin
// just published, while the Swarm feed / gateway hasn't caught up yet. The actual
// source of truth is always the feed (see swarmFeed.ts).
export function getLocalSongs(): Song[] {
    try {
        const raw = localStorage.getItem(LOCAL_SONGS_KEY);
        return raw ? (JSON.parse(raw) as Song[]) : [];
    } catch (error) {
        console.error("Failed to read local songs:", error);
        return [];
    }
}

function saveLocalSongs(songs: Song[]) {
    localStorage.setItem(LOCAL_SONGS_KEY, JSON.stringify(songs));
}

export function addLocalSong(song: Song) {
    const songs = getLocalSongs().filter((s) => s.id !== song.id);
    saveLocalSongs([...songs, song]);
}

export function removeLocalSong(id: string) {
    saveLocalSongs(getLocalSongs().filter((s) => s.id !== id));
}

// After a successful feed publish we clear the overlay: the feed becomes the source of
// truth from then on, so a stale local entry can't "resurrect" a song that was already deleted.
export function clearLocalSongs() {
    localStorage.removeItem(LOCAL_SONGS_KEY);
}

// merges the lists by id (the local entry wins on conflict)
function mergeById(base: Song[], extra: Song[]): Song[] {
    const map = new Map<string, Song>();
    for (const song of base) map.set(song.id, song);
    for (const song of extra) map.set(song.id, song);
    return Array.from(map.values());
}

// loads the full song catalog, in this order:
//   1) the Swarm feed's latest catalog (shared, mutable source)
//   2) if there's no feed, a static Swarm reference (VITE_SWARM_SONGS_REF)
// then merges the local optimistic overlay on top.
// When neither source is configured/resolvable, the catalog is empty on purpose:
// we don't fall back to the bundled seed, because those tracks aren't playable
// without a real catalog behind them (the UI shows an empty state instead).
export async function loadSongs(): Promise<Song[]> {
    let seed: Song[] | null = await readCatalogFromFeed();

    if (!seed && SWARM_SONGS_REF) {
        try {
            seed = await apiFetch<Song[]>(swarmUrl(SWARM_SONGS_REF));
        } catch (error) {
            console.warn("Could not load static catalog reference:", error);
        }
    }

    return mergeById(seed ?? [], getLocalSongs());
}

// Publishes the full catalog to the Swarm feed (admin action). The feed-owner private
// key is only available at runtime, in memory. After success, the feed is the source of truth.
export async function publishCatalog(songs: Song[], feedKey: string): Promise<void> {
    await publishCatalogToFeed(songs, feedKey);
}
