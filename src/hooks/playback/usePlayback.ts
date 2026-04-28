import { Dispatch, SetStateAction, useCallback } from "react";
import type { Song } from "@interfaces/music";

// definiáljuk mit kell megkapni a működéshez
interface PlaybackLogicProps {
    currentSong: Song | null;
    playlist: Song[];
    setCurrentSong: Dispatch<SetStateAction<Song | null>>;
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
    setPlaylist: Dispatch<SetStateAction<Song[]>>;
    addToRecentlyPlayed: (song: Song) => void;
    onPlaySong?: (song: Song) => void;
}

// playbar controls gombok működése
export const usePlayback = ({
    currentSong,
    playlist,
    setCurrentSong,
    setIsPlaying,
    setPlaylist,
    addToRecentlyPlayed,
    onPlaySong
}: PlaybackLogicProps) => {
    // zene elindítása (ha nem ugyanaz a zene)
    const playSong = useCallback((song: Song, newPlaylist?: Song[]) => {
        if (newPlaylist) setPlaylist(newPlaylist);

        if (currentSong?.id !== song.id) {
            setCurrentSong(song);
            addToRecentlyPlayed(song);
        }
        setIsPlaying(true);
    }, [currentSong, setCurrentSong, setPlaylist, addToRecentlyPlayed, setIsPlaying]);

    // play-stop gomb működése
    const togglePlay = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, [setIsPlaying]);

    // következő dalra ugrás
    const nextSong = useCallback(() => {
        if (!playlist.length || !currentSong) return;
        const idx = playlist.findIndex(s => s.id === currentSong.id);
        const next = playlist[(idx + 1) % playlist.length];
        (onPlaySong ?? playSong)(next);
    }, [playlist, currentSong, playSong]);

    // előző dalra ugrás
    const prevSong = useCallback(() => {
        if (!playlist.length || !currentSong) return;
        const idx = playlist.findIndex(s => s.id === currentSong.id);
        const prev = playlist[(idx - 1 + playlist.length) % playlist.length];
        (onPlaySong ?? playSong)(prev);
    }, [playlist, currentSong, playSong]);

    return { playSong, togglePlay, nextSong, prevSong }
}