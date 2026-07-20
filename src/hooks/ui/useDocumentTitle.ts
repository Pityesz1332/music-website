import { useEffect } from "react";
import type { Song } from "@interfaces/music";

// dynamically changing browser tab
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