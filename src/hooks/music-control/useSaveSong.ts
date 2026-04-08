import { useEffect, useState, useCallback } from "react";
import type { Song } from "@interfaces/music";

const STORAGE_KEY = "saved_songs"

// kezeljük a mentett dalok listáját
export const useSaveSong = () => {
    // tároljuk a listát egy tömbben
    const [savedSongs, setSavedSongs] = useState<Song[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSongs));
    }, [savedSongs]);

    // dal mentése
    const saveSong = useCallback((song: Song) => {
        setSavedSongs((prev) => {
            if (!prev.find((s) => s.id === song.id)) {
                return [...prev, song];
            }
            return prev;
        });
    }, []);

    // dal törlése
    const removeSavedSong = useCallback((songId: string) => {
        setSavedSongs((prev) => prev.filter((s) => s.id !== songId));
    }, []);

    return { savedSongs, saveSong, removeSavedSong };
}