import { useEffect } from "react";
import type { Song } from "../../types/music";

// ez a függvény felel azért, hogy a böngésző tab-ján milyen cím jelenjen meg
export const useDocumentTitle = (currentSong: Song | null, isPlaying: boolean) => {
    useEffect(() => {
        if (currentSong) {
            const statusEmoji = isPlaying ? "▶" : "⏸";
            document.title = `${statusEmoji} ${currentSong.title} - ${currentSong.artist}`;
        } else {
            document.title = "DJ Enez";
        }
    }, [currentSong, isPlaying]);
}