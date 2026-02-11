import { useNavigate } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import { getSongPath } from "../../routes/constants/Main_Routes";
import type { Song } from "../../types/music";

export const useSongClick = () => {
    const navigate = useNavigate();
    const { playSong, playlist } = useMusic();

    const handleSongClick = (song: Song) => {
        playSong(song);
        navigate(getSongPath(song.id), {
            state: { playlist }
        });
    };

    return { handleSongClick };
};