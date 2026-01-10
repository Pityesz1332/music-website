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

        const activeCard = playlistRef.current.querySelector<HTMLDivElement>(`.song-page__mini-card--active`);
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
                <p className="song-page__not-found">Song not found</p>
            </div>
        );
    }

    return (
        <div className="song-page">
                <video
                    className={`song-page__video ${isPlaying ? "song-page__video--fade-out" : "song-page__video--fade-in"}`}
                    src={currentSong.defaultBgVideo}
                    autoPlay loop muted
                    key={`default-${currentSong.id}`}
                ></video>

                <video
                    className={`song-page__video ${isPlaying ? "song-page__video--fade-in" : "song-page__video--fade-out"}`}
                    src={currentSong.playingBgVideo}
                    autoPlay loop muted
                    key={`playing-${currentSong.id}`}
                ></video>
        
            <div className="song-page__content">
                <div className="song-page__cover-wrapper">
                    <img src={currentSong.cover} alt={currentSong.title} className="song-page__main-cover" />
                    <div className={`song-page__glow ${isPlaying ? "song-page__glow--active" : ""}`}></div>
                </div>

                <div className="song-page__info song-page__info--glass">
                    <h1 className="song-page__title">{currentSong.title}</h1>
                    <h2 className="song-page__artist">{currentSong.artist}</h2>
                    <p className="song-page__meta">Genre: <span className="song-page__meta-value">{currentSong.genre}</span></p>
                    <p className="song-page__meta">Duration: <span className="song-page__meta-value">{currentSong.duration}</span></p>

                    <div className="song-page__controls">
                        <button className="song-page__nav-button" onClick={prevSong}>⏮ Prev</button>
                        
                        <button
                            className={`song-page__play-button song-page__play-button--neon-button ${isPlaying ? "song-page__play-button--playing" : ""}`}
                            onClick={togglePlay}
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                            {isPlaying ? "Stop" : "Play"}
                        </button>

                        <button className="song-page__nav-button" onClick={nextSong}>Next ⏭</button>
                    </div>

                        {isConnected && (
                            <div className="song-page__actions">
                                <button
                                    className={`song-page__action-button ${isSaved ? "song-page__action-button--saved" : ""}`}
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
                                    <FileMusic className="song-page__action-button__icon" size={24} />
                                </button>

                                <button className="song-page__action-button">
                                    <Download className="song-page__action-button__icon" size={24} />
                                </button>
                            </div>
                        )}
                </div>
            </div>

            <div className="song-page__playlist" ref={playlistRef}>
                {playlist.map((song) => (
                    <div
                        key={song.id}
                        className={`song-page__mini-card ${song.id === currentSong.id ? "song-page__mini-card--active" : ""}`}
                        onClick={() => handleSongClick(song)}
                    >
                        <img className="song-page__card-image" src={song.cover} alt={song.title} />
                        <p className="song-page__card-title">{song.title}</p>
                    </div>
                ))}
            </div>
            <ScrollToTop />
        </div>
    );
}