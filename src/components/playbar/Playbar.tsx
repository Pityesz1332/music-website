import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useMusic } from "@context/MusicContext";
import { useAuth } from "@context/AuthContext";
import { useNotification } from "@context/NotificationContext";
import { useVolumeControl } from "@hooks/playback/useVolumeControl";
import { useProgressBar } from "@hooks/playback/useProgressBar";
import { useKeyboardControls } from "@hooks/general/useKeyboardControls";
import { useAudioSync } from "@hooks/playback/useAudioSync";
import { usePlaybarInteractions } from "@hooks/playback/usePlaybarInteractions";
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


    const { isManuallyCollapsed, handlePlaybarTap, isLooping, handleToggleLoop } = usePlaybarInteractions(playbarRef);
    
    const {
        progress, currentTime, hoverTime, hoverPos, progressBarRef,
        handleTimeUpdate, startSeek, handleMouseMove, handleMouseLeave, resetSong
    } = useProgressBar(audioRef);

    const { isLoading, handlePlay, handleLoadedMetadata, isPlaying, song } = useAudioSync(audioRef, resetSong);

    const {
        volume,
        handleVolumeChanger,
        adjustVolume,
        volumeWrapperRef,
        handleVolumeDragStart,
        updateVolume
    } = useVolumeControl(audioRef);
    
    const auth = useAuth();
    if (!auth) throw new Error("useAuth must be used within AuthProvider");
    const { isConnected } = auth;
    const {
        togglePlay: onPlayPause,
        nextSong: onNext,
        prevSong: onPrev,
        savedSongs,
        saveSong,
        removeSavedSong,
        isShuffle,
        handleToggleShuffle
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
    
    const isSaved = song ? savedSongs.some(s => s.id === song.id) : false;
    
    // Playbar state changes saved into variables
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
                onLoaded={handleLoadedMetadata}
                onPlayPause={onPlayPause}
                onNext={onNext}
            />
            
            {/* left side */}
            <SongDetails song={song} currentTime={currentTime} />

            {/* middle */}
            <PlaybackControls
                onPrev={onPrev}
                onNext={onNext}
                handlePlay={handlePlay}
                isLoading={isLoading}
                isPlaying={isPlaying}
            />

            {/* right side */}
            <TrackActions
                volume={volume}
                volumeWrapperRef={volumeWrapperRef}
                handleVolumeDragStart={handleVolumeDragStart}
                handleVolumeChanger={handleVolumeChanger}
                adjustVolume={adjustVolume}
                resetSong={resetSong}
                isLooping={isLooping}
                onToggleLoop={handleToggleLoop}
                isShuffle={isShuffle}
                onToggleShuffle={handleToggleShuffle}
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