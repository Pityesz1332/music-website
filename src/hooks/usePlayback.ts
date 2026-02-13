import { Song } from "../types/music";

// definiáljuk mit kell megkapni a működéshez
interface PlaybackLogicProps {
    currentSong: Song | null;
    playlist: Song[];
    setCurrentSong: (song: Song | null) => void;
    setIsPlaying: (playing: boolean) => void;
    addToRecentlyPlayed: (song: Song) => void;
}

// playbar controls gombok működése
export const usePlayback = ({
    currentSong,
    isPlaying,
    playlist,
    setCurrentSong,
    setIsPlaying,
    addToRecentlyPlayed
}: PlaybackLogicProps & { isPlaying: boolean }) => {

    // zene elindítása (ha nem ugyanaz a zene)
    const playSong = (song: Song) => {
        if (currentSong?.id !== song.id) {
            setCurrentSong(song);
            addToRecentlyPlayed(song);
        }
        setIsPlaying(true);
    };

    // play-stop gomb működése
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // következő dalra ugrás
    const nextSong = () => {
        if (!playlist.length || !currentSong) return;
        const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        const next = playlist[nextIndex];
        playSong(next);
    };

    // előző dalra ugrás
    const prevSong = () => {
        if (!playlist.length || !currentSong) return;
        const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        const prev = playlist[prevIndex];
        playSong(prev);
    };

    return { playSong, togglePlay, nextSong, prevSong }
}