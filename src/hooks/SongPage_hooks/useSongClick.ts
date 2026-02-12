import { useNavigate } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import { getSongPath } from "../../routes/constants/Main_Routes";
import type { Song } from "../../types/music";

export const useSongClick = () => {
    const navigate = useNavigate();
    const { playSong, playlist, setPlaylist } = useMusic();

    // sima kattintás egy zenére
    // zene indítása
    // adatok átadása az új oldalnak
    const handleSongClick = (song: Song) => {
        playSong(song);
        navigate(getSongPath(song.id), {
            state: { song, playlist }
        });
    };

    // kattintás szűrt listában (pl. saved)
    const handleFilteredSongClick = (song: Song, newPlaylist: Song[]) => {
        setPlaylist(newPlaylist);
        playSong(song);
        navigate(getSongPath(song.id), {
            state: { song, playlist: newPlaylist }
        });
    };

    return { handleSongClick, handleFilteredSongClick };
};