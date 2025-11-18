import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import "../styles/Playbar.css";

function Playbar({ song, isPlaying, onPlayPause, onNext, onPrev, onClose }) {
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        setProgress(0);
        setCurrentTime(0);
    }, [song?.src]);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch((err) => {console.log(err)});
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    function handleTimeUpdate() {
        const audio = audioRef.current;
        if (!audio) return;

        setCurrentTime(audio.currentTime);
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(percent || 0);
    }

    function handleSeek(e) {
        const audio = audioRef.current;
        if (!audio || !isFinite(audio.duration)) return;

        const rect = e.target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;

        audio.currentTime = percent * audio.duration;
    }

    if (!song) return null;

    return (
        <div className="playbar">
            {/* Ez nem fog látszani */}
            <audio 
                src={song.src}
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setProgress(0)}
            />
            
            <div className="playbar-left">
                <img src={song.cover} alt={song.title} className="playbar-cover" />
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
                <span className="playbar-time">{formatTime(currentTime)}</span>
                
                <div className="playbar-progress" onClick={handleSeek}>
                    <div className="playbar-progress-filled" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="playbar-time">{song.duration}</span>
            </div>
        </div>
    );
}

function formatTime(seconds) {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${min}:${secs.toString().padStart(2, "0")}`;
}

export default Playbar;