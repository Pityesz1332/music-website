import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, TimerReset, Repeat, FileMusic, ChevronDown, ChevronUp, Download } from "lucide-react";
import { useMusic } from "../../context/MusicContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import "./Playbar.scss";
import type { Song } from "../../types/music";

interface PlaybarProps {
    song: Song | null;
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const Playbar = ({ song, isPlaying, onPlayPause, onNext, onPrev }: PlaybarProps) => {
    const location = useLocation();
    const isSongPage = location.pathname.startsWith("/songs/");
    
    const [progress, setProgress] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [volume, setVolume] = useState<number>(1);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLooping, setIsLooping] = useState<boolean>(false);
    const [isManuallyCollapsed, setIsManuallyCollapsed] = useState<boolean>(false);
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverPos, setHoverPos] = useState<number>(0);

    const auth = useAuth();
    if (!auth) throw new Error("useAuth must be used within AuthProvider");
    const { isConnected } = auth;
    const { savedSongs, saveSong, removeSavedSong } = useMusic();
    const { notify } = useNotification();

    const isSaved = song ? savedSongs.some(s => s.id === song.id) : false;
    
    const audioRef = useRef<HTMLAudioElement>(null);
    //const progressBarRef = useRef<HTMLDivElement>(null);
    //const volumeWrapperRef = useRef<HTMLDivElement>(null);

    const playbarBaseClass = "playbar";
    const playbarClasses = [
        playbarBaseClass,
        isSongPage ? `${playbarBaseClass}--expanded` : `${playbarBaseClass}--collapsed`,
        isManuallyCollapsed ? `${playbarBaseClass}--manually-collapsed` : ""
    ].filter(Boolean).join(" ");

    useEffect(() => {
        if (!audioRef.current || !song) return;

        setProgress(0);
        setCurrentTime(0);

        const audio = audioRef.current;

        function autoPlay() {
            if (isPlaying) {
                audio.play().catch(err => console.log(err));
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
                    setVolume(prev => {
                        const newVol = Math.min(prev + 0.1, 1);
                        audio.volume = newVol;
                        return newVol;
                    });
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    setVolume(prev => {
                        const newVol = Math.max(prev - 0.1, 0);
                        audio.volume = newVol;
                        return newVol;
                    });
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

        console.log("key pressed");
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPlaying, song]);

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

    function startSeek(e: React.MouseEvent<HTMLDivElement>) {
        if (!audioRef.current) return;
        setIsSeeking(true);
        handleSeekPosition(e);
    }

    function moveSeek(e: globalThis.MouseEvent) {
        if (!isSeeking) return;
        handleSeekPosition(e);
    }

    function endSeek() {
        if (!isSeeking) return;
        setIsSeeking(false);
    }

    function handleSeekPosition(e: { clientX: number }) {
        const audio = audioRef.current;
        const bar = document.querySelector<HTMLDivElement>(".playbar__progress");

        if (!audio || !bar) return;

        const rect = bar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.min(Math.max(x / rect.width, 0), 1);

        setProgress(percent * 100);
        audio.currentTime = percent * audio.duration;
    }

    function handleMouseMove (e: React.MouseEvent<HTMLDivElement>) {
        const audio = audioRef.current;
        if (!audio) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.min(Math.max(x / rect.width, 0), 1);

        setHoverTime(percent * audio.duration);
        setHoverPos(x);
    }

    function handleMouseLeave() {
        setHoverTime(null);
    }

    function handleVolumeChanger(e: React.ChangeEvent<HTMLInputElement>) {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (audioRef.current) audioRef.current.volume = vol;
    }

    function updateVolumeFromEvent(e: {clientX: number}, rect: DOMRect) {
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        const vol = Math.min(Math.max(percent, 0), 1);

        setVolume(vol);
        if (audioRef.current) audioRef.current.volume = vol
    }

    function handleVolumeDragStart(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        setIsDragging(true);
        updateVolumeFromEvent(e, rect);
    }

    function handleVolumeDragMove(e: globalThis.MouseEvent) {
        if (!isDragging) return;

        const wrapper = document.querySelector<HTMLDivElement>(".playbar__volume-wrapper");
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
        <div className={playbarClasses}>
            <button className="playbar__collapse-toggle" onClick={() => setIsManuallyCollapsed(!isManuallyCollapsed)}>
                {isManuallyCollapsed ? <ChevronUp size={24}/> : <ChevronDown size={24} />}
            </button>

            <audio
                src={song.src}
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setProgress(0)}
                onLoadedData={() => setIsLoading(false)}
                onPlay={() => setIsLoading(false)}
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
            
            <div className="playbar__left">
                <img src={song.cover} alt={song.title} className="playbar__cover" />
                <div className="playbar__info">
                    <h4 className="playbar__title">{song.title}</h4>
                    <p className="playbar__artist">{song.artist}</p>
                </div>
            </div>

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

            <div className="playbar__right">
                <span className="playbar__time">{formatTime(currentTime)}</span>
                
                <div
                    className="playbar__progress"
                    onMouseDown={startSeek}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ position: "relative" }}
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
                <span className="playbar__time">{song.duration}</span>
            </div>

            <div className="playbar__extra">
                <div className="playbar__volume-wrapper" onMouseDown={handleVolumeDragStart}>
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
                    <button className="playbar__reset-seeker" onClick={handleResetSong}>
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
                                    notify("Deleted from Saved Songs", "success");
                                } else {
                                    saveSong(song);
                                    notify("Saved", "success");
                                }
                            }}>
                            <FileMusic size={20} />
                        </button>
                        <button className="playbar__download-button">
                            <Download size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function formatTime(seconds: number) {
    if (seconds == null || isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${min}:${secs.toString().padStart(2, "0")}`;
}

export default Playbar;