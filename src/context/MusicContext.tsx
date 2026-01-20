import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Song } from "../types/music";

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

const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
    children: ReactNode;
}

// innen működnek a zenekezeléshez szükséges funkciók
export function MusicProvider({ children }: MusicProviderProps) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [savedSongs, setSavedSongs] = useState<Song[]>([]);

    // korábban hallgatott zenék tömbje
    const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(() => {
        try {
            const saved = localStorage.getItem("recentlyPlayed");
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to load recent playlist:", error);
            return [];
        }
    });

    // mentjük előzményként a zenéket, így kilépés után is megmarad
    useEffect(() => {
        localStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed));
    }, [recentlyPlayed]);

    // a tab címének átírása, hogy ha a user elnavigál, jól látható maradjon, mi szól  
    useEffect(() => {
        if (currentSong) {
            const statusEmoji = isPlaying ? "▶" : "⏸";
            document.title = `${statusEmoji} ${currentSong.title} - ${currentSong.artist}`;
        } else {
            document.title = "DJ Enez";
        }
    }, [currentSong, isPlaying]);

    // mindig hozzáadjuk az előzményhez az aktuálisan hallgatott zenét
    function addToRecentlyPlayed(song: Song) {
        setRecentlyPlayed(prev => {
            const filtered = prev.filter(s => s.id !== song.id);
            return [song, ...filtered].slice(0, 5);
        });
    }

    // előzmények törlése
    function clearRecentlyPlayed() {
        setRecentlyPlayed([]);
    }

    // zenelejátszás indítása és előzményekhez adása
    // ha nem ugyanaz a zene megy, betölti azt, amire kattintunk
    function playSong(song: Song) {
        setCurrentSong(prev => {
            if (prev?.id === song.id) return prev;
            return song;
        });
        setIsPlaying(true);
        addToRecentlyPlayed(song);
    }

    // zene megállítása/elindítása
    function togglePlay() {
        setIsPlaying(prev => !prev);
    }

    // következő zenére váltás logikája
    // ha a lista végére érünk, a % miatt automatikusan az elejéről kezdi
    function nextSong() {
        if (!playlist.length || !currentSong) return;
        const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        const next = playlist[nextIndex];
        setCurrentSong(next);
        setIsPlaying(true);
        addToRecentlyPlayed(next);
    }

    // az előző zenére ugrás logikája
    function prevSong() {
        if(!playlist.length || !currentSong) return;
        const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        const prev = playlist[prevIndex];
        setCurrentSong(prev);
        setIsPlaying(true);
        addToRecentlyPlayed(prev);
    }

    // zene mentési logikája
    function saveSong(song: Song) {
        setSavedSongs(prev => {
            if (!prev.find(s => s.id === song.id)) {
                return [...prev, song];
            }
            return prev;
        });
    }

    // törlés a mentettek közül
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