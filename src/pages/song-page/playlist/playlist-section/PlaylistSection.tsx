import { useNavigate } from "react-router-dom";
import { useMusic } from "@context/MusicContext";
import { useNotification } from "@context/NotificationContext";
import { useSongClick } from "@hooks/music-control/useSongClick";
import { usePlaylistActions } from "@hooks/playlist/usePlaylistActions";
import { usePlaylistScroll } from "@hooks/ui/usePlaylistScroll";
import { SONG_PAGE_STRINGS } from "@i18n/ui/song-page";
import { Modal } from "@components/ui/modal/Modal";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { PlaylistItem } from "../playlist-item/PlaylistItem";
import { PlaylistMenu } from "../playlist-menu/PlaylistMenu";

export const PlaylistSection = () => {
    const { notify } = useNotification();
    const { currentSong, playlist, setPlaylist, nextSong } = useMusic();
    const { handleSongClick } = useSongClick();

    const {
        contextMenu, editingSongId, menuRef, handleContextMenu,
        handleEdit, closeEditMode, moveSong, openDeleteModal, confirmDelete,
        isDeleteModalOpen, setIsDeleteModalOpen, songToDelete
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

    const navigate = useNavigate();
    const  isPlaylistEmpty = playlist.length === 0;

    return (
        <>
            <div className="song-page__playlist-wrapper">
                <h2 className="song-page__playlist-title">{SONG_PAGE_STRINGS.PLAYLIST.TITLE}</h2>
                <div className="song-page__playlist" ref={playlistRef}>
                    {isPlaylistEmpty ? (
                        <div className="playlist__empty-state">
                            <p>{SONG_PAGE_STRINGS.PLAYLIST.EMPTY_MESSAGE}</p>
                            <PrimaryButton
                                className="empty-state__btn"
                                onClick={() => navigate(MainRoutes.SONGS)}
                            >
                                {SONG_PAGE_STRINGS.PLAYLIST.EMPTY_BTN}
                            </PrimaryButton>
                        </div>
                    ) : (
                        playlist.map((song, index) => (
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
                        ))
                    )}
                </div>
            </div>

            {/* card-on jobbklikk-re megjelenő menü */}
            {!isPlaylistEmpty && (
                <PlaylistMenu
                    contextMenu={contextMenu}
                    menuRef={menuRef}
                    onEdit={handleEdit}
                    onDelete={openDeleteModal}
                />
            )}

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title={SONG_PAGE_STRINGS.MODAL.DELETE_TITLE}
                description={SONG_PAGE_STRINGS.MODAL.DELETE_DESCRIPTION(songToDelete?.title || "")}
                buttons={
                    <div className="song-page__modal-actions">
                        <PrimaryButton
                            className="cancel-btn"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            {SONG_PAGE_STRINGS.MODAL.CANCEL}
                        </PrimaryButton>
                        <PrimaryButton
                            className="confirm-btn"
                            onClick={confirmDelete}
                        >
                            {SONG_PAGE_STRINGS.MODAL.CONFIRM}
                        </PrimaryButton>
                    </div>
                }
            />
        </>
    );
};