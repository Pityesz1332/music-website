import { Dispatch, SetStateAction, useCallback } from "react";
import { Song } from "@interfaces/music";

// definiáljuk mit kell megkapni a működéshez
interface PlaybackLogicProps {
    currentSong: Song | null;
    playlist: Song[];
    setCurrentSong: Dispatch<SetStateAction<Song | null>>;
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
    setPlaylist: Dispatch<SetStateAction<Song[]>>;
    addToRecentlyPlayed: (song: Song) => void;
}

// playbar controls gombok működése
export const usePlayback = ({
    currentSong,
    playlist,
    setCurrentSong,
    setIsPlaying,
    setPlaylist,
    addToRecentlyPlayed,
}: PlaybackLogicProps) => {
    // zene elindítása (ha nem ugyanaz a zene)
    const playSong = useCallback((song: Song, newPlaylist?: Song[]) => {
        if (newPlaylist) {
            setPlaylist(newPlaylist);
        }

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
        const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        const next = playlist[nextIndex];
        playSong(next);
    }, [playlist, currentSong, playSong]);

    // előző dalra ugrás
    const prevSong = useCallback(() => {
        if (!playlist.length || !currentSong) return;
        const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        const prev = playlist[prevIndex];
        playSong(prev);
    }, [playlist, currentSong, playSong]);

    return { playSong, togglePlay, nextSong, prevSong }
}