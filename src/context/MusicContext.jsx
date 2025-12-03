import { createContext, useContext, useState } from "react";

const MusicContext = createContext();

function MusicProvider({ children }) {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [savedSongs, setSavedSongs] = useState([]);

    function playSong(song) {
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

    function saveSong(song) {
        setSavedSongs(prev => {
            if (!prev.find(s => s.id === song.id)) {
                return [...prev, song];
            }
            return prev;
        });
    }

    function removeSavedSong(songId) {
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

function useMusic() {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('error');
    }
    return context;
}

export { MusicProvider, useMusic };