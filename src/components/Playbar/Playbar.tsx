import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, TimerReset, Repeat, Heart, Download } from "lucide-react";
import { useMusic } from "../../context/MusicContext";
import { useAuth } from "../../context/AuthContext";
import { useVolumeControl } from "../../hooks/Playbar_hooks/useVolumeControl";
import { useProgressBar } from "../../hooks/Playbar_hooks/useProgressBar";
import { useNotification, NotificationType } from "../../context/NotificationContext";
import "./Playbar.scss";

const Playbar = () => {
    const location = useLocation();
    const isSongPage = location.pathname.startsWith("/songs/");
    
    const playbarRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null!);
    const {
        volume,
        handleVolumeChanger,
        adjustVolume,
        volumeWrapperRef,
        handleVolumeDragStart,
        updateVolume
    } = useVolumeControl(audioRef);
    
    const {
        progress, currentTime, hoverTime, hoverPos, progressBarRef,
        handleTimeUpdate, startSeek, handleMouseMove, handleMouseLeave, resetSong
    } = useProgressBar(audioRef);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLooping, setIsLooping] = useState<boolean>(false);
    const [isManuallyCollapsed, setIsManuallyCollapsed] = useState<boolean>(true);

    const auth = useAuth();
    // ez biztonsági ellenőrzés magamnak
    if (!auth) throw new Error("useAuth must be used within AuthProvider");
    const { isConnected } = auth;
    const {
        currentSong: song,
        isPlaying,
        togglePlay: onPlayPause,
        nextSong: onNext,
        prevSong: onPrev,
        savedSongs,
        saveSong,
        removeSavedSong
    } = useMusic();
    const { notify } = useNotification();

    //megnézzük, hogy mentve van-e az adott zene
    const isSaved = song ? savedSongs.some(s => s.id === song.id) : false;

    // playbar állapotváltozásai változókba mentve
    const playbarBaseClass = "playbar";
    const playbarClasses = [
        playbarBaseClass,
        isSongPage ? `${playbarBaseClass}--expanded` : `${playbarBaseClass}--collapsed`,
        isManuallyCollapsed ? `${playbarBaseClass}--manually-collapsed` : ""
    ].filter(Boolean).join(" ");

    useEffect(() => {
        const handleGlobalWheel = (e: WheelEvent) => {
            const playbarElement = playbarRef.current;
            if (!playbarElement) return;

            const isOverPlaybar = playbarElement.contains(e.target as Node);

            if (isOverPlaybar) {
                e.preventDefault();
            }
        };

        window.addEventListener("wheel", handleGlobalWheel, { passive: false });
        
        return () => {
            window.removeEventListener("wheel", handleGlobalWheel);
        };
    }, []);

    // automatikus lejátszás
    useEffect(() => {
        if (!audioRef.current || !song) return;

        resetSong();

        const audio = audioRef.current;
        audio.load();

        function autoPlay() {
            if (isPlaying) {
                audio.play().catch(err => console.log(err));
            }
        }

        audio.addEventListener("canplay", autoPlay);

        return () => {
            audio.removeEventListener("canplay", autoPlay);
        };
    }, [song?.src]);

    // play-pause gomb logika
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying && audioRef.current.paused) {
            audioRef.current.play().catch((err) => { console.log(err) });
        } else if (!isPlaying && !audioRef.current.paused) {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // billenytyűzettel való playbarkezelés
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (!audioRef.current) return;
            const audio = audioRef.current;

            switch (e.code) {
                case "Space":
                    e.preventDefault();
                    handlePlay();
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    updateVolume(volume + 0.1);
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    updateVolume(volume - 0.1)
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    audio.currentTime = Math.max(audio.currentTime - 5, 0);
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPlaying, song, volume]);

    // indítja a playbar-on a zenét
    function handlePlay() {
        if (isPlaying) {
            onPlayPause();
            return;
        }

        setIsLoading(true);
        onPlayPause();
    }

    function handlePlaybarTap(e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as HTMLElement;
        const isButtonClick = target.closest("button") || target.closest("input") || target.closest(".playbar__volume-wrapper");

        if (!isButtonClick) {
            setIsManuallyCollapsed(!isManuallyCollapsed);
        }
    }

    if (!song) return null;

    return (
        <div ref={playbarRef} className={playbarClasses} onClick={handlePlaybarTap}>
            <div
                ref={progressBarRef}
                className="playbar__progress"
                onMouseDown={startSeek}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => e.stopPropagation()}
            >
                {hoverTime !== null && (
                    <div
                        className="playbar__tooltip"
                        style={{
                            left: `${hoverPos}px`,
                            position: "absolute",
                            bottom: "100%",
                            transform: "translateX(-50%)",
                            pointerEvents: "none"
                        }}
                    >
                        {formatTime(hoverTime)}
                    </div>
                )}
                <div className="playbar__progress-filled" style={{ width: `${progress}%` }}></div>
            </div>

            <audio
                src={song.src}
                ref={audioRef}
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={resetSong}
                onLoadedData={() => setIsLoading(false)}
                onPlay={() => {
                    setIsLoading(false);
                    if (!isPlaying) onPlayPause();
                }}
                onPause={() => {
                    if (isPlaying) onPlayPause();
                }}
                onEnded={() => {
                    if (isLooping && audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play();
                        return;
                    } else {
                        onNext();
                    }
                }}
            />
            
            {/* Bal oldal */}
            <div className="playbar__left">
                <img src={song.cover} alt={song.title} className="playbar__cover" />
                <div className="playbar__info">
                    <h4 className="playbar__title">{song.title}</h4>
                    <p className="playbar__artist">{song.artist}</p>
                </div>
                <div className="playbar__time-container">
                    <span className="playbar__time">{formatTime(currentTime)} / {song.duration}</span>
                </div>
            </div>

            {/* Közép */}
            <div className="playbar__controls">
                <button className="playbar__control-button" onClick={onPrev}>
                    <SkipBack size={24} />
                </button>
                <button className="playbar__control-button playbar__control-button--main" onClick={handlePlay}>
                    {isLoading ? (
                        <div className="playbar__loader"></div>
                    ) : isPlaying ? (
                        <Pause size={28} />
                    ) : (
                        <Play size={28} />
                    )}
                </button>
                <button className="playbar__control-button" onClick={onNext}>
                    <SkipForward size={24} />
                </button>
            </div>

            {/* Jobb oldal */}
            <div className="playbar__right-container">
                    <div className="playbar__extra">
                        <div
                            ref={volumeWrapperRef}
                            className="playbar__volume-wrapper"
                            onMouseDown={handleVolumeDragStart}
                            onWheel={(e) => {
                                if (e.deltaY !== 0) {
                                    const direction = e.deltaY > 0 ? 1 : -1;
                                    adjustVolume(direction);
                                }
                            }}
                        >
                            <div className="playbar__volume-track">
                                <div className="playbar__volume-fill" style={{ width: `${volume * 100}%` }}></div>
                                <div className="playbar__volume-thumb" style={{ left: `${volume * 100}%` }}></div>
                            </div>
                            <input
                                className="playbar__volume-hidden"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChanger}
                            />
                        </div>

                        <div className="playbar__extra-buttons">
                            <button className="playbar__reset-seeker" onClick={resetSong}>
                                <TimerReset size={20} />
                            </button>
                            <button className={`playbar__extra-button ${isLooping ? "playbar__extra-button--active" : ""}`} onClick={() => setIsLooping(!isLooping)}>
                                <Repeat size={20} />
                            </button>
                        </div>

                        {isConnected && (
                            <div className="playbar__connected-buttons">
                                <button
                                    className={`playbar__save-button ${isSaved ? "playbar__save-button--saved" : ""}`}  
                                    onClick={() => {
                                        if (isSaved) {
                                            removeSavedSong(song.id);
                                            notify("Deleted from Saved Songs", NotificationType.SUCCESS);
                                        } else {
                                            saveSong(song);
                                            notify("Saved", NotificationType.SUCCESS);
                                        }
                                    }}>
                                    <Heart size={20} />
                                </button>
                                <button className="playbar__download-button">
                                    <Download size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    );
}

// idő formázása
function formatTime(seconds: number) {
    if (seconds == null || isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${min}:${secs.toString().padStart(2, "0")}`;
}

export default Playbar;