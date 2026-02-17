import { useState, useEffect } from "react";
import type { Song } from "../../types/music";

// ezen a néven mentjük az adatokat
const STORAGE_KEY = "recentlyPlayed";
// csak az utolsó 5 dalt jegyezzük meg
const MAX_ITEMS = 5;

export const useRecentlyPlayed = () => {
    // megpróbáljuk betölteni a mentett listát
    const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to load recent songs:", error);
            return [];
        }
    });

    // ha változik a lista tartalma, mentjük a localstorage-be
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyPlayed));
    }, [recentlyPlayed]);

    // hozzáadjuk az új dalt az előzményekhez
    // mindig a legutóbb hallgatott lesz az első
    const addToRecentlyPlayed = (song: Song) => {
        setRecentlyPlayed(prev => {
            const filtered = prev.filter(s => s.id !== song.id);
            return [song, ...filtered].slice(0, MAX_ITEMS);
        });
    };

    // előzmények törlése
    const clearRecentlyPlayed = () => {
        setRecentlyPlayed([]);
    };

    return { recentlyPlayed, addToRecentlyPlayed, clearRecentlyPlayed };
}