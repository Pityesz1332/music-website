import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import type { Song } from "../types/music";
import songsData from "../data/songs.json";

interface UseSongInitProps {
    playlist: Song[];
    setPlaylist: (song: Song[]) => void;
}

// beállítjuk a playlist-et az oldal betöltésekor
export const useSongInit = ({ playlist, setPlaylist }: UseSongInitProps) => {
    const { state } = useLocation();
    const isInitialMount = useRef<boolean>(true);

    useEffect(() => {
        if (isInitialMount.current) {
            if (state?.playlist) {
                setPlaylist(state.playlist);
            } else if (playlist.length === 0) {
                setPlaylist(songsData as Song[]);
            }
            isInitialMount.current = false;
        }
    }, [state?.playlist, setPlaylist, playlist.length]);
};