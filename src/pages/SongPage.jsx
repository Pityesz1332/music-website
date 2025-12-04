import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Play, Pause, ArrowLeft } from "lucide-react";
import { useMusic } from "../context/MusicContext";
import ScrollToTop from "../components/ScrollToTop";
import songsData from "../data/songs.json";
import "../styles/pages/SongPage.css";

function SongPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams();
    const playlistRef = useRef(null);

    const {
        currentSong,
        isPlaying,
        playlist,
        playSong,
        togglePlay,
        setPlaylist,
        nextSong,
        prevSong
    } = useMusic();

    useEffect(() => {
        console.log("Effect 1 running");
        if (state?.playlist) {
            setPlaylist(state.playlist);
        } else if (playlist.length === 0) {
            setPlaylist(songsData);
        }
    }, [state?.playlist, playlist.length, setPlaylist]);

    {/* useEffect(() => {
        console.log("Effect 2 running");
        const songId = Number(id);
        if (!songId) return;

        const found = (state?.playlist || songsData).find((s) => s.id === songId);
        if (found && (!currentSong || currentSong.id !== songId)) {
            playSong(found);
        }
    }, [id, state?.playlist, currentSong?.id]); */}
    
    useEffect(() => {
        if (!currentSong || !playlistRef.current) return;

        const activeCard = playlistRef.current.querySelector(`.mini-card.active`);

        if (activeCard) {
            const container = playlistRef.current;
            const containerRect = container.getBoundingClientRect();
            const cardRect = activeCard.getBoundingClientRect();

            const scrollTop = activeCard.offsetTop - (containerRect.height / 2) + (cardRect.height / 2);

            container.scrollTo({
                top: scrollTop,
                behavior: "smooth",
            });
        }
    }, [currentSong]);

    function handleSongClick(song) {
        playSong(song);
        navigate(`/songs/${song.id}`, { state: {playlist} });
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

                <video
                    className={`song-bg-video ${isPlaying ? "fade-out" : "fade-in"}`}
                    src={currentSong.defaultBgVideo}
                    autoPlay
                    loop
                    muted
                    key={`default-${currentSong.id}`}
                ></video>

                <video
                    className={`song-bg-video ${isPlaying ? "fade-in" : "fade-out"}`}
                    src={currentSong.playingBgVideo}
                    autoPlay
                    loop
                    muted
                    key={`playing-${currentSong.id}`}
                ></video>
        
            <div className="song-content">
                <div className="song-cover-wrapper">
                    <img src={currentSong.cover} alt={currentSong.title} className="song-cover-main" />
                    <div className={`glow ${isPlaying ? "active" : ""}`}></div>
                </div>

                <div className="song-info glass">
                    <h1>{currentSong.title}</h1>
                    <h2>{currentSong.artist}</h2>
                    <p>Genre: <span>{currentSong.genre}</span></p>
                    <p>Duration: <span>{currentSong.duration}</span></p>

                    <div className="controls">
                        <button className="nav-btn" onClick={prevSong}>⏮ Prev</button>
                        
                        <button
                            className={`play-btn neon-btn ${isPlaying ? "playing" : ""}`}
                            onClick={togglePlay}
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                            {isPlaying ? "Stop" : "Play"}
                        </button>

                        <button className="nav-btn" onClick={nextSong}>Next ⏭</button>
                    </div>
                </div>
            </div>

            <div className="right-playlist" ref={playlistRef}>
                {playlist.map((song) => (
                    <div
                        key={song.id}
                        className={`mini-card ${song.id === currentSong.id ? "active" : ""}`}
                        onClick={() => handleSongClick(song)}
                    >
                        <img src={song.cover} alt={song.title} />
                        <p>{song.title}</p>
                    </div>
                ))}
            </div>
            <ScrollToTop />
        </div>
    );
}

export default SongPage;