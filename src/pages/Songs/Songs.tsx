import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import { apiFetch } from "../../utils/api";
import songsData from "../../data/songs.json";
import { Filter } from "lucide-react";
import "./Songs.scss";
import type { Song } from "../../types/music";

export const Songs = () => {
    const navigate = useNavigate();
    const { playSong, setPlaylist } = useMusic();

    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const filterRef = useRef<HTMLDivElement>(null);

    // zenék betöltése
    useEffect(() => {
        async function loadSongs() {
            setLoading(true);
            setError(null);

            setSongs(songsData as Song[]);
            setLoading(false);

// --- Ez majd később kell ha lesz backend ---
//            try {
//                const data = await apiFetch<Song[]>("/data/songs.json");
//                setSongs(songsData as Song[]);
//            } catch (err) {
//                setError(err instanceof Error ? err.message : "Unknown error");
//            } finally {
//                setLoading(false);
//            }
        }

        loadSongs();
    }, []);

    // sima retry logika
    function retry() {
        setLoading(true);
        setError(null);

        apiFetch<Song[]>("/data/songs.json")
            .then(data => setSongs(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }

    
    // zenék keresése genre alapján
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search")?.toLowerCase() ?? "";
    
    // szűrés genre alapján
    const genres: string[] = ["All", ...new Set(songs.map(song => song.genre))];
    const [selectedGenre, setSelectedGenre] = useState<string>("All");

    const filteredSongs = songs
                            .filter((song) =>
                                selectedGenre === "All" ? true : song.genre === selectedGenre
                            )
                            .filter((song) =>
                                searchQuery === "" ? true : song.title.toLowerCase().includes(searchQuery)
                            );

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 15;
    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSongs = filteredSongs.slice(startIndex, startIndex + itemsPerPage);

    // beállítja a választott genre-t
    function handleGenreChange(genre: string) {
        setSelectedGenre(genre);
        setCurrentPage(1);
        setIsFilterOpen(false);
    }

    // zenelejátszás
    function handleSongClick(song: Song) {
        setPlaylist(filteredSongs);
        playSong(song);
        navigate(`/songs/${song.id}`, { state: { song, playlist: filteredSongs } });
    }

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
                </div>

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
                    
                    {filteredSongs.length === 0 && (
                        <div className="songs__no-results">
                            <h2 className="songs__no-results-title">No song or mix found with this word: "{searchQuery}". Reset the page</h2>
                            <button className="songs__reset-button" onClick={() => navigate("/songs")}>
                                Reset page
                            </button>
                        </div>
                    )}

                <div className="songs__grid">
                    {currentSongs.map((song) => (
                        <div 
                            key={song.id} 
                            className="songs__card"
                            onClick={() => handleSongClick(song)}
                        >
                            <img className="songs__card-image" src={song.cover} alt={song.title} />
                            <h3 className="songs__card-title">{song.title}</h3>
                            <p className="songs__card-genre">{song.genre}</p>
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