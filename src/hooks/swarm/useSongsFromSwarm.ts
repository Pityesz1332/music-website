import { useState, useEffect, useCallback } from "react";
import type { Song } from "@interfaces/music";
import { fetchLatestSongsHash, fetchSongMetadata, FEED_OWNER_ADDRESS } from "../../swarm/swarmService";

export const useSongsFromSwarm = (options?: { includeHidden?: boolean }) => {
    const includeHidden = options?.includeHidden ?? false;
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSongs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const hash = await fetchLatestSongsHash(FEED_OWNER_ADDRESS);
            // No feed published yet (fresh owner/topic) → empty catalog, not an error.
            if (!hash) {
                setSongs([]);
                return;
            }
            const data = await fetchSongMetadata(hash);
            // Public views hide flagged songs; the admin passes includeHidden to manage them.
            setSongs(includeHidden ? data : data.filter(s => !s.hidden));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load songs");
        } finally {
            setLoading(false);
        }
    }, [includeHidden]);

    useEffect(() => {
        loadSongs();
    }, [loadSongs]);

    return { songs, loading, error, refresh: loadSongs };
};