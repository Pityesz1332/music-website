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

    // dinamikus stíluskezelés
    const containerClass = isMini ? "song-page__card-actions" : "song-page__actions";
    const buttonClass = isMini ? "song-page__card-action-btn" : "song-page__action-button";
    const saveModifier = isMini ? "song-page__card-action-btn--saved" : "song-page__action-button--saved";
    const iconSize = isMini ? 16 : 24;

    // meghívja a mentési logikát
    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleSave(song);
    };
    
    // letöltési logika 
    // (backend-nél építem meg, valószínűleg külön komponens lesz)
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        // letöltési logika majd
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