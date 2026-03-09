import { UploadCloud, Music, Image as ImageIcon, X } from "lucide-react";
import { useUploadSong } from "../../../hooks/admin/useUploadSong";
import { ADMIN_UPLOAD_SONG_STRINGS } from "../../../constant-strings/ui/admin/uploadSong";
import { PrimaryButton } from "../../ui/button/PrimaryButton";
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
    }) => void;
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

            <div
                className={`upload-song__dropzone ${audioFile ? 'upload-song__dropzone--active' : ''}`}
                onClick={() => audioInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={audioInputRef}
                    accept="audio/*"
                    hidden
                    onChange={handleAudioChange}
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

            <label className="upload-song__cover-label">
                <ImageIcon size={18}/> {coverFile ? ADMIN_UPLOAD_SONG_STRINGS.COVER.SUCCESS : ADMIN_UPLOAD_SONG_STRINGS.COVER.UPLOAD}
                <input
                    className="upload-song__file-input"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleCoverChange}
                />
            </label>

            <input className="upload-song__input" type="text" placeholder={ADMIN_UPLOAD_SONG_STRINGS.PLACEHOLDERS.TITLE} value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })} />

            <input className="upload-song__input" type="text" placeholder={ADMIN_UPLOAD_SONG_STRINGS.PLACEHOLDERS.ARTIST} value={form.artist}
                onChange={(e) => updateForm({ artist: e.target.value })} />
            
            <input className="upload-song__input" type="text" placeholder={ADMIN_UPLOAD_SONG_STRINGS.PLACEHOLDERS.GENRE} value={form.genre}
                onChange={(e) => updateForm({ genre: e.target.value })} />

            {progress > 0 && (
                <div className="upload-song__progress-wrapper">
                    <div className="upload-song__progress-container">
                        <div className="upload-song__progress-filler" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="upload-song__progress-text">{progress}%</span>
                </div>
            )}

            <div className="upload-song__actions">
                <PrimaryButton
                    className="upload-song__button upload-song__button--save"
                    onClick={handleUpload}
                    disabled={isUploading}>
                        {isUploading ? ADMIN_UPLOAD_SONG_STRINGS.STATUS.UPLOADING : ADMIN_UPLOAD_SONG_STRINGS.STATUS.SAVE}
                </PrimaryButton>
                <PrimaryButton 
                    className="upload-song__button upload-song__button--cancel"
                    onClick={onCancel}>
                        <X size={16} />
                </PrimaryButton>
            </div>
        </div>
    );
}