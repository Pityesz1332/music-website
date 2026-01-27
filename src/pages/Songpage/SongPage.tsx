import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Play, Pause, FileMusic, Download, Pencil, Trash2, ChevronUp, ChevronDown, X, SkipBack, SkipForward } from "lucide-react";
import { useMusic } from "../../context/MusicContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";
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
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, songId: string} | null>(null);
    const [editingSongId, setEditingSongId] = useState<string | null>(null);
    const playlistRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    
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

    // nézi, hogy az adott zene mentve van-e
    const isSaved = currentSong ? savedSongs.some(s => s.id === currentSong.id) : false;

    // csak az első betöltéskor állítja be a playlist-et
    const isInitialMount = useRef<boolean>(true);
    
    // megakadályozza a későbbi felülírást állapotváltozáskor
    useEffect(() => {
        if (isInitialMount.current) {
            if (state?.playlist) {
                setPlaylist(state.playlist);
            } else if (playlist.length === 0) {
                setPlaylist(songsData as Song[]);
            }
            isInitialMount.current = false;
        }
    }, [state?.playlist, setPlaylist]);
    
    // ez a useEffect, azért felelős, hogy az adott dalhoz scroll-ozzon
    // automatikusan. lejátszásnál és szerkesztésnél is működik (playlist rendezése)
    useEffect(() => {
        if (!playlistRef.current || (!currentSong && !editingSongId)) return;

        const targetSelector = editingSongId
            ? `.song-page__mini-card:has(.song-page__edit-controls)`
            : `.song-page__mini-card--active`;

        const activeCard = playlistRef.current.querySelector<HTMLDivElement>(targetSelector);
        
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
    }, [currentSong, playlist, editingSongId]);

    // bezárja a jobbklikkes módot (a playlist-en), ha a mezőn kívülre kattintunk
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setContextMenu(null);
            }
        };

        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    // nem a böngésző alapértelmezett menüjét nyitja jobbklikkre, hanem a miénket
    const handleContextMenu = (e: React.MouseEvent, songId: string) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            songId: songId
        });
    };

    // belépés a szerkesztési módba
    const handleEdit = (songId: string) => {
        console.log("Editing mode:", songId);
        setEditingSongId(songId);
        setContextMenu(null);
    };

    // kilépés a szerkesztési módból
    const closeEditMode = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingSongId(null);
    };

    // zenék áthelyezése
    const moveSong = (e: React.MouseEvent, direction: "up" | "down", songId: string) => {
        console.log(`Move ${songId} ${direction}`);
        e.stopPropagation();

        // megnézzük az adott zenét
        const currentIndex = playlist.findIndex((s) => s.id === songId);
        
        // ha az első/utolsó zenénél vagyunk, 
        // nem enged tovább fölfelé/lefelé menni
        if (currentIndex === -1) return;
        const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex >= playlist.length) return;
        const newPlaylist = [...playlist];
        
        [newPlaylist[currentIndex], newPlaylist[newIndex]] = [newPlaylist[newIndex], newPlaylist[currentIndex]];
        setPlaylist(newPlaylist);
    }

    // törli a zenét az adott session-ből
    const handleDelete = (songId: string) => {
        console.log("Delete:", songId);

        const songToDelete = playlist.find(s => s.id === songId);
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${songToDelete?.title} from the playlist?`
        );

        if (confirmDelete) {
            const newPlaylist = playlist.filter(s => s.id !== songId);
            setPlaylist(newPlaylist);
            notify("Song deleted from playlist", NotificationType.SUCCESS);

            if (currentSong?.id === songId && newPlaylist.length > 0) {
                nextSong();
            }
        }

        setContextMenu(null);
    }

    // zenelejátszás
    function handleSongClick(song: Song) {
        playSong(song);
        navigate(`/songs/${song.id}`, { state: {playlist} });
    }

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
                                    <FileMusic className="song-page__action-button__icon" size={24} />
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
                                            <FileMusic size={16} />
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