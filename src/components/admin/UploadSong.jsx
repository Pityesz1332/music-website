import { useState } from "react";
import { UploadCloud, Music, Image as ImageIcon, X } from "lucide-react";
import "../../styles/admin/UploadSong.css";

function UploadSong({ onCancel, onSave }) {
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [form, setForm] = useState({
        title: "",
        artist: "",
        genre: "",
        duration: ""
    });

    function getAudioDuration(file) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            audio.addEventListener("loadedmetadata", () => {
                resolve(audio.duration);
            });
        });
    }

    function formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    }

    async function handleDrop(e) {
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
        <div className="upload-container">
            <h2>Upload New Song</h2>

            <div 
                className="dropzone" 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {audioFile ? (
                    <p><Music size={18}/>{audioFile.name}</p>
                ) : (
                    <p><UploadCloud size={18}/>Drag & Drop your audio</p>
                )}
            </div>

            <label className="cover-upload">
                <ImageIcon size={18}/> Upload Cover
                <input 
                    type="file" 
                    accept="image/*"
                    hidden
                    onChange={(e) => setCoverFile(e.target.files[0])}
                />
            </label>

            <input type="text" placeholder="Title" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />

            <input type="text" placeholder="Artist" value={form.artist}
                onChange={(e) => setForm({ ...form, artist: e.target.value })} />
            
            <input type="text" placeholder="Genre" value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })} />

            {progress > 0 && (
                <div className="progress-bar">
                    <div style={{ width: `${progress}%` }} />
                </div>
            )}

            <div className="upload-actions">
                <button className="upload-save" onClick={handleUpload}>Save</button>
                <button className="upload-cancel" onClick={onCancel}><X size={16} /></button>
            </div>
        </div>
    );
}

export default UploadSong;