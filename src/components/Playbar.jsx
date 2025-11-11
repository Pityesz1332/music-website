import React from "react";
import { Play, Pause, ArrowLeft } from "lucide-react";
import "../styles/Playbar.css";

function Playbar({ song, isPlaying, onPlayPause, onNext, onPrev, onClose }) {
    if (!song) return null;

    return (
        <div className="playbar">
            <div className="playbar-left">
                <img src={song.image} alt={song.title} className="playbar-cover" />
                <div className="playbar-info">
                    <h4>{song.title}</h4>
                    <p>{song.artist}</p>
                </div>
            </div>

            <div className="playbar-controls">
                <button onClick={onPrev}>⏮</button>
                <button onClick={onPlayPause}>{isPlaying ? <Pause /> : <Play />}</button>
                <button onClick={onNext}>⏭</button>
            </div>

            <div className="playbar-right">
                <span className="playbar-time">0:00</span>
                <div className="playbar-progress">
                    <div className="playbar-progress-filled" style={{ width: "30%" }}></div>
                </div>
                <span className="playbar-time">{song.duration}</span>
            </div>
        </div>
    );
}

export default Playbar;