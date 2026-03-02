import { PlusCircle, Trash2, Edit, X, UploadIcon} from "lucide-react";
import { UploadSong } from "../../../components/admin/upload-song/UploadSong";
import { useSongManager } from "../../../hooks/admin/useSongManager";
import { ADMIN_MANAGE_SONGS_STRINGS } from "../../../constant-strings/ui/admin/manageSongs";
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
            <h1 className="manage-songs__title">{ADMIN_MANAGE_SONGS_STRINGS.TITLE}</h1>

            <button className="manage-songs__add-button" onClick={openUploadModal}>
                <PlusCircle size={18} /> {ADMIN_MANAGE_SONGS_STRINGS.ADD_BUTTON}
            </button>

            {isUploadOpen && (
                <UploadSong
                    onCancel={closeUploadModal}
                    onSave={saveNewSong}
                />
            )}

            <table className="manage-songs__table">
                <thead className="manage-songs__thead">
                    <tr className="manage-songs__row">
                        <th className="manage-songs__header">{ADMIN_MANAGE_SONGS_STRINGS.TABLE.ID}</th>
                        <th className="manage-songs__header">{ADMIN_MANAGE_SONGS_STRINGS.TABLE.COVER}</th>
                        <th className="manage-songs__header">{ADMIN_MANAGE_SONGS_STRINGS.TABLE.TITLE}</th>
                        <th className="manage-songs__header">{ADMIN_MANAGE_SONGS_STRINGS.TABLE.ARTIST}</th>
                        <th className="manage-songs__header">{ADMIN_MANAGE_SONGS_STRINGS.TABLE.GENRE}</th>
                        <th className="manage-songs__header">{ADMIN_MANAGE_SONGS_STRINGS.TABLE.DURATION}</th>
                        <th className="manage-songs__header">{ADMIN_MANAGE_SONGS_STRINGS.TABLE.ACTIONS}</th>
                    </tr>
                </thead>
                <tbody className="manage-songs__tbody">
                    {songs.map((song) => (
                        <tr key={song.id} className="manage-songs__row">
                            <td className="manage-songs__cell" data-label="ID">{song.id}</td>
                            <td className="manage-songs__cell" data-label="Cover">
                                <img src={song.cover} alt="song cover" className="manage-songs__cover-image" />
                            </td>
                            <td className="manage-songs__cell" data-label="Title">{song.title}</td>
                            <td className="manage-songs__cell" data-label="Artist">{song.artist}</td>
                            <td className="manage-songs__cell" data-label="Genre">{song.genre}</td>
                            <td className="manage-songs__cell" data-label="Duration">{song.duration}</td>
                            <td className="manage-songs__cell manage-songs__cell--actions" data-label="Actions">
                                <button className="manage-songs__action-button manage-songs__action-button--edit" onClick={() => openEditModal(song)}>
                                    <Edit size={16} />
                                </button>
                                <button className="manage-songs__action-button manage-songs__action-button--delete" onClick={() => deleteSong(song.id)}><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editSong && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-content__header">
                            <h2 className="modal-content__title">{ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.TITLE}</h2>
                            <button className="modal-content__close-button" onClick={closeEditModal}><X /></button>
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
                            <button className="modal-content__button modal-content__button--save" onClick={saveEdit}>{ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.BUTTONS.SAVE}</button>
                            <button className="modal-content__button modal-content__button--cancel" onClick={closeEditModal}>{ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.BUTTONS.CANCEL}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}