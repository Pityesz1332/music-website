import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, TimerReset } from "lucide-react";
import "../styles/Playbar.css";

function Playbar({ song, isPlaying, onPlayPause, onNext, onPrev }) {
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current) return;

        setProgress(0);
        setCurrentTime(0);

        const audio = audioRef.current;

        function autoPlay() {
            if (isPlaying) {
                audioRef.current.play().catch(err => console.log(err));
            }
        }

        audio.addEventListener("loadeddata", autoPlay);

        return () => {
            audio.removeEventListener("loadeddata", autoPlay);
        };
    }, [song?.src]);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch((err) => {console.log(err)});
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        window.addEventListener("mousemove", moveSeek);
        window.addEventListener("mouseup", endSeek);

        return () => {
            window.removeEventListener("mousemove", moveSeek);
            window.removeEventListener("mouseup", endSeek);
        };
    }, [isSeeking]);

    useEffect(() => {
        window.addEventListener("mousemove", handleVolumeDragMove);
        window.addEventListener("mouseup", handleVolumeDragEnd);

        return () => {
            window.removeEventListener("mousemove", handleVolumeDragMove);
            window.removeEventListener("mouseup", handleVolumeDragEnd);
        };
    }, [isDragging]);

    function handlePlay() {
        if (isPlaying) {
            onPlayPause();
            return;
        }

        setIsLoading(true);
        onPlayPause();
    }

    function handleTimeUpdate() {
        if (isSeeking) return;

        const audio = audioRef.current;
        if (!audio) return;

        setCurrentTime(audio.currentTime);
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(percent || 0);
    }

    function startSeek(e) {
        if (!audioRef.current) return;

        setIsSeeking(true);
        handleSeekPosition(e);
    }

    function moveSeek(e) {
        if (!isSeeking) return;

        handleSeekPosition(e);
    }

    function endSeek() {
        if (!isSeeking) return;
        setIsSeeking(false);
    }

    function handleSeekPosition(e) {
        const audio = audioRef.current;
        const bar = document.querySelector(".playbar-progress");

        if (!audio || !bar) return;

        const rect = bar.getBoundingClientRect();
        const x = e.clientX -rect.left;
        const percent = Math.min(Math.max(x / rect.width, 0), 1);

        setProgress(percent * 100);
        audio.currentTime = percent * audio.duration;
    }

    function handleVolumeChanger(e) {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (audioRef.current) audioRef.current.volume = vol;
    }

    function updateVolumeFromEvent(e, rect) {
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        const vol = Math.min(Math.max(percent, 0), 1);

        setVolume(vol);
        if (audioRef.current) audioRef.current.volume = vol
    }

    function handleVolumeDragStart(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        setIsDragging(true);
        updateVolumeFromEvent(e, rect);
    }

    function handleVolumeDragMove(e) {
        if (!isDragging) return;

        const wrapper = document.querySelector(".volume-wrapper");
        if (!wrapper) return;

        const rect = wrapper.getBoundingClientRect();
        updateVolumeFromEvent(e, rect);
    }

    function handleVolumeDragEnd() {
        setIsDragging(false);
    }

    function handleResetSong() {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setProgress(0);
            setCurrentTime(0);
        }
    }

    if (!song) return null;

    return (
        <div className="playbar">
            <audio 
                src={song.src}
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setProgress(0)}
                onLoadedData={() => setIsLoading(false)}
                onPlay={() => setIsLoading(false)}
                onEnded={onNext}
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
                <button onClick={handlePlay}>{isLoading ? (
                    <div className="loading-spinner"></div>
                ) : isPlaying ? (
                    <Pause />
                ) : (
                    <Play />
                )}</button>
                <button onClick={onNext}>⏭</button>
            </div>

            <div className="playbar-right">
                <span className="playbar-time">{formatTime(currentTime)}</span>
                
                <div className="playbar-progress" onMouseDown={startSeek}>
                    <div className="playbar-progress-filled" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="playbar-time">{song.duration}</span>
            </div>

            <div className="playbar-extra">
                <div className="volume-wrapper" onMouseDown={handleVolumeDragStart}>
                    <div className="volume-track">
                        <div className="volume-fill" style={{ width: `${volume * 100}%` }}></div>
                        <div className="volume-thumb" style={{ left: `${volume * 100}%` }}></div>
                    </div>
                    <input
                        className="volume-hidden"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChanger}
                    />
                </div>
                <button className="reset-seeker" onClick={handleResetSong}>
                    <TimerReset />
                </button>
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