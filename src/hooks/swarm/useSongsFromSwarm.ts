import { useState, useEffect, useCallback } from "react";
import type { Song } from "@interfaces/music";
import { fetchLatestSongsHash, fetchSongMetadata, FEED_OWNER_ADDRESS } from "../../swarm/swarmService";

export const useSongsFromSwarm = () => {
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
            setSongs(data.filter(s => !s.hidden));
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