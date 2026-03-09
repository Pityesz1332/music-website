import { Pencil, Trash2, ChevronUp, ChevronDown, X } from "lucide-react";
import { useMusic } from "../../../context/MusicContext";
import { useNotification } from "../../../context/NotificationContext";
import { useSongClick } from "../../../hooks/music/useSongClick";
import { usePlaylistActions } from "../../../hooks/music/usePlaylistActions";
import { usePlaylistScroll } from "../../../hooks/ui/usePlaylistScroll";
import { SongActions } from "./SongActions";
import { PrimaryButton } from "../../../components/ui/button/PrimaryButton";
import { SONG_PAGE_STRINGS } from "../../../constant-strings/ui/songPage";

export const PlaylistSection = () => {
    const { notify } = useNotification();
    const { currentSong, playlist, setPlaylist, nextSong } = useMusic();
    const { handleSongClick } = useSongClick();

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

    return (
        <>
            <div className="song-page__playlist-wrapper">
                <h2 className="song-page__playlist-title">{SONG_PAGE_STRINGS.PLAYLIST.TITLE}</h2>
                <div className="song-page__playlist" ref={playlistRef}>
                    {playlist.map((song) => (
                        <div
                            key={song.id}
                            ref={(el) => setItemRef(song.id, el)}
                            className={`song-page__mini-card ${song.id === currentSong?.id ? "song-page__mini-card--active" : ""}`}
                            onClick={() => handleSongClick(song)}
                            onContextMenu={(e) => handleContextMenu(e, song.id)}
                        >
                            <img className="song-page__card-image" src={song.cover} alt={song.title} />
                            <div className="song-page__card-info">
                                <p className="song-page__card-title">{song.title}</p>
                            </div>

                            <SongActions song={song} isMini={true} />
                        
                            {/* zenék mozgatása a playlist-en */}
                            {editingSongId === song.id && (
                                <div className="song-page__edit-controls">
                                    <PrimaryButton
                                        disabled={playlist.findIndex(s => s.id === song.id) === 0}
                                        onClick={(e) => moveSong(e, "up", song.id)}
                                        className="song-page__move-btn"
                                    >
                                        <ChevronUp size={16} />
                                    </PrimaryButton>
                                    <PrimaryButton onClick={(e) => closeEditMode(e)}><X size={16} /></PrimaryButton>
                                    <PrimaryButton
                                        disabled={playlist.findIndex(s => s.id === song.id) === playlist.length - 1}
                                        onClick={(e) => moveSong(e, "down", song.id)}
                                        className="song-page__move-btn"
                                    >
                                        <ChevronDown size={16} />
                                    </PrimaryButton>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* card-on jobbklikk-re megjelenő menü */}
            {contextMenu && (
                <div
                    className="song-page__context-menu"
                    ref={menuRef}
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <PrimaryButton onClick={() => handleEdit(contextMenu.songId)} className="menu-item edit">
                        <Pencil size={16} />
                        <span>{SONG_PAGE_STRINGS.CONTEXT_MENU.EDIT}</span>
                    </PrimaryButton>
                    <div className="menu-divider"></div>
                    <PrimaryButton onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contextMenu.songId);
                    }}
                        className="menu-item delete"
                    >
                        <Trash2 size={16} />
                        <span>{SONG_PAGE_STRINGS.CONTEXT_MENU.DELETE}</span>
                    </PrimaryButton>
                </div>
            )}
        </>
    );
};