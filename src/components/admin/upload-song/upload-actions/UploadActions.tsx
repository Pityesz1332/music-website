import { X } from "lucide-react";
import { ADMIN_UPLOAD_SONG_STRINGS } from "@i18n/ui/admin/upload-song";
import { PrimaryButton } from "../../../ui/button/PrimaryButton";

interface UploadActionsProps {
    isUploading: boolean;
    onUpload: () => void;
    onCancel: () => void;
}

export const UploadActions = ({ isUploading, onUpload, onCancel }: UploadActionsProps) => {
    return (
        // a disabled állapot fontos, hogy 
        // megakadályozza a double-submit hibát
        <div className="upload-song__actions">
            <PrimaryButton
                className="upload-song__button upload-song__button--save"
                onClick={onUpload}
                disabled={isUploading}>
                    {isUploading ? ADMIN_UPLOAD_SONG_STRINGS.STATUS.UPLOADING : ADMIN_UPLOAD_SONG_STRINGS.STATUS.SAVE}
            </PrimaryButton>
            <PrimaryButton 
                className="upload-song__button upload-song__button--cancel"
                onClick={onCancel}>
                    <X size={16} />
            </PrimaryButton>
        </div>
    );
};