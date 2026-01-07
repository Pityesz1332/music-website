import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Play, Pause, FileMusic, Download } from "lucide-react";
import { useMusic } from "../../context/MusicContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import ScrollToTop from "../../components/Scroll_to_top/ScrollToTop";
import songsData from "../../data/songs.json";
import "./SongPage.scss";
import type { Song } from "../../types/music";

//type LocationState = {
//    playlist?: Song[];
//};

export const SongPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams<{ id: string }>();
    const playlistRef = useRef<HTMLDivElement | null>(null);

    const {
        currentSong,
        isPlaying,
        playlist,
        playSong,
        togglePlay,
        setPlaylist,
        nextSong,
        prevSong,
        savedSongs,
        saveSong,
        removeSavedSong
    } = useMusic();

    const auth = useAuth();
    const { notify } = useNotification();
    const isConnected = auth?.isConnected;

    const isSaved = currentSong ? savedSongs.some(s => s.id === currentSong.id) : false;

    useEffect(() => {
        if (state?.playlist) {
            setPlaylist(state.playlist);
        } else if (playlist.length === 0) {
            setPlaylist(songsData as Song[]);
        }
    }, [state?.playlist, playlist.length, setPlaylist]);
    
    useEffect(() => {
        if (!currentSong || !playlistRef.current) return;

        const activeCard = playlistRef.current.querySelector<HTMLDivElement>(`.mini-card.active`);
        if (!activeCard) return;


        const container = playlistRef.current;
        const containerStyles = window.getComputedStyle(container);
        const flexDirection = containerStyles.flexDirection;

        const containerRect = container.getBoundingClientRect();
        const cardRect = activeCard.getBoundingClientRect();

        if (flexDirection === "row") {
            const scrollLeft = activeCard.offsetLeft - containerRect.width / 2 + cardRect.width / 2;

            container.scrollTo({ left: scrollLeft, behavior: "smooth" });
        } else {
            const scrollTop = activeCard.offsetTop - (containerRect.height / 2) + (cardRect.height / 2);

            container.scrollTo({
                top: scrollTop,
                behavior: "smooth",
            });
        }
    }, [currentSong]);

    function handleSongClick(song: Song) {
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

                        {isConnected && (
                            <div className="songpage-btn-wrapper">
                                <button
                                    className={`songpage-action-btn ${isSaved ? "saved" : ""}`}
                                    onClick={() => {
                                        if (isSaved) {
                                            removeSavedSong(currentSong.id);
                                            notify("Deleted from saved songs", "success");
                                        } else {
                                            saveSong(currentSong);
                                            notify("Saved", "success");
                                        }
                                    }}
                                >
                                    <FileMusic size={24} />
                                </button>

                                <button className="songpage-action-btn">
                                    <Download size={24} />
                                </button>
                            </div>
                        )}
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