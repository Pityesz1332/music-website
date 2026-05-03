import { useAuth } from "@context/AuthContext";
import { useMusic } from "@context/MusicContext";
import { useToggleSave } from "@hooks/general/useToggleSave";
import type { Song } from "@interfaces/music";

export const useSongActions = (song: Song, isMini: boolean) => {
    const auth = useAuth();
    const { savedSongs } = useMusic();
    const { toggleSave } = useToggleSave();

    const isConnected = auth?.isConnected;
    const isSaved = savedSongs.some((s) => s.id === song.id);

    // Dynamic style management.
    const containerClass = isMini ? "song-page__card-actions" : "song-page__actions";
    const buttonClass = isMini ? "song-page__card-action-btn" : "song-page__action-button";
    const saveModifier = isMini ? "song-page__card-action-btn--saved" : "song-page__action-button--saved";
    const iconSize = isMini ? 16 : 24;

    // Triggers the save logic.
    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleSave(song);
    };
    
    // download logic 
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        // logic here...
    };

    return {
        isConnected,
        isSaved,
        containerClass,
        buttonClass,
        saveModifier,
        iconSize,
        handleSave,
        handleDownload
    };
};