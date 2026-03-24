import { useState, useEffect } from "react";
import songsData from "@data/songs.json";
import type { Song } from "@interfaces/music";

export const useSongManager = () => {
    const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem("admin_songs");
    return saved ? JSON.parse(saved) : (songsData as Song[]);
    });

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [editSong, setEditSong] = useState<Song | null>(null);

    // minden változásnál szinkronizáljuk a listát a localstorage-ba
    useEffect(() => {
        localStorage.setItem("admin_songs", JSON.stringify(songs));
    }, [songs]);

    // új zene hozzáadása (kiszámoljuk ID alapján) + a default videók hozzáadása
    const saveNewSong = (song: any) => {
        const maxId = songs.length > 0 ? Math.max(...songs.map(s => Number(s.id))) : 0;

        const newSong: Song = {
            id: String(maxId + 1),
            title: song.title,
            artist: song.artist,
            genre: song.genre,
            duration: song.duration,
            src: song.audio,
            cover: song.coverFile,
            defaultBgVideo: "/assets/animation1.mp4",
            playingBgVideo: "/assets/waveform-to3.mp4"
        };

        setSongs([...songs, newSong]);
        setIsUploadOpen(false);
    };

    // zene törlése
    const deleteSong = (id: string) => {
        setSongs(songs.filter((s) => s.id !== id));
    };

    // szerkesztés mentése
    const saveEdit = () => {
        if (!editSong) return;
        setSongs(songs.map(s => (s.id === editSong?.id ? editSong : s)));
        setEditSong(null);
    };

    // dinamikus kulcskezelés
    const handleEditChange = (field: keyof Song, value: string) => {
        setEditSong(prev => prev ? { ...prev, [field]: value }: null);
    };

    // modalkezelés
    const openEditModal = (song: Song) => setEditSong(song);
    const closeEditModal = () => setEditSong(null);
    const openUploadModal = () => setIsUploadOpen(true);
    const closeUploadModal = () => setIsUploadOpen(false);

    return {
        songs,
        isUploadOpen,
        editSong,
        openUploadModal, closeUploadModal,
        openEditModal, closeEditModal,
        saveNewSong, deleteSong,
        saveEdit,
        handleEditChange
    };
};