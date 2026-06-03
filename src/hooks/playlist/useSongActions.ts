import { useAuth } from "@context/AuthContext";
import { useMusic } from "@context/MusicContext";
import { useNotification, NotificationType } from "@context/NotificationContext";
import { useToggleSave } from "@hooks/general/useToggleSave";
import { downloadAudio } from "../../swarm/swarmService";
import type { Song } from "@interfaces/music";

export const useSongActions = (song: Song, isMini: boolean) => {
    const auth = useAuth();
    const { savedSongs } = useMusic();
    const { toggleSave } = useToggleSave();
    const { notify } = useNotification();

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
    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!song?.swarmHash) {
            notify("No available source on Swarm", NotificationType.ERROR);
            return;
        }

        try {
            await downloadAudio(song.swarmHash, `${song?.title}.mp3`);
            notify("Download started", NotificationType.SUCCESS);
        } catch {
            notify("Download failed", NotificationType.ERROR);
        }
        
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