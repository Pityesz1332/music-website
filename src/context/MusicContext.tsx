import { createContext, useContext, useState, ReactNode } from "react";
import type { Song } from "../types/music";
import { usePlayback } from "../hooks/usePlayback";
import { useRecentlyPlayed } from "../hooks/useRecentlyPlayed";
import { useSaveSong } from "../hooks/useSaveSong";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

// ez a lista írja le hogy mit tud a rendszer
interface MusicContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    playlist: Song[];
    savedSongs: Song[];
    recentlyPlayed: Song[];

    playSong: (song: Song) => void;
    togglePlay: () => void;
    nextSong: () => void;
    prevSong: () => void;
    setPlaylist: (song: Song[]) => void;
    saveSong: (song: Song) => void;
    removeSavedSong: (songId: string) => void;
    clearRecentlyPlayed: () => void;
}

// létrehozzuk a context-et
const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
    children: ReactNode;
}

export function MusicProvider({ children }: MusicProviderProps) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [playlist, setPlaylist] = useState<Song[]>([]);

    // hook-ok
    const { recentlyPlayed, addToRecentlyPlayed, clearRecentlyPlayed } = useRecentlyPlayed();
    const { savedSongs, saveSong, removeSavedSong } = useSaveSong();
    const { playSong, togglePlay, nextSong, prevSong } = usePlayback({
        currentSong,
        isPlaying,
        playlist,
        setCurrentSong,
        setIsPlaying,
        addToRecentlyPlayed
    });

    // böngésző tab cím frissítése
    useDocumentTitle(currentSong, isPlaying);

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
            removeSavedSong,
            recentlyPlayed,
            clearRecentlyPlayed
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