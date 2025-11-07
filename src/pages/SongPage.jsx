import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SongPage.css";
import ScrollToTop from "../components/ScrollToTop";

function SongPage() {
    const { state: song } = useLocation();
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);

    if (!song) {
        return (
            <div className="song-page">
                <p>Song not found</p>
                <button onClick={() => navigate("/songs")}>Go back</button>
            </div>
        );
    }

    return (
        <div className="song-page">
            <button className="back-btn" onClick={() => navigate("/songs")}>Back</button>
        
            <div className="song-content">
                <img src={song.image} alt={song.title} className="song-cover" />
                <div className="song-info">
                    <h1>{song.title}</h1>
                    <h2>{song.artist}</h2>
                    <p>Genre: {song.genre}</p>
                    <p>Duration: {song.duration}</p>

                    <button
                        className={`play-btn ${isPlaying ? "playing" : ""}`}
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? "Stop" : "Play"}
                    </button>
                </div>
            </div>
            <ScrollToTop />
        </div>
    );
}

export default SongPage;