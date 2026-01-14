import { createContext, useContext, useState, ReactNode } from "react";
import type { Song } from "../types/music";

interface MusicContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    playlist: Song[];
    savedSongs: Song[];

    playSong: (song: Song) => void;
    togglePlay: () => void;
    nextSong: () => void;
    prevSong: () => void;
    setPlaylist: (song: Song[]) => void;
    saveSong: (song: Song) => void;
    removeSavedSong: (songId: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
    children: ReactNode;
}

export function MusicProvider({ children }: MusicProviderProps) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [savedSongs, setSavedSongs] = useState<Song[]>([]);

    function playSong(song: Song) {
        setCurrentSong(prev => {
            if (prev?.id === song.id) return prev;
            return song;
        });
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(prev => !prev);
    }

    function nextSong() {
        if (!playlist.length || !currentSong) return;
        const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        setCurrentSong(playlist[nextIndex]);
        setIsPlaying(true);
    }

    function prevSong() {
        if(!playlist.length || !currentSong) return;
        const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        setCurrentSong(playlist[prevIndex]);
        setIsPlaying(true);
    }

    function saveSong(song: Song) {
        setSavedSongs(prev => {
            if (!prev.find(s => s.id === song.id)) {
                return [...prev, song];
            }
            return prev;
        });
    }

    function removeSavedSong(songId: string) {
        setSavedSongs(prev => prev.filter(s => s.id !== songId));
    }

    return (
        <MusicContext.Provider value={{
            currentSong,
            isPlaying,
            playlist,
            playSong,
            togglePlay,
            nextSong,
            prevSong,
            setPlaylist,
            savedSongs,
            saveSong,
            removeSavedSong
        }}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic(): MusicContextType {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
}