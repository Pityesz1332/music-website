import { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud, Music, Image as ImageIcon, X } from "lucide-react";
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

interface SongForm {
    title: string;
    artist: string;
    genre: string;
    duration: string;
}

export const UploadSong = ({ onCancel, onSave }: UploadSongProps) => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [form, setForm] = useState<SongForm>({
        title: "",
        artist: "",
        genre: "",
        duration: ""
    });

    const audioInputRef = useRef<HTMLInputElement>(null);

    // audio fájl hosszának metadata kinyerése
    const getAudioDuration = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const audio = new Audio();
            const objectUrl = URL.createObjectURL(file);
            audio.src = objectUrl;
            audio.onloadedmetadata = () => {
                URL.revokeObjectURL(objectUrl);
                const mins = Math.floor(audio.duration / 60);
                const secs = Math.floor(audio.duration % 60).toString().padStart(2, "0");
                resolve(`${mins}:${secs}`);
            };
        });
    };

    // fájl kiválasztás kezelése és automatikus adatkitöltés
    const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("audio/")) {
            setAudioFile(file);
            const duration = await getAudioDuration(file);
            setForm(prev =>({
                ...prev,
                title: file.name.replace(/\.[^/.]+$/, ""),
                duration
            }));
        } else {
            alert("You can only upload audio files!");
        }
    };

    // adatok küldése a szervernek
    const handleUpload = async() => {
        if (!audioFile || !form.title || !form.artist || !form.genre) {
            alert("Fill every field!");
            return;
        }

        const formData = new FormData();
        formData.append("audio", audioFile);
        if (coverFile) formData.append("cover", coverFile);
        formData.append("title", form.title);
        formData.append("artist", form.artist);
        formData.append("genre", form.genre);
        formData.append("duration", form.duration);

        setIsUploading(true);

        try {
            const response = await axios.post("/api/songs/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (ProgressEvent) => {
                    const percentCompleted = Math.round(
                        (ProgressEvent.loaded * 100) / (ProgressEvent.total || 100)
                    );
                    setProgress(percentCompleted);
                },
            });

            onSave(response.data);
        } catch (error) {
            console.error("Error during upload:", error);
            // csak a tesztelés miatt, amíg nincs backend
            if (progress === 100) onSave({
                    ...form,
                    audio: URL.createObjectURL(audioFile),
                    coverFile: coverFile ? URL.createObjectURL(coverFile) : "" });
        } finally {
            setIsUploading(false);
        }
    };

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
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
            </label>

            <input className="upload-song__input" type="text" placeholder="Title" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />

            <input className="upload-song__input" type="text" placeholder="Artist" value={form.artist}
                onChange={(e) => setForm({ ...form, artist: e.target.value })} />
            
            <input className="upload-song__input" type="text" placeholder="Genre" value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })} />

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