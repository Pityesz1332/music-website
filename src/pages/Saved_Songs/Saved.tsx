import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import "../Songs/Songs.scss";
import type { Song } from "../../types/music";

export const Saved = () => {
    const navigate = useNavigate();
    const { playSong, setPlaylist, savedSongs } = useMusic();
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setSongs(savedSongs ?? []);
        setLoading(false);
    }, [savedSongs]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search")?.toLowerCase() ?? "";

    const filteredSongs = songs.filter((song) => searchQuery === "" ? true : song.title.toLowerCase().includes(searchQuery));

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 15;
    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSongs = filteredSongs.slice(startIndex, startIndex + itemsPerPage);

    function handleSongClick(song: Song) {
        setPlaylist(filteredSongs);
        playSong(song);
        navigate(`/songs/${song.id}`, { state: { song, playlist: filteredSongs } });
    }

    if (loading) {
        return (
            <div className="songs-page">
                <div className="songs-container loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading saved songs...</p>
                </div>
            </div>
        );
    }

    if (!songs || songs.length === 0) {
        return (
            <div className="songs-page">
                <div className="songs-container">
                    <h2>You have no saved songs.</h2>
                    <button className="reset-btn" onClick={() => navigate("/songs")}>
                        Browse songs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="songs-page">
            <div className="songs-container">
                <h1 className="page-title">Your Saved Songs</h1>

                {filteredSongs.length === 0 && (
                    <div className="no-results">
                        <h2>No song found with "{searchQuery}"</h2>
                        <button className="reset-btn" onClick={() => navigate("/saved")}>
                            Reset search
                        </button>
                    </div>
                )}

                <div className="grid">
                    {currentSongs.map((song) => (
                        <div
                            key={song.id}
                            className="song-card"
                            onClick={() => handleSongClick(song)}
                        >
                            <img src={song.cover} alt={song.title} />
                            <h3>{song.title}</h3>
                            <p>{song.genre}</p>
                        </div>
                    ))}
                </div>

                <div className="pagination">
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
                    <span>Page {currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
        </div>
    );
}