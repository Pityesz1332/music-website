import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import type { Song } from "@interfaces/music";
import { useLoading } from "@context/LoadingContext";
import songsData from "@data/songs.json";

interface UseSongInitProps {
    playlist: Song[];
    setPlaylist: (song: Song[]) => void;
}

// Initialize the playlist on page load.
export const useSongInit = ({ playlist, setPlaylist }: UseSongInitProps) => {
    const { state } = useLocation();
    const { showLoading, hideLoading } = useLoading();
    const isInitialMount = useRef<boolean>(true);

    useEffect(() => {
        if (!isInitialMount.current) return;

        isInitialMount.current = false;
        showLoading();

        if (state?.playlist) {
            setPlaylist(state.playlist);
        } else if (playlist.length === 0) {
            setPlaylist(songsData as Song[]);
        }

        hideLoading();
    }, [state?.playlist, setPlaylist, playlist.length, showLoading, hideLoading]);
};