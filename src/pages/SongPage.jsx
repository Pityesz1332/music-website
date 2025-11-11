import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Play, Pause, ArrowLeft } from "lucide-react";
import ScrollToTop from "../components/ScrollToTop";
import { songsData } from "../data/songsData";
import Playbar from "../components/Playbar";
import "../styles/SongPage.css";

function SongPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams();
    const playlistRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState(state?.playlist || songsData);
    const [currentSong, setCurrentSong] = useState(state?.song || null);

    useEffect(() => {
        if (state?.song?.id === Number(id)) return;

        const songId = Number(id);
        if (songId) {
            const found = songsData.find((s) => s.id === songId);
            if (found) setCurrentSong(found)
        }
    }, [id, state?.song]);

    useEffect(() => {
        if (!currentSong || !playlistRef.current) return;

        const activeCard = playlistRef.current.querySelector(`.mini-card.active`);

        if (activeCard) {
            const container = playlistRef.current;
            const containerRect = container.getBoundingClientRect();
            const cardRect = activeCard.getBoundingClientRect();

            const scrollLeft = activeCard.offsetLeft - container.offsetLeft - containerRect.width / 2 + cardRect.width / 2;

            container.scrollTo({
                left: scrollLeft,
                behavior: "smooth",
            });
        }
    }, [currentSong]);

    function handleNext() {
        const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        setCurrentSong(playlist[nextIndex]);
        setIsPlaying(false);
    }

    function handlePrev() {
        const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        setCurrentSong(playlist[prevIndex]);
        setIsPlaying(false);
    }

    if (!currentSong) {
        return (
            <div className="song-page">
                <p className="not-found">Song not found</p>
            </div>
        );
    }

    return (
        <div className="song-page">

            <button className="back-btn" onClick={() => navigate("/songs")}>
                <ArrowLeft size={20} /> Back
            </button>
        
            <div className="song-content">
                <div className="song-cover-wrapper">
                    <img src={currentSong.image} alt={currentSong.title} className="song-cover" />
                    <div className={`glow ${isPlaying ? "active" : ""}`}></div>
                </div>

                <div className="song-info glass">
                    <h1>{currentSong.title}</h1>
                    <h2>{currentSong.artist}</h2>
                    <p>Genre: <span>{currentSong.genre}</span></p>
                    <p>Duration: <span>{currentSong.duration}</span></p>

                    <div className="controls">
                        <button className="nav-btn" onClick={handlePrev}>⏮ Prev</button>
                        
                        <button
                            className={`play-btn neon-btn ${isPlaying ? "playing" : ""}`}
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                            {isPlaying ? "Stop" : "Play"}
                        </button>

                        <button className="nav-btn" onClick={handleNext}>Next ⏭</button>
                    </div>
                </div>
            </div>

            <div className="bottom-playlist" ref={playlistRef}>
                {playlist.map((song) => (
                    <div
                        key={song.id}
                        className={`mini-card ${song.id === currentSong.id ? "active" : ""}`}
                        onClick={() => setCurrentSong(song)}
                    >
                        <img src={song.image} alt={song.title} />
                        <p>{song.title}</p>
                    </div>
                ))}
            </div>

            {currentSong && (
                <Playbar
                    song={currentSong}
                    isPlaying={isPlaying}
                    onPlayPause={() => setIsPlaying(!isPlaying)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />
            )}

            <ScrollToTop />
        </div>
    );
}

export default SongPage;