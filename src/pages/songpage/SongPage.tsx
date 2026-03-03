import { Play, Pause, Heart, Download, Pencil, Trash2, ChevronUp, ChevronDown, X, SkipBack, SkipForward } from "lucide-react";
import { useMusic } from "../../context/MusicContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { usePlaylistActions } from "../../hooks/music/usePlaylistActions";
import { usePlaylistScroll } from "../../hooks/ui/usePlaylistScroll";
import { useSongInit } from "../../hooks/audio/useSongInit";
import { useSongClick } from "../../hooks/music/useSongClick";
import { ScrollToTop } from "../../components/scroll-to-top/ScrollToTop";
import { useToggleSave } from "../../hooks/music/useToggleSave";
import { SONG_PAGE_STRINGS } from "../../constant-strings/ui/songPage";
import { Button } from "../../components/ui/button/Button";
import "./SongPage.scss";

export const SongPage = () => {
    const auth = useAuth();
    const { notify } = useNotification();

    const isConnected = auth?.isConnected;

    const {
        currentSong, isPlaying, playlist,
        togglePlay, setPlaylist, nextSong, prevSong,
        savedSongs,
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

    const { toggleSave } = useToggleSave();
    
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
                <p className="song-page__not-found">{SONG_PAGE_STRINGS.ERROR.NOT_FOUND}</p>
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
                    <p className="song-page__meta">{SONG_PAGE_STRINGS.INFO.GENRE} <span className="song-page__meta-value">{currentSong.genre}</span></p>
                    <p className="song-page__meta">{SONG_PAGE_STRINGS.INFO.DURATION} <span className="song-page__meta-value">{currentSong.duration}</span></p>

                    <div className="song-page__controls">
                        <Button 
                            className="song-page__nav-button" 
                            onClick={prevSong}>
                            <SkipBack size={20} />
                        </Button>
                        
                        <Button
                            className={`song-page__play-button song-page__play-button--neon-button ${isPlaying ? "song-page__play-button--playing" : ""}`}
                            onClick={togglePlay}
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                            {isPlaying ? SONG_PAGE_STRINGS.CONTROLS.STOP : SONG_PAGE_STRINGS.CONTROLS.PLAY}
                        </Button>

                        <Button className="song-page__nav-button" onClick={nextSong}>
                            <SkipForward size={20} />
                        </Button>
                    </div>

                        {/* mentés és letöltés, csak a bejelentkezett user-eknek */}
                        {isConnected && (
                            <div className="song-page__actions">
                                <Button
                                    className={`song-page__action-button ${isSaved ? "song-page__action-button--saved" : ""}`}
                                    onClick={() => toggleSave(currentSong)}
                                >
                                    <Heart className="song-page__action-button__icon" size={24} />
                                </Button>

                                <Button className="song-page__action-button">
                                    <Download className="song-page__action-button__icon" size={24} />
                                </Button>
                            </div>
                        )}
                </div>
            </div>

            <div className="song-page__playlist-wrapper">
                <h2 className="song-page__playlist-title">{SONG_PAGE_STRINGS.PLAYLIST.TITLE}</h2>
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
                                        <Button
                                            className={`song-page__card-action-btn ${isSongSaved ? "song-page__card-action-btn--saved" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSave(song);
                                            }}
                                        >
                                            <Heart size={16} />
                                        </Button>
                                        <Button
                                            className="song-page__card-action-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <Download size={16} />
                                        </Button>
                                    </div>
                                )}
                            
                                {/* zenék mozgatása a playlist-en */}
                                {editingSongId === song.id && (
                                    <div className="song-page__edit-controls">
                                        <Button
                                            disabled={playlist.findIndex(s => s.id === song.id) === 0}
                                            onClick={(e) => moveSong(e, "up", song.id)}
                                            className="song-page__move-btn"
                                        >
                                            <ChevronUp size={16} />
                                        </Button>
                                        <Button onClick={(e) => closeEditMode(e)}><X size={16} /></Button>
                                        <Button
                                            disabled={playlist.findIndex(s => s.id === song.id) === playlist.length - 1}
                                            onClick={(e) => moveSong(e, "down", song.id)}
                                            className="song-page__move-btn"
                                        >
                                            <ChevronDown size={16} />
                                        </Button>
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
                    <Button onClick={() => handleEdit(contextMenu.songId)} className="menu-item edit">
                        <Pencil size={16} />
                        <span>{SONG_PAGE_STRINGS.CONTEXT_MENU.EDIT}</span>
                    </Button>
                    <div className="menu-divider"></div>
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contextMenu.songId);
                    }}
                        className="menu-item delete"
                    >
                        <Trash2 size={16} />
                        <span>{SONG_PAGE_STRINGS.CONTEXT_MENU.DELETE}</span>
                    </Button>
                </div>
            )}

            {/* mindig az oldal tetejére dob */}
            <ScrollToTop />
        </div>
    );
};