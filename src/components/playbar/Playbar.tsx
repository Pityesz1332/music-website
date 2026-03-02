import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, TimerReset, Repeat, Heart, Download } from "lucide-react";
import { useMusic } from "../../context/MusicContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";
import { formatTime } from "../../utils/formatTime";
import { useVolumeControl } from "../../hooks/audio/useVolumeControl";
import { useProgressBar } from "../../hooks/audio/useProgressBar";
import { useKeyboardControls } from "../../hooks/general/useKeyboardControls";
import { useAudioSync } from "../../hooks/audio/useAudioSync";
import { usePlaybarInteractions } from "../../hooks/audio/usePlaybarInteractions";
import { ProgressBar } from "./subcomponents/ProgressBar";
import { VolumeControl } from "./subcomponents/VolumeControl";
import { PLAYBAR_STRINGS } from "../../constant-strings/ui/playbar";
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
            <ProgressBar
                progressBarRef={progressBarRef}
                progress={progress}
                hoverTime={hoverTime}
                hoverPos={hoverPos}
                startSeek={startSeek}
                handleMouseMove={handleMouseMove}
                handleMouseLeave={handleMouseLeave}
            />

            <audio
                src={song.src}
                ref={audioRef}
                loop={isLooping}
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
                onEnded={onNext}
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
                        <VolumeControl 
                            volume={volume}
                            volumeWrapperRef={volumeWrapperRef}
                            handleVolumeDragStart={handleVolumeDragStart}
                            handleVolumeChanger={handleVolumeChanger}
                            adjustVolume={adjustVolume}
                        />

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
                                            notify(PLAYBAR_STRINGS.MESSAGES.DELETED, NotificationType.SUCCESS);
                                        } else {
                                            saveSong(song);
                                            notify(PLAYBAR_STRINGS.MESSAGES.SAVED, NotificationType.SUCCESS);
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