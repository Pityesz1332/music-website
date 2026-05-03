import { useEffect, useState, useCallback } from "react";
import type { Song } from "@interfaces/music";

const STORAGE_KEY = "saved_songs"

// Managing the list of saved tracks.
export const useSaveSong = () => {
    // Storing the list in an array.
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

    const saveSong = useCallback((song: Song) => {
        setSavedSongs((prev) => {
            if (!prev.find((s) => s.id === song.id)) {
                return [...prev, song];
            }
            return prev;
        });
    }, []);

    const removeSavedSong = useCallback((songId: string) => {
        setSavedSongs((prev) => prev.filter((s) => s.id !== songId));
    }, []);

    return { savedSongs, saveSong, removeSavedSong };
}