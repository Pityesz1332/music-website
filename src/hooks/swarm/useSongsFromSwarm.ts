import { useState, useEffect, useCallback } from "react";
import type { Song } from "@interfaces/music";
import { loadSongs as loadSongsFromCatalog } from "../../services/songsCatalog";

// How long we wait for the Swarm catalog before giving up, so a slow/unreachable
// gateway resolves to a friendly "timed out" message instead of an endless spinner.
const CATALOG_TIMEOUT_MS = 12000;
const TIMEOUT_MESSAGE = "Loading songs is taking longer than expected. Please try again.";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(TIMEOUT_MESSAGE)), ms)
        ),
    ]);
}

// Single source of truth for the song catalog: reads the latest catalog from the
// Swarm feed via the public gateway (plus any local optimistic overlay) — see
// services/songsCatalog.ts. Hidden tracks are filtered out for display.
export const useSongsFromSwarm = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSongs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const catalog = await withTimeout(loadSongsFromCatalog(), CATALOG_TIMEOUT_MS);
            setSongs(catalog.filter((s) => !s.hidden));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load songs");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSongs();
    }, [loadSongs]);

    return { songs, loading, error, refresh: loadSongs };
};
