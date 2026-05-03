import { useEffect } from "react";
import { UploadIcon } from "lucide-react";
import { Modal } from "@components/ui/modal/Modal";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { ADMIN_MANAGE_SONGS_STRINGS } from "@i18n/ui/admin/manage-songs";
import type { Song } from "@interfaces/music";
import "./EditSong.scss";

interface EditSongProps {
    song: Song;
    onClose: () => void;
    onSave: () => void;
    onChange: (field: keyof Song | "coverFile", value: any) => void;
}

export const EditSong = ({ song, onClose, onSave, onChange }: EditSongProps) => {
    useEffect(() => {
        const currentCover = song.cover;

        return () => {
            if (currentCover && currentCover.startsWith("blob:")) {
                URL.revokeObjectURL(currentCover);
            }
        };
    }, [song.cover]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            onChange("cover", previewURL);
            onChange("coverFile", file);
        }
    };

    const handleInputChange = (field: keyof Song | "coverFile") => (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(field, e.target.value);
    };

    return (
        <Modal
            isOpen={!!song}
            onClose={onClose}
            title={ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.TITLE}
            buttons={
                <>
                    <PrimaryButton
                        className="modal-content__btn--cancel"
                        onClick={onClose}
                    >
                        {ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.BUTTONS.CANCEL}
                    </PrimaryButton>
                    <PrimaryButton
                        className="modal-content__btn--save"
                        onClick={onSave}
                    >
                        {ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.BUTTONS.SAVE}
                    </PrimaryButton>
                </>
            }
        >
            <div className="modal-content__body">
                <input className="modal-content__input" type="text" placeholder={ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.PLACEHOLDERS.TITLE} value={song.title} onChange={handleInputChange("title")} />
                <input className="modal-content__input" type="text" placeholder={ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.PLACEHOLDERS.ARTIST} value={song.artist} onChange={handleInputChange("artist")} />
                <input className="modal-content__input" type="text" placeholder={ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.PLACEHOLDERS.GENRE} value={song.genre} onChange={handleInputChange("genre")} />

                <label className="modal-content__label">{ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.LABEL_CHANGE_COVER}</label>
                <input className="modal-content__file-input" id="cover-upload" type="file" accept="image/*" onChange={handleFileChange} />

                <label htmlFor="cover-upload" className="modal-content__upload-button">
                    <UploadIcon size={20} /> {ADMIN_MANAGE_SONGS_STRINGS.EDIT_MODAL.UPLOAD_BUTTON}
                </label>

                {song.cover && (
                    <img src={song.cover} alt="cover preview" className="modal-content__image-preview" />
                )}
            </div>
        </Modal>
    );
};