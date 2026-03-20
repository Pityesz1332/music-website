import { PlusCircle} from "lucide-react";
import { UploadSong } from "../../../components/admin/upload-song/UploadSong";
import { AdminManageTable } from "../../../components/admin/admin-manage-table/AdminManageTable";
import { useSongManager } from "../../../hooks/admin/useSongManager";
import { SongItem } from "./song-item/SongItem";
import { ADMIN_MANAGE_SONGS_STRINGS } from "../../../i18n/ui/admin/manage-songs";
import { PrimaryButton } from "../../../components/ui/button/PrimaryButton";
import { songs_headers } from "../table-headers/table-headers";
import { EditSong } from "./edit-song/EditSong";
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

            <AdminManageTable 
                items={songs}
                headers={songs_headers}
                className="songs-list"
                variant="songs"
                renderItem={(song) => (
                    <SongItem
                        song={song}
                        onEdit={openEditModal}
                        onDelete={deleteSong}
                    />
                )}
            />

            <EditSong
                song={editSong}
                onClose={closeEditModal}
                onSave={saveEdit}
                onChange={handleEditChange}
            />
        </div>
    );
};