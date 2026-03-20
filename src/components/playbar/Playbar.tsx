import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { useVolumeControl } from "../../hooks/audio/useVolumeControl";
import { useProgressBar } from "../../hooks/audio/useProgressBar";
import { useKeyboardControls } from "../../hooks/general/useKeyboardControls";
import { useAudioSync } from "../../hooks/audio/useAudioSync";
import { usePlaybarInteractions } from "../../hooks/audio/usePlaybarInteractions";
import { ProgressBar } from "./progress-bar/ProgressBar";
import { SongDetails } from "./song-details/SongDetails";
import { PlaybackControls } from "./playback-controls/PlaybackControls";
import { TrackActions } from "./track-actions/TrackActions";
import { AudioElement } from "./audio-element/AudioElement";
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

            <AudioElement
                audioRef={audioRef}
                songSrc={song.src}
                isLooping={isLooping}
                isPlaying={isPlaying}
                onTimeUpdate={handleTimeUpdate}
                resetSong={resetSong}
                setIsLoading={setIsLoading}
                onPlayPause={onPlayPause}
                onNext={onNext}
            />
            
            {/* Bal oldal */}
            <SongDetails song={song} currentTime={currentTime} />

            {/* Közép */}
            <PlaybackControls
                onPrev={onPrev}
                onNext={onNext}
                handlePlay={handlePlay}
                isLoading={isLoading}
                isPlaying={isPlaying}
            />

            {/* Jobb oldal */}
            <TrackActions
                volume={volume}
                volumeWrapperRef={volumeWrapperRef}
                handleVolumeDragStart={handleVolumeDragStart}
                handleVolumeChanger={handleVolumeChanger}
                adjustVolume={adjustVolume}
                resetSong={resetSong}
                isLooping={isLooping}
                setIsLooping={setIsLooping}
                isConnected={isConnected}
                isSaved={isSaved}
                song={song}
                removeSavedSong={removeSavedSong}
                saveSong={saveSong}
                notify={notify}
            />
        </div>
    );
}

export default Playbar;