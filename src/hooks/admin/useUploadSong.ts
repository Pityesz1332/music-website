import { useState, useRef } from "react";
import axios from "axios";

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

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setCoverFile(file);
        } else {
            alert("Please upload an image for the cover!");
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
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 100)
                    );
                    setProgress(percentCompleted);
                },
            });

            onSave(response.data);
        } catch (error) {
            console.error("Error during upload:", error);
            // csak a tesztelés miatt, amíg nincs backend
            if (progress === 100) {
                onSave({
                    ...form,
                    audio: URL.createObjectURL(audioFile),
                    coverFile: coverFile ? URL.createObjectURL(coverFile) : ""
                });
            }
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