import { useState } from "react";
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
    const [form, setForm] = useState<SongForm>({
        title: "",
        artist: "",
        genre: "",
        duration: ""
    });

    const getAudioDuration = (file: File): Promise<number> => {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            audio.addEventListener("loadedmetadata", () => {
                resolve(audio.duration);
            });
        });
    }

    function formatDuration(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("audio/")) {
            setAudioFile(file);
            setForm({ ...form, title: file.name.replace(/\.[^/.]+$/, "") });

            const durationSec = await getAudioDuration(file);
            const formatted = formatDuration(durationSec);

            setForm(prev => ({ ...prev, duration: formatted }));
        }
    }

    function handleUpload() {
        if (!audioFile || !form.title || !form.artist) {
            return;
        }

        const interval = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(interval);
                    onSave({
                        ...form,
                        audio: URL.createObjectURL(audioFile),
                        coverFile: coverFile ? URL.createObjectURL(coverFile) : "/dummy-data/dummy2.jpg",
                        duration: form.duration
                    });
                }
                return p + 10;
            });
        }, 150);
    }

    return (
        <div className="upload-song">
            <h2 className="upload-song__title">Upload New Song</h2>

            <div
                className={`upload-song__dropzone ${audioFile ? 'upload-song__dropzone--active' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {audioFile ? (
                    <p className="upload-song__file-info"><Music size={18}/>{audioFile.name}</p>
                ) : (
                    <p className="upload-song__placeholder"><UploadCloud size={18}/>Drag & Drop your audio</p>
                )}
            </div>

            <label className="upload-song__cover-label">
                <ImageIcon size={18}/> Upload Cover
                <input
                    className="upload-song__file-input"
                    type="file" 
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setCoverFile(file)
                    }}
                />
            </label>

            <input className="upload-song__input" type="text" placeholder="Title" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />

            <input className="upload-song__input" type="text" placeholder="Artist" value={form.artist}
                onChange={(e) => setForm({ ...form, artist: e.target.value })} />
            
            <input className="upload-song__input" type="text" placeholder="Genre" value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })} />

            {progress > 0 && (
                <div className="upload-song__progress-container">
                    <div className="upload-song__progress-filler" style={{ width: `${progress}%` }} />
                </div>
            )}

            <div className="upload-song__actions">
                <button className="upload-song__button upload-song__button--save" onClick={handleUpload}>Save</button>
                <button className="upload-song__button upload-song__button--cancel" onClick={onCancel}><X size={16} /></button>
            </div>
        </div>
    );
}