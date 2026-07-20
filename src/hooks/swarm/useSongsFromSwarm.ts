import { useState, useEffect, useCallback } from "react";
import type { Song } from "@interfaces/music";
import { fetchLatestSongsHash, fetchSongMetadata } from "../../swarm/swarmService";

const FEED_OWNER_ADDRESS = import.meta.env.VITE_FEED_OWNER_ADDRESS as string;

export const useSongsFromSwarm = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSongs = useCallback(async () => {
        try {
            setLoading(true);
            const hash = await fetchLatestSongsHash(FEED_OWNER_ADDRESS);
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