import React, { useState } from "react";
import "../styles/Songs.css";

function Songs() {

    // Dummy data (20, tesztelés miatt)
    const songsData = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `Song Title ${i + 1}`,
        genre: ["Pop", "Rock", "Electronic", "Hip-Hop", "Ambient"][i % 5],
        image: `/dummy${(i % 3) + 1}.jpg`
    }));

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
                        <div key={song.id} className="song-card">
                            <img src={song.image} alt={song.title} />
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