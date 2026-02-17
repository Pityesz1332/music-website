import { UploadCloud, Music, Image as ImageIcon, X } from "lucide-react";
import { useUploadSong } from "../../../hooks/admin/useUploadSong";
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
            <h2 className="upload-song__title">Upload New Song</h2>

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
                        <UploadCloud size={18}/>Select your audio
                    </p>
                )}
            </div>

            <label className="upload-song__cover-label">
                <ImageIcon size={18}/> {coverFile ? "Cover uploaded" : "Upload Cover"}
                <input
                    className="upload-song__file-input"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleCoverChange}
                />
            </label>

            <input className="upload-song__input" type="text" placeholder="Title" value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })} />

            <input className="upload-song__input" type="text" placeholder="Artist" value={form.artist}
                onChange={(e) => updateForm({ artist: e.target.value })} />
            
            <input className="upload-song__input" type="text" placeholder="Genre" value={form.genre}
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
                <button
                    className="upload-song__button upload-song__button--save"
                    onClick={handleUpload}
                    disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Save"}
                    </button>
                <button 
                    className="upload-song__button upload-song__button--cancel"
                    onClick={onCancel}>
                        <X size={16} />
                    </button>
            </div>
        </div>
    );
}