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

    // a MusicContext-ből érkező mentett dalokat szinkronizálja
    // a helyi állapottal, amikor betölt a komponens
    useEffect(() => {
        setSongs(savedSongs ?? []);
        setLoading(false);
    }, [savedSongs]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search")?.toLowerCase() ?? "";

    // kiszűri a mentett zenéket
    const filteredSongs = songs.filter((song) => searchQuery === "" ? true : song.title.toLowerCase().includes(searchQuery));

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 15;
    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSongs = filteredSongs.slice(startIndex, startIndex + itemsPerPage);

    // zene lejátszása -> csak a mentett zenéket teszi a playlist-re
    function handleSongClick(song: Song) {
        setPlaylist(filteredSongs);
        playSong(song);
        navigate(`/songs/${song.id}`, { state: { song, playlist: filteredSongs } });
    }

    // loading screen amíg az adatok megérkeznek
    if (loading) {
        return (
            <div className="songs">
                <div className="songs__status-container loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading saved songs...</p>
                </div>
            </div>
        );
    }

    // üres állapot kezelése
    if (!songs || songs.length === 0) {
        return (
            <div className="songs">
                <div className="songs__no-results">
                    <h2 className="songs__no-results-title">You have no saved songs.</h2>
                    <button className="songs__reset-button" onClick={() => navigate("/songs")}>
                        Browse songs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="songs">
            <div className="songs__container">
                <h1 className="songs__title">Your Favorite Songs</h1>

                {filteredSongs.length === 0 && (
                    <div className="songs__no-results">
                        <h2 className="songs__no-results-title">No song found with "{searchQuery}"</h2>
                        <button className="songs__reset-button" onClick={() => navigate("/saved")}>
                            Reset search
                        </button>
                    </div>
                )}

                <div className="songs__grid">
                    {currentSongs.map((song) => (
                        <div key={song.id} className="songs__card-wrapper">
                            <div
                                key={song.id}
                                className="songs__card"
                                onClick={() => handleSongClick(song)}
                            >
                                <img className="songs__card-image" src={song.cover} alt={song.title} />
                                <h3 className="songs__card-title">{song.title}</h3>
                                <p className="songs__card-genre">{song.genre}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="songs__pagination">
                    <button className="songs__pagination-button" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
                    <span>Page {currentPage} / {totalPages}</span>
                    <button className="songs__pagination-button" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
        </div>
    );
}