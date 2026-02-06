import { useState } from "react";
import type { Song } from "../../types/music";

// kezeljük a mentett dalok listáját
export const useSaveSong = () => {
    // tároljuk a listát egy tömbben
    const [savedSongs, setSavedSongs] = useState<Song[]>([]);

    // dal mentése
    const saveSong = (song: Song) => {
        setSavedSongs((prev) => {
            if (!prev.find((s) => s.id === song.id)) {
                return [...prev, song];
            }
            return prev;
        });
    };

    // dal törlése
    const removeSavedSong = (songId: string) => {
        setSavedSongs((prev) => prev.filter((s) => s.id !== songId));
    };

    return { savedSongs, saveSong, removeSavedSong };
}