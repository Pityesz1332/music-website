import { useNavigate } from "react-router-dom";
import { MainRoutes } from "../../routes/constants/Main_Routes";
import { useMusic } from "../../context/MusicContext";
import { useSongClick } from "../../hooks/useSongClick";
import { useFilteringSaved } from "../../hooks/useFilteringSaved";
import "../Songs/Songs.scss";

export const Saved = () => {
    const navigate = useNavigate();
    const { savedSongs } = useMusic();

    const { handleFilteredSongClick } = useSongClick();

    const isLoading = savedSongs === undefined || savedSongs === null;

    const {
        searchQuery,
        filteredSongs,
        currentSongs,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useFilteringSaved(savedSongs ?? []);

    // loading screen amíg az adatok megérkeznek
    if (isLoading) {
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
    if (savedSongs.length === 0) {
        return (
            <div className="songs">
                <div className="songs__no-results">
                    <h2 className="songs__no-results-title">You have no saved songs.</h2>
                    <button className="songs__reset-button" onClick={() => navigate(MainRoutes.SONGS)}>
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
                        <button className="songs__reset-button" onClick={() => navigate(MainRoutes.SAVED)}>
                            Reset search
                        </button>
                    </div>
                )}

                <div className="songs__grid">
                    {currentSongs.map((song) => (
                        <div key={song.id} className="songs__card-wrapper">
                            <div
                                className="songs__card"
                                onClick={() => handleFilteredSongClick(song, filteredSongs)}
                            >
                                <img className="songs__card-image" src={song.cover} alt={song.title} />
                                <h3 className="songs__card-title">{song.title}</h3>
                                <p className="songs__card-genre">{song.genre}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="songs__pagination">
                    <button className="songs__pagination-button" onClick={prevPage} disabled={currentPage === 1}>Prev</button>
                    <span>Page {currentPage} / {Math.max(totalPages, 1)}</span>
                    <button className="songs__pagination-button" onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
        </div>
    );
}