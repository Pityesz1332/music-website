import { Image as ImageIcon } from "lucide-react";
import { ADMIN_UPLOAD_SONG_STRINGS } from "../../../../i18n/ui/admin/upload-song";

interface CoverUploadProps {
    coverFile: File | null;
    onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CoverUpload = ({ coverFile, onCoverChange }: CoverUploadProps) => {
    return (
        <label className="upload-song__cover-label">
            <ImageIcon size={18}/> {coverFile ? ADMIN_UPLOAD_SONG_STRINGS.COVER.SUCCESS : ADMIN_UPLOAD_SONG_STRINGS.COVER.UPLOAD}
            <input
                className="upload-song__file-input"
                type="file"
                accept="image/*"
                hidden
                onChange={onCoverChange}
            />
            </label>
    );
};