import { useNavigate } from "react-router-dom";
import { useMusic } from "@context/MusicContext";
import { getSongPath } from "@routes/constants/MainRoutes";
import type { Song } from "@interfaces/music";

export const useSongClick = () => {
    const navigate = useNavigate();
    const { playSong, playlist, setPlaylist } = useMusic();

    // Handle track selection.
    // Initialize playback and pass data to the new page.
    const handleSongClick = (song: Song) => {
        playSong(song);
        navigate(getSongPath(song.id), {
            state: { song, playlist }
        });
    };

    // Handling clicks within a filtered list (e.g., saved tracks).
    const handleFilteredSongClick = (song: Song, newPlaylist: Song[]) => {
        setPlaylist(newPlaylist);
        playSong(song);
        navigate(getSongPath(song.id), {
            state: { song, playlist: newPlaylist }
        });
    };

    return { handleSongClick, handleFilteredSongClick };
};