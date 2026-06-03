import { useState, useEffect } from "react";
import { resolveSwarmCover } from "../../swarm/swarmService";
import songsData from "@data/songs.json";
import type { Song } from "@interfaces/music";

export const useSongManager = () => {
    const [songs, setSongs] = useState<Song[]>(() => {
        const saved = localStorage.getItem("admin_songs");
        return saved ? JSON.parse(saved) : (songsData as Song[]);
    });

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [editSong, setEditSong] = useState<Song | null>(null);

    // Synchronize the list to localStorage on every change.
    useEffect(() => {
        localStorage.setItem("admin_songs", JSON.stringify(songs));
    }, [songs]);

    // Add new music (calculated by ID) and include the default videos.
    const saveNewSong = (song: any) => {
        const maxId = songs.length > 0 ? Math.max(...songs.map(s => Number(s.id))) : 0;

        const newSong: Song = {
            id: String(maxId + 1),
            title: song.title,
            artist: song.artist,
            genre: song.genre,
            duration: song.duration,
            src: song.audioHash,
            swarmHash: song.audioHash,
            cover: song.coverHash ? resolveSwarmCover(song.coverHash) : "",
            coverHash: song.coverHash,
            defaultBgVideo: "/assets/animation1.mp4",
            playingBgVideo: "/assets/waveform-to3.mp4"
        };

        setSongs([...songs, newSong]);
        setIsUploadOpen(false);
    };

    const deleteSong = (id: string) => {
        setSongs(songs.filter((s) => s.id !== id));
    };

    const saveEdit = () => {
        if (!editSong) return;
        setSongs(songs.map(s => (s.id === editSong?.id ? editSong : s)));
        setEditSong(null);
    };

    // dynamic key management
    const handleEditChange = (field: keyof Song | "coverFile", value: string | File) => {
        setEditSong(prev => {
            if (!prev) return null;
            return { ...prev, [field]: value } as Song;
        });
    };

    // modal handling
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