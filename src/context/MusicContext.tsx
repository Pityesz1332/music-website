import { createContext, useContext, useState, useMemo, ReactNode, useCallback } from "react";
import type { Song } from "@interfaces/music";
import { usePlayback } from "@hooks/playback/usePlayback";
import { useRecentlyPlayed } from "@hooks/music-control/useRecentlyPlayed";
import { useSaveSong } from "@hooks/music-control/useSaveSong";
import { useDocumentTitle } from "@hooks/ui/useDocumentTitle";
import { resolveSwarmAudio } from "../swarm-gateway/swarmService";

interface MusicContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    playlist: Song[];
    savedSongs: Song[];
    recentlyPlayed: Song[];
    isLoadingSwarm: boolean;
    isShuffle: boolean;

    playSong: (song: Song, newPlaylist?: Song[]) => void;
    togglePlay: () => void;
    nextSong: () => void;
    prevSong: () => void;
    setPlaylist: (songs: Song[]) => void;
    saveSong: (song: Song) => void;
    removeSavedSong: (songId: string) => void;
    clearRecentlyPlayed: () => void;
    handleToggleShuffle: () => void;
}

// creating context
const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
    children: ReactNode;
}

export function MusicProvider({ children }: MusicProviderProps) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [isLoadingSwarm, setIsLoadingSwarm] = useState(false);
    const [isShuffle, setIsShuffle] = useState<boolean>(false);

    const { recentlyPlayed, addToRecentlyPlayed, clearRecentlyPlayed } = useRecentlyPlayed();
    const { savedSongs, saveSong, removeSavedSong } = useSaveSong();

    const playSong = useCallback(async (song: Song, newPlaylist?: Song[]) => {
        if (!song.swarmHash) {
            playbackPlay(song, newPlaylist);
            return;
        }

        try {
            setIsLoadingSwarm(true);
            const blobUrl = await resolveSwarmAudio(song.swarmHash);
            playbackPlay({ ...song, src: blobUrl }, newPlaylist);
        } catch (err) {
            console.error("[Swarm] Download failed:", err);
            playbackPlay(song, newPlaylist);
        } finally {
            setIsLoadingSwarm(false);
        }
    }, []);

    const handleToggleShuffle = useCallback(() =>  { setIsShuffle(prev => !prev); }, []);

    const { playSong: playbackPlay, togglePlay, nextSong, prevSong } = usePlayback({
        currentSong,
        playlist,
        setCurrentSong,
        setIsPlaying,
        setPlaylist,
        addToRecentlyPlayed,
        onPlaySong: playSong,
        isShuffle
    });
    
    // browser tab title updating
    useDocumentTitle(currentSong, isPlaying);

    const value = useMemo(() => ({
        currentSong,
        isPlaying,
        playlist,
        isLoadingSwarm,
        isShuffle,
        playSong,
        togglePlay,
        nextSong,
        prevSong,
        setPlaylist,
        savedSongs,
        saveSong,
        removeSavedSong,
        recentlyPlayed,
        clearRecentlyPlayed,
        handleToggleShuffle
    }), [
        currentSong, isPlaying, playlist, playSong, isLoadingSwarm, isShuffle, togglePlay, nextSong, prevSong,
        setPlaylist, savedSongs, saveSong, removeSavedSong, recentlyPlayed, clearRecentlyPlayed, handleToggleShuffle
    ]);

    return (
        <MusicContext.Provider value={value}>
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