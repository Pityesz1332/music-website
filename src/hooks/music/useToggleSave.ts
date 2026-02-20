import type { Song } from "../../types/music"
import { useNotification, NotificationType } from "../../context/NotificationContext"
import { useMusic } from "../../context/MusicContext";

export const useToggleSave = () => {
    const { notify } = useNotification();
    const { saveSong, removeSavedSong, savedSongs } = useMusic();

    const toggleSave = (song: Song) => {
        const isSaved = savedSongs.some(s => s.id === song.id);
        
        if (isSaved) {
            removeSavedSong(song.id);
            notify("Deleted from saved songs", NotificationType.SUCCESS);
        } else {
            saveSong(song);
            notify("Saved to favorites", NotificationType.SUCCESS);
        }
    };

    return { toggleSave };
};