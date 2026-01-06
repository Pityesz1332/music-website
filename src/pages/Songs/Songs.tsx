import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import { apiFetch } from "../../utils/api";
import songsData from "../../data/songs.json";
import "./Songs.scss";
import type { Song } from "../../types/music";

export const Songs = () => {
    const navigate = useNavigate();
    const { playSong, setPlaylist } = useMusic();

    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadSongs() {
            setLoading(true);
            setError(null);

            setSongs(songsData as Song[]);
            setLoading(false);

// --- Ez majd később kell ---
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

    function retry() {
        setLoading(true);
        setError(null);

        apiFetch<Song[]>("/data/songs.json")
            .then(data => setSongs(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }

    const genres: string[] = ["All", ...new Set(songs.map(song => song.genre))];
    const [selectedGenre, setSelectedGenre] = useState<string>("All");
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search")?.toLowerCase() ?? "";

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

    function handleGenreChange(genre: string) {
        setSelectedGenre(genre);
        setCurrentPage(1);
    }

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
                    <p>Loading songs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="songs-page">
                <div className="songs-container">
                    <h2>Failed to load songs</h2>
                    <p>{error}</p>
                    <button className="reset-btn" onClick={retry}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="songs-page">
            <div className="songs-container">
                <h1 className="page-title">Sounds for Every Moment</h1>

                <div className="filter-bar">
                    {genres.map((genre) => (
                        <button
                            key={genre}
                            className={`filter-btn ${selectedGenre === genre ? "active" : ""}`}
                            onClick={() => handleGenreChange(genre)}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                {filteredSongs.length === 0 && (
                    <div className="no-results">
                        <h2>No song or mix found with this word: "{searchQuery}". Reset the page</h2>
                        <button className="reset-btn" onClick={() => navigate("/songs")}>
                            Reset page
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
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >Prev</button>
                    <span>
                        Page {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >Next</button>
                </div> 
            </div>
            <footer className="songs-footer">
                <p>© {new Date().getFullYear()} DJ Enez - All rights reserved</p>

                <a 
                    href="https://soundcloud.com/djenez"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sc-btn"
                >
                    <img src="/assets/soundcloud-logo.svg" alt="SoundCloud" />
                    <span>Follow <strong><span style={{ color: "var(--inverse)" }}>DJ Enez</span></strong> on SoundCloud</span>
                </a>
            </footer>
        </div>
    );
};