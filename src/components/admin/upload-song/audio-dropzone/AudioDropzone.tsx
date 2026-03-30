import { RefObject } from "react";
import { UploadCloud, Music } from "lucide-react";
import { ADMIN_UPLOAD_SONG_STRINGS } from "@i18n/ui/admin/upload-song";

interface AudioDropzoneProps {
    audioFile: File | null;
    audioInputRef: RefObject<HTMLInputElement | null>;
    onAudioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// külön komponens a drag and drop és stíluozás miatt
export const AudioDropzone = ({ audioFile, audioInputRef, onAudioChange }: AudioDropzoneProps) => {
    // programozott kattintás, 
    // mert az eredeti input rejtve van
    const handleDropzoneClick = () => {
        audioInputRef.current?.click();
    };

    return (
        <div
            className={`upload-song__dropzone ${audioFile ? 'upload-song__dropzone--active' : ''}`}
            onClick={handleDropzoneClick}
        >
            {/* rejtett input. fájlválasztó megnyitása */}
            <input
                type="file"
                ref={audioInputRef}
                accept="audio/*"
                hidden
                onChange={onAudioChange}
            />
            {audioFile ? (
                <p className="upload-song__file-info">
                    <Music size={18}/> {audioFile.name}
                </p>
            ) : (
                <p className="upload-song__placeholder">
                    <UploadCloud size={18}/>{ADMIN_UPLOAD_SONG_STRINGS.DROPZONE.PLACEHOLDER}
                </p>
            )}
        </div>
    );
};