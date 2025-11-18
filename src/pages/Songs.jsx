import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import songsData from "../data/songs.json";
import "../styles/Songs.css";

function Songs() {
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const totalPages = Math.ceil(songsData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSongs = songsData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="songs-page">
            <div className="songs-container">
                <h1 className="page-title">Sounds for Every Moment</h1>

                <div className="grid">
                    {currentSongs.map((song) => (
                        <div 
                            key={song.id} 
                            className="song-card"
                            onClick={() => navigate(`/songs/${song.id}`, { state: { song, playlist: songsData } })}
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