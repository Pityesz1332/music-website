import { useState, useRef } from "react";
import { useNavigate} from "react-router-dom";
import { Filter } from "lucide-react";
import { MainRoutes } from "../../routes/constants/MainRoutes";
import { useSongClick } from "../../hooks/music/useSongClick";
import { useFilteringSongs } from "../../hooks/music/useFilteringSongs";
import { ErrorState } from "./subcomponents/ErrorState";
import { SONGS_STRINGS } from "../../constant-strings/ui/songs";
import { Button } from "../../components/ui/button/Button";
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
                    <p className="songs__status-text">{SONGS_STRINGS.LOADING}</p>
                </div>
            </div>
        );
    }

    // hibakezelés, fallback oldal
    if (error) {
        return (
            <div className="songs songs--error">
                <ErrorState 
                    title={SONGS_STRINGS.ERROR.TITLE}
                    txt={error}
                    btnTxt={SONGS_STRINGS.ERROR.BTN}
                    onBtnClick={retry}
                />
            </div>
        );
    }

    return (
        <div className="songs">
            <div className="songs__container">
                <h1 className="songs__title">{SONGS_STRINGS.TITLE}</h1>

                <div className="songs__filter-wrapper" ref={filterRef}>
                    <Button
                        className={`songs__filter-toggle ${selectedGenre !== "All" ? "songs__filter-toggle--active" : ""}`}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <div className="songs__filter-label">
                            <Filter size={18} className="songs__filter-icon" />
                            <span>{selectedGenre === "All" ? SONGS_STRINGS.FILTER.LABEL : `${SONGS_STRINGS.FILTER.GENRE_PREFIX}${selectedGenre}`}</span>
                        </div>
                    </Button>
                    {isFilterOpen && (
                        <div className="songs__filter-bar">
                            {genres.map((genre) => (
                                <Button
                                    key={genre}
                                    className={`songs__genre-button ${selectedGenre === genre ? "songs__genre-button--active" : ""}`}
                                    onClick={() => handleGenreChange(genre)}
                                >
                                    {genre}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                    
                {filteredSongs.length === 0 && (
                    <div className="songs__no-results">
                        <h2 className="songs__no-results-title">{SONGS_STRINGS.NO_RESULTS.MESSAGE(searchQuery)}</h2>
                        <Button 
                            className="songs__reset-button" 
                            to={MainRoutes.SONGS}
                        >
                            {SONGS_STRINGS.NO_RESULTS.RESET_BTN}
                        </Button>
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
                    <Button
                        className="songs__pagination-button"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        {SONGS_STRINGS.PAGINATION.PREV}
                    </Button>
                    
                    <span className="songs__pagination-info">
                        {SONGS_STRINGS.PAGINATION.PAGE_INFO(currentPage, totalPages)}
                    </span>
                    
                    <Button
                        className="songs__pagination-button"
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        {SONGS_STRINGS.PAGINATION.NEXT}
                    </Button>
                </div>
            </div>

            <footer className="songs__footer">
                <p>© {new Date().getFullYear()} DJ Enez - {SONGS_STRINGS.FOOTER.RIGHTS}</p>

                <a 
                    href="https://soundcloud.com/djenez"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="songs__soundcloud-link"
                >
                    <img className="songs__soundcloud-logo" src="/assets/soundcloud-logo.svg" alt="SoundCloud" />
                    <span>{SONGS_STRINGS.FOOTER.FOLLOW} 
                        <strong className="songs__brand-name">
                            <span style={{ color: "var(--inverse)" }}>DJ Enez</span>
                        </strong> {SONGS_STRINGS.FOOTER.ON_SOUNDCLOUD}</span>
                </a>
            </footer>
        </div>
    );
};