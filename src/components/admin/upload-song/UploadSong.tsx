import { useUploadSong } from "@hooks/admin/useUploadSong";
import { ADMIN_UPLOAD_SONG_STRINGS } from "@i18n/ui/admin/upload-song";
import { AudioDropzone } from "./audio-dropzone/AudioDropzone";
import { CoverUpload } from "./cover-upload/CoverUpload";
import { SongFormFields } from "./song-form-fields/SongFormFields";
import { UploadProgressBar } from "./upload-progress-bar/UploadProgressBar";
import { UploadActions } from "./upload-actions/UploadActions";
import "./UploadSong.scss";

interface UploadSongProps {
    onCancel: () => void;
    onSave: (song: {
        title: string;
        artist: string;
        genre: string;
        duration: string;
        audio: string;
        coverFile: string;
    }) => void | Promise<void>;
}

export const UploadSong = ({ onCancel, onSave }: UploadSongProps) => {
    const {
        audioFile,
        coverFile,
        progress,
        isUploading,
        form,
        audioInputRef,
        handleAudioChange,
        handleCoverChange,
        handleUpload,
        updateForm
    } = useUploadSong(onSave);
    
    return (
        <div className="upload-song">
            <h2 className="upload-song__title">{ADMIN_UPLOAD_SONG_STRINGS.TITLE}</h2>

            <AudioDropzone 
                audioFile={audioFile}
                audioInputRef={audioInputRef}
                onAudioChange={handleAudioChange}
            />

            <CoverUpload 
                coverFile={coverFile}
                onCoverChange={handleCoverChange}
            />

            <SongFormFields 
                form={form}
                updateForm={updateForm}
            />

            <UploadProgressBar progress={progress} />

            <UploadActions 
                isUploading={isUploading} 
                onUpload={handleUpload}
                onCancel={onCancel}    
            />
        </div>
    );
};