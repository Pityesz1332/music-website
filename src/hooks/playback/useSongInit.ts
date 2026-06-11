import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import type { Song } from "@interfaces/music";
import { useLoading } from "@context/LoadingContext";
import { useSongsFromSwarm } from "@hooks/swarm/useSongsFromSwarm";

interface UseSongInitProps {
    playlist: Song[];
    setPlaylist: (song: Song[]) => void;
}

// Initialize the playlist on page load.
export const useSongInit = ({ playlist, setPlaylist }: UseSongInitProps) => {
    const { state } = useLocation();
    const { showLoading, hideLoading } = useLoading();
    const isInitialMount = useRef<boolean>(true);
    const { songs: swarmSongs, loading: swarmLoading, error: swarmError } = useSongsFromSwarm();

    useEffect(() => {
        if (swarmLoading) return;
        if (!isInitialMount.current) return;

        isInitialMount.current = false;
        showLoading();

        if (state?.playlist) {
            setPlaylist(state.playlist);
        } else if (playlist.length === 0) {
            setPlaylist(swarmSongs);
        }

        hideLoading();
    }, [state?.playlist, setPlaylist, playlist.length, showLoading, hideLoading, swarmSongs, swarmLoading]);
};