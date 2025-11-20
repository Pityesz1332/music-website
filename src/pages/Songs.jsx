import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import songsData from "../data/songs.json";
import "../styles/Songs.css";

function Songs() {
    const navigate = useNavigate();
    const genres = ["All", ...new Set(songsData.map(song => song.genre))];
    const [selectedGenre, setSelectedGenre] = useState("All");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search")?.toLowerCase() || "";

    const filteredSongs = songsData
                            .filter((song) =>
                                selectedGenre === "All" ? true : song.genre === selectedGenre
                            )
                            .filter((song) =>
                                searchQuery === "" ? true : song.title.toLowerCase().includes(searchQuery)
                            );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSongs = filteredSongs.slice(startIndex, startIndex + itemsPerPage);

    function handleGenreChange(genre) {
        setSelectedGenre(genre);
        setCurrentPage(1);
    };

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
                            onClick={() => navigate(`/songs/${song.id}`, { state: { song, playlist: filteredSongs } })}
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
        </div>
    );
};

export default Songs;