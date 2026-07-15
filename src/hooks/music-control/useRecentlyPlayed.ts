import { useState, useEffect, useCallback } from "react";
import type { Song } from "@interfaces/music";

const STORAGE_KEY = "recentlyPlayed";
const MAX_ITEMS = 5;

export const useRecentlyPlayed = () => {
    // loading saved lists
    const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to load recent songs:", error);
            return [];
        }
    });

    // Sync list to localStorage on content change.
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyPlayed));
    }, [recentlyPlayed]);

    // Add the new song to history.
    // The most recently played item is always moved to the front.
    const addToRecentlyPlayed = useCallback((song: Song) => {
        setRecentlyPlayed(prev => {
            const filtered = prev.filter(s => s.id !== song.id);
            return [song, ...filtered].slice(0, MAX_ITEMS);
        });
    }, []);

    // deleting history
    const clearRecentlyPlayed = useCallback(() => {
        setRecentlyPlayed([]);
    }, []);

    return { recentlyPlayed, addToRecentlyPlayed, clearRecentlyPlayed };
}