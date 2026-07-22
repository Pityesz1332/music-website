import { PlusCircle} from "lucide-react";
import { UploadSong } from "@components/admin/upload-song/UploadSong";
import { AdminManageTable } from "@components/admin/admin-manage-table/AdminManageTable";
import { FeedKeyPanel } from "@components/admin/feed-key/FeedKeyPanel";
import { useSongManager } from "@hooks/admin/useSongManager";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { ADMIN_MANAGE_SONGS_STRINGS } from "@i18n/ui/admin/manage-songs";
import { SongItem } from "./song-item/SongItem";
import { songs_headers } from "../table-headers/table-headers";
import "./ManageSongs.scss";

export const ManageSongs = () => {
    const {
        songs,
        isUploadOpen,
        publishing, publishError,
        openUploadModal, closeUploadModal,
        saveNewSong,
        hideSong, unhideSong,
    } = useSongManager();

    return (
        <div className="manage-songs">
            <header className="manage-songs__header">
                <h1 className="manage-songs__title">{ADMIN_MANAGE_SONGS_STRINGS.TITLE}</h1>
                <PrimaryButton className="manage-songs__add-button" onClick={openUploadModal}>
                    <PlusCircle size={18} /> {ADMIN_MANAGE_SONGS_STRINGS.ADD_BUTTON}
                </PrimaryButton>
            </header>

            <FeedKeyPanel />

            {publishing && <p className="manage-songs__status">Publishing to Swarm…</p>}
            {publishError && <p className="manage-songs__error">{publishError}</p>}

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
                        onHide={hideSong}
                        onUnhide={unhideSong}
                    />
                )}
            />
        </div>
    );
};