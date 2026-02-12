import { useState, useRef } from "react";
import { useNavigate} from "react-router-dom";
import { Filter } from "lucide-react";
import { MainRoutes } from "../../routes/constants/Main_Routes";
import { useSongClick } from "../../hooks/SongPage_hooks/useSongClick";
import { useFilteringSongs } from "../../hooks/Songs_hooks/useFilteringSongs";
import "./Songs.scss";

export const Songs = () => {
    const navigate = useNavigate();
    const { handleFilteredSongClick } = useSongClick();

    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const filterRef = useRef<HTMLDivElement>(null);

    const {
        currentSongs,
        filteredSongs,
        genres,
        selectedGenre,
        searchQuery,
        currentPage, setCurrentPage,
        totalPages,
        loading,
        error,
        handleGenreChange,
        retry
    } = useFilteringSongs(15);

    // töltési logika
    if (loading) {
        return (
            <div className="songs songs--loading">
                <div className="songs__status-container">
                    <div className="songs__spinner"></div>
                    <p className="songs__status-text">Loading songs...</p>
                </div>
            </div>
        );
    }

    // hibakezelés, fallback oldal
    if (error) {
        return (
            <div className="songs songs--error">
                <div className="songs__status-container">
                    <h2 className="songs__error-title">Failed to load songs</h2>
                    <p className="songs__error-text">{error}</p>
                    <button className="songs__retry-button" onClick={retry}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="songs">
            <div className="songs__container">
                <h1 className="songs__title">Sounds for Every Moment</h1>

                <div className="songs__filter-wrapper" ref={filterRef}>
                    <button
                        className={`songs__filter-toggle ${selectedGenre !== "All" ? "songs__filter-toggle--active" : ""}`}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <div className="songs__filter-label">
                            <Filter size={18} className="songs__filter-icon" />
                            <span>{selectedGenre === "All" ? "Filter" : `Genre: ${selectedGenre}`}</span>
                        </div>
                    </button>
                    {isFilterOpen && (
                        <div className="songs__filter-bar">
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    className={`songs__genre-button ${selectedGenre === genre ? "songs__genre-button--active" : ""}`}
                                    onClick={() => handleGenreChange(genre)}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                    
                    {filteredSongs.length === 0 && (
                        <div className="songs__no-results">
                            <h2 className="songs__no-results-title">No song or mix found with this word: "{searchQuery}". Reset the page</h2>
                            <button className="songs__reset-button" onClick={() => navigate(MainRoutes.SONGS)}>
                                Reset page
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
                    <button
                        className="songs__pagination-button"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >Prev</button>
                    <span className="songs__pagination-info">
                        Page {currentPage} / {totalPages}
                    </span>
                    <button
                        className="songs__pagination-button"
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >Next</button>
                </div>
            </div>

            <footer className="songs__footer">
                <p>© {new Date().getFullYear()} DJ Enez - All rights reserved</p>

                <a 
                    href="https://soundcloud.com/djenez"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="songs__soundcloud-link"
                >
                    <img className="songs__soundcloud-logo" src="/assets/soundcloud-logo.svg" alt="SoundCloud" />
                    <span>Follow <strong className="songs__brand-name"><span style={{ color: "var(--inverse)" }}>DJ Enez</span></strong> on SoundCloud</span>
                </a>
            </footer>
        </div>
    );
};