import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, TimerReset, Repeat, Heart, Download } from "lucide-react";
import { useMusic } from "../../context/MusicContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";
import { formatTime } from "../../utils/formatTime";
import { useVolumeControl } from "../../hooks/useVolumeControl";
import { useProgressBar } from "../../hooks/useProgressBar";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import { useAudioSync } from "../../hooks/useAudioSync";
import { usePlaybarInteractions } from "../../hooks/usePlaybarInteractions";
import "./Playbar.scss";

const Playbar = () => {
    const location = useLocation();
    const isSongPage = location.pathname.startsWith("/songs/");
    
    const playbarRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null!);

    const [isLooping, setIsLooping] = useState<boolean>(false);

    const { isManuallyCollapsed, handlePlaybarTap } = usePlaybarInteractions(playbarRef);
    
    const {
        progress, currentTime, hoverTime, hoverPos, progressBarRef,
        handleTimeUpdate, startSeek, handleMouseMove, handleMouseLeave, resetSong
    } = useProgressBar(audioRef);

    const { isLoading, setIsLoading, handlePlay, isPlaying, song } = useAudioSync(audioRef, resetSong);

    const {
        volume,
        handleVolumeChanger,
        adjustVolume,
        volumeWrapperRef,
        handleVolumeDragStart,
        updateVolume
    } = useVolumeControl(audioRef);
    
    const auth = useAuth();
    // ez biztonsági ellenőrzés magamnak
    if (!auth) throw new Error("useAuth must be used within AuthProvider");
    const { isConnected } = auth;
    const {
        togglePlay: onPlayPause,
        nextSong: onNext,
        prevSong: onPrev,
        savedSongs,
        saveSong,
        removeSavedSong
    } = useMusic();
    
    useKeyboardControls({
        audioRef,
        isPlaying,
        volume,
        updateVolume,
        handlePlay,
        songExist: !!song
    });

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

export default Playbar;