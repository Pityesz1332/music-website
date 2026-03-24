import { RefObject } from "react";
import { UploadCloud, Music } from "lucide-react";
import { ADMIN_UPLOAD_SONG_STRINGS } from "@i18n/ui/admin/upload-song";

interface AudioDropzoneProps {
    audioFile: File | null;
    audioInputRef: RefObject<HTMLInputElement | null>;
    onAudioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AudioDropzone = ({ audioFile, audioInputRef, onAudioChange }: AudioDropzoneProps) => {
    const handleDropzoneClick = () => {
        audioInputRef.current?.click();
    };

    return (
        <div
            className={`upload-song__dropzone ${audioFile ? 'upload-song__dropzone--active' : ''}`}
            onClick={handleDropzoneClick}
        >
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