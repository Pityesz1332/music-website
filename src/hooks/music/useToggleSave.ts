import type { Song } from "../../types/music"
import { useNotification, NotificationType } from "../../context/NotificationContext"
import { useMusic } from "../../context/MusicContext";
import { TOGGLE_SAVE_STRINGS } from "../../i18n/feedback/toggle-save";

export const useToggleSave = () => {
    const { notify } = useNotification();
    const { saveSong, removeSavedSong, savedSongs } = useMusic();

    const toggleSave = (song: Song) => {
        const isSaved = savedSongs.some(s => s.id === song.id);
        
        if (isSaved) {
            removeSavedSong(song.id);
            notify(TOGGLE_SAVE_STRINGS.MESSAGES.DELETE, NotificationType.SUCCESS);
        } else {
            saveSong(song);
            notify(TOGGLE_SAVE_STRINGS.MESSAGES.SAVE, NotificationType.SUCCESS);
        }
    };

    return { toggleSave };
};