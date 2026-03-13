import { PlusCircle, X, UploadIcon} from "lucide-react";
import { UploadSong } from "../../../components/admin/upload-song/UploadSong";
import { useSongManager } from "../../../hooks/admin/useSongManager";
import { SongItem } from "./_components/SongItem";
import { ADMIN_MANAGE_SONGS_STRINGS } from "../../../i18n/ui/admin/manage-songs";
import { PrimaryButton } from "../../../components/ui/button/PrimaryButton";
import "./ManageSongs.scss";

export const ManageSongs = () => {
    const {
        songs,
        isUploadOpen,
        editSong,
        openUploadModal, closeUploadModal,
        openEditModal, closeEditModal,
        saveNewSong, deleteSong,
        saveEdit,
        handleEditChange
    } = useSongManager();

    return (
        <div className="manage-songs">
            <header className="manage-songs__header">
                <h1 className="manage-songs__title">{ADMIN_MANAGE_SONGS_STRINGS.TITLE}</h1>
                <PrimaryButton className="manage-songs__add-button" onClick={openUploadModal}>
                    <PlusCircle size={18} /> {ADMIN_MANAGE_SONGS_STRINGS.ADD_BUTTON}
                </PrimaryButton>
            </header>

            {isUploadOpen && (
                <UploadSong
                    onCancel={closeUploadModal}
                    onSave={saveNewSong}
                />
            )}

            <div className="songs-list">
                <div className="songs-list__header-row">
                    <span>{ADMIN_MANAGE_SONGS_STRINGS.TABLE.ID}</span>
                    <span>{ADMIN_MANAGE_SONGS_STRINGS.TABLE.TITLE}</span>
                    <span>{ADMIN_MANAGE_SONGS_STRINGS.TABLE.ARTIST}</span>
                    <span>{ADMIN_MANAGE_SONGS_STRINGS.TABLE.GENRE}</span>
                    <span>{ADMIN_MANAGE_SONGS_STRINGS.TABLE.DURATION}</span>
                    <span>{ADMIN_MANAGE_SONGS_STRINGS.TABLE.ACTIONS}</span>
                </div>

                <div className="songs-list__content">
                    {songs.map((song) => (
                        <SongItem 
                            key={song.id}
                            song={song}
                            onEdit={openEditModal}
                            onDelete={deleteSong}
                        />
                    ))}
                </div>
            </div>

            {editSong && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-content__header">
                            <h2 className="modal-content__title">{ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.TITLE}</h2>
                            <PrimaryButton className="modal-content__close-button" onClick={closeEditModal}><X /></PrimaryButton>
                        </div>
                        <div className="modal-content__body">
                            <input className="modal-content__input" type="text" placeholder={ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.PLACEHOLDERS.TITLE} value={editSong.title} onChange={(e) => handleEditChange("title", e.target.value)} />
                            <input className="modal-content__input" type="text" placeholder={ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.PLACEHOLDERS.ARTIST} value={editSong.artist} onChange={(e) => handleEditChange("artist", e.target.value)} />
                            <input className="modal-content__input" type="text" placeholder={ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.PLACEHOLDERS.GENRE} value={editSong.genre} onChange={(e) => handleEditChange("genre", e.target.value)} />
                            
                            <label className="modal-content__label">{ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.LABEL_CHANGE_COVER}</label>
                            <input className="modal-content__file-input" id="cover-upload" type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const previewURL = URL.createObjectURL(file);
                                        handleEditChange("cover", previewURL);
                                    }
                                }}
                            />

                            <label htmlFor="cover-upload" className="modal-content__upload-button">
                                <UploadIcon size={20} /> {ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.UPLOAD_BUTTON}
                            </label>

                            {editSong.cover && (
                                <img src={editSong.cover} alt="cover preview" className="modal-content__image-preview" />
                            )}
                        </div>

                        <div className="modal-content__footer">
                            <PrimaryButton className="modal-content__button modal-content__button--save" onClick={saveEdit}>{ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.BUTTONS.SAVE}</PrimaryButton>
                            <PrimaryButton className="modal-content__button modal-content__button--cancel" onClick={closeEditModal}>{ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.BUTTONS.CANCEL}</PrimaryButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}