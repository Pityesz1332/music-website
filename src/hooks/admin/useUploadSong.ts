import { useState, useRef } from "react";
import { uploadAudio } from "../../swarm/swarmService";

interface SongForm {
    title: string;
    artist: string;
    genre: string;
    duration: string;
}

export const useUploadSong = (onSave: (song: any) => void) => {
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

    // Extracting audio file duration metadata.
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

    // File selection handling and auto-filling data.
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

    // cover handling
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setCoverFile(file);
        } else {
            alert("Please upload an image for the cover!");
        }
    };

    // sending data to swarm
    const handleUpload = async() => {
        if (!audioFile || !form.title || !form.artist || !form.genre) {
            alert("Fill every field!");
            return;
        }

        setIsUploading(true);
        setProgress(0);

        try {
            // audio uploading
            const swarmHash = await uploadAudio(audioFile, setProgress);

            // cover (still local, but this will be on swarm as well)
            const coverUrl = coverFile ? URL.createObjectURL(coverFile) : "";

            onSave({
                ...form,
                swarmHash,
                audio: "",
                coverFile: coverUrl
            });
        } catch (error) {
            console.error("[Swarm] Error during upload:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const updateForm = (updates: Partial<SongForm>) => {
        setForm(prev => ({ ...prev, ...updates }));
    };

    return {
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
    };
};