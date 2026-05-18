import { Dispatch, SetStateAction, useCallback } from "react";
import type { Song } from "@interfaces/music";

interface PlaybackLogicProps {
    currentSong: Song | null;
    playlist: Song[];
    setCurrentSong: Dispatch<SetStateAction<Song | null>>;
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
    setPlaylist: Dispatch<SetStateAction<Song[]>>;
    addToRecentlyPlayed: (song: Song) => void;
    onPlaySong?: (song: Song) => void;
    isShuffle?: boolean;
}

export const usePlayback = ({
    currentSong,
    playlist,
    setCurrentSong,
    setIsPlaying,
    setPlaylist,
    addToRecentlyPlayed,
    onPlaySong,
    isShuffle
}: PlaybackLogicProps) => {
    // Start playback if new track.
    const playSong = useCallback((song: Song, newPlaylist?: Song[]) => {
        if (newPlaylist) setPlaylist(newPlaylist);

        if (currentSong?.id !== song.id) {
            setCurrentSong(song);
            addToRecentlyPlayed(song);
        }
        setIsPlaying(true);
    }, [currentSong, setCurrentSong, setPlaylist, addToRecentlyPlayed, setIsPlaying]);

    // play-stop button
    const togglePlay = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, [setIsPlaying]);

    // next song
    const nextSong = useCallback(() => {
        if (!playlist.length || !currentSong) return;
        console.log("loop alert");


        let next: Song;

        if (isShuffle) {
            const others = playlist.filter(s => s.id !== currentSong.id);
            next = others[Math.floor(Math.random() * others.length)];
        } else {
            const idx = playlist.findIndex(s => s.id === currentSong.id);
            next = playlist[(idx + 1) % playlist.length];
        }

        (onPlaySong ?? playSong)(next);
    }, [playlist, currentSong, isShuffle, playSong]);

    // prev song
    const prevSong = useCallback(() => {
        if (!playlist.length || !currentSong) return;
        const idx = playlist.findIndex(s => s.id === currentSong.id);
        const prev = playlist[(idx - 1 + playlist.length) % playlist.length];
        (onPlaySong ?? playSong)(prev);
    }, [playlist, currentSong, playSong]);

    return { playSong, togglePlay, nextSong, prevSong }
}