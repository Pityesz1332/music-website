import { Play, Pause, Heart, Download, Pencil, Trash2, ChevronUp, ChevronDown, X, SkipBack, SkipForward } from "lucide-react";
import { useMusic } from "../../context/MusicContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";
import { usePlaylistActions } from "../../hooks/SongPage_hooks/usePlaylistActions";
import { usePlaylistScroll } from "../../hooks/SongPage_hooks/usePlaylistScroll";
import { useSongInit } from "../../hooks/SongPage_hooks/useSongInit";
import { useSongClick } from "../../hooks/SongPage_hooks/useSongClick";
import ScrollToTop from "../../components/Scroll_to_top/ScrollToTop";
import "./SongPage.scss";

//type LocationState = {
//    playlist?: Song[];
//};

export const SongPage = () => {
    const auth = useAuth();
    const { notify } = useNotification();

    const isConnected = auth?.isConnected;

    const {
        currentSong, isPlaying, playlist,
        togglePlay, setPlaylist, nextSong, prevSong,
        savedSongs, saveSong, removeSavedSong
    } = useMusic();

    const { handleSongClick } = useSongClick();
    useSongInit({ playlist, setPlaylist });

    const {
        contextMenu, editingSongId, menuRef, handleContextMenu,
        handleEdit, closeEditMode, moveSong, handleDelete
    } = usePlaylistActions({
        playlist,
        setPlaylist,
        currentSong,
        nextSong,
        notify
    });
    
    const { playlistRef, setItemRef } = usePlaylistScroll({
        currentSong,
        playlist,
        editingSongId
    });

    // nézi, hogy az adott zene mentve van-e
    const isSaved = currentSong ? savedSongs.some(s => s.id === currentSong.id) : false;

    // hibakezelés, ha nem találjuk az adott zenét
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
                        <button className="song-page__nav-button" onClick={prevSong}>
                            <SkipBack size={20} />
                        </button>
                        
                        <button
                            className={`song-page__play-button song-page__play-button--neon-button ${isPlaying ? "song-page__play-button--playing" : ""}`}
                            onClick={togglePlay}
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                            {isPlaying ? "STOP" : "PLAY"}
                        </button>

                        <button className="song-page__nav-button" onClick={nextSong}>
                            <SkipForward size={20} />
                        </button>
                    </div>

                        {/* mentés és letöltés, csak a bejelentkezett user-eknek */}
                        {isConnected && (
                            <div className="song-page__actions">
                                <button
                                    className={`song-page__action-button ${isSaved ? "song-page__action-button--saved" : ""}`}
                                    onClick={() => {
                                        if (isSaved) {
                                            removeSavedSong(currentSong.id);
                                            notify("Deleted from saved songs", NotificationType.SUCCESS);
                                        } else {
                                            saveSong(currentSong);
                                            notify("Saved", NotificationType.SUCCESS);
                                        }
                                    }}
                                >
                                    <Heart className="song-page__action-button__icon" size={24} />
                                </button>

                                <button className="song-page__action-button">
                                    <Download className="song-page__action-button__icon" size={24} />
                                </button>
                            </div>
                        )}
                </div>
            </div>

            <div className="song-page__playlist-wrapper">
                <h2 className="song-page__playlist-title">Following up songs</h2>
                <div className="song-page__playlist" ref={playlistRef}>
                    {playlist.map((song) => {
                        const isSongSaved = savedSongs.some(s => s.id === song.id);

                        return (
                            <div
                                key={song.id}
                                ref={(el) => setItemRef(song.id, el)}
                                className={`song-page__mini-card ${song.id === currentSong.id ? "song-page__mini-card--active" : ""}`}
                                onClick={() => handleSongClick(song)}
                                onContextMenu={(e) => handleContextMenu(e, song.id)}
                            >
                                <img className="song-page__card-image" src={song.cover} alt={song.title} />
                                <div className="song-page__card-info">
                                    <p className="song-page__card-title">{song.title}</p>
                                </div>

                                {/* playlist gombok csak bejelentkezett user-eknek */}
                                {isConnected && (
                                    <div className="song-page__card-actions">
                                        <button
                                            className={`song-page__card-action-btn ${isSongSaved ? "song-page__card-action-btn--saved" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isSongSaved) {
                                                    removeSavedSong(song.id);
                                                    notify("Deleted from saved songs", NotificationType.SUCCESS);
                                                } else {
                                                    saveSong(song);
                                                    notify("Saved", NotificationType.SUCCESS);
                                                }
                                            }}
                                        >
                                            <Heart size={16} />
                                        </button>
                                        <button
                                            className="song-page__card-action-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                )}
                            
                                {/* zenék mozgatása a playlist-en */}
                                {editingSongId === song.id && (
                                    <div className="song-page__edit-controls">
                                        <button
                                            disabled={playlist.findIndex(s => s.id === song.id) === 0}
                                            onClick={(e) => moveSong(e, "up", song.id)}
                                            className="song-page__move-btn"
                                        >
                                            <ChevronUp size={16} />
                                        </button>
                                        <button onClick={(e) => closeEditMode(e)}><X size={16} /></button>
                                        <button
                                            disabled={playlist.findIndex(s => s.id === song.id) === playlist.length - 1}
                                            onClick={(e) => moveSong(e, "down", song.id)}
                                            className="song-page__move-btn"
                                        >
                                            <ChevronDown size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            );
                        })}
                    </div>
            </div>

            {/* card-on jobbklikk-re megjelenő menü */}
            {contextMenu && (
                <div
                    className="song-page__context-menu"
                    ref={menuRef}
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button onClick={() => handleEdit(contextMenu.songId)} className="menu-item edit">
                        <Pencil size={16} />
                        <span>Edit</span>
                    </button>
                    <div className="menu-divider"></div>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contextMenu.songId);
                    }}
                        className="menu-item delete"
                    >
                        <Trash2 size={16} />
                        <span>Delete</span>
                    </button>
                </div>
            )}

            {/* mindig az oldal tetejére dob */}
            <ScrollToTop />
        </div>
    );
}