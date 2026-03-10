import { useMusic } from "../../../../context/MusicContext";
import { useNotification } from "../../../../context/NotificationContext";
import { useSongClick } from "../../../../hooks/music/useSongClick";
import { usePlaylistActions } from "../../../../hooks/music/usePlaylistActions";
import { usePlaylistScroll } from "../../../../hooks/ui/usePlaylistScroll";
import { PlaylistItem } from "./playlist-subcomponents/PlaylistItem";
import { PlaylistMenu } from "./playlist-subcomponents/PlaylistMenu";
import { SONG_PAGE_STRINGS } from "../../../../constant-strings/ui/songPage";

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
                    {playlist.map((song, index) => (
                        <PlaylistItem
                            key={song.id}
                            song={song}
                            index={index}
                            playlistLength={playlist.length}
                            isCurrent={song.id === currentSong?.id}
                            isEditing={editingSongId === song.id}
                            onSongClick={handleSongClick}
                            onContextMenu={handleContextMenu}
                            onMove={moveSong}
                            onCloseEdit={closeEditMode}
                            setItemRef={setItemRef}
                        />
                    ))}
                </div>
            </div>

            {/* card-on jobbklikk-re megjelenő menü */}
            <PlaylistMenu
                contextMenu={contextMenu}
                menuRef={menuRef}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </>
    );
};