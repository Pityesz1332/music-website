import { useState, useEffect } from "react";
import { publishCatalog } from "../../services/songsCatalog";
import { resolveAssetUrl } from "../../services/swarm";
import { getFeedKey } from "../../services/feedKey";
import type { Song } from "@interfaces/music";
import { useSongsFromSwarm } from "@hooks/swarm/useSongsFromSwarm";

export const useSongManager = () => {
    const { songs: swarmSongs, loading: swarmLoading } = useSongsFromSwarm();
    const [songs, setSongs] = useState<Song[]>([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [editSong, setEditSong] = useState<Song | null>(null);
    const [publishing, setPublishing] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);

    // Initializing list
    useEffect(() => {
        if (!swarmLoading && swarmSongs.length > 0) {
            setSongs(swarmSongs);
        }
    }, [swarmLoading, swarmSongs]);

    // Publishing to the Swarm feed after every change. The feed-owner private key is
    // entered at runtime via the Feed Key panel and held in memory only (see
    // services/feedKey.ts) — it is never baked into the bundle.
    const publishToSwarm = async (updatedSongs: Song[]) => {
        const feedKey = getFeedKey();
        if (!feedKey) {
            setPublishError("Enter the feed private key first to publish changes.");
            return;
        }

        try {
            setPublishing(true);
            setPublishError(null);
            await publishCatalog(updatedSongs, feedKey);
        } catch (err) {
            setPublishError(err instanceof Error ? err.message : "Publish failed");
        } finally {
            setPublishing(false);
        }
    };

    const saveNewSong = async (song: any) => {
        const maxId = songs.length > 0 ? Math.max(...songs.map(s => Number(s.id))) : 0;

        const newSong: Song = {
            id: String(maxId + 1),
            title: song.title,
            artist: song.artist,
            genre: song.genre,
            duration: song.duration,
            src: song.audioHash,
            swarmHash: song.audioHash,
            cover: song.coverHash ? resolveAssetUrl(song.coverHash) : "",
            coverHash: song.coverHash,
            defaultBgVideo: "/assets/animation1.mp4",
            playingBgVideo: "/assets/waveform-to3.mp4"
        };

        const updated = [...songs, newSong];
        setSongs(updated);
        setIsUploadOpen(false);
        await publishToSwarm(updated);
    };

    const deleteSong = async (id: string) => {
        const updated = songs.map(s => s.id !== id ? { ...s, hidden: true } : s);
        setSongs(updated);
        await publishToSwarm(updated);
    };

    const saveEdit = async () => {
        if (!editSong) return;
        const updated = songs.map(s => s.id === editSong?.id ? editSong : s);
        setSongs(updated);
        setEditSong(null);
        await publishToSwarm(updated);
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
        publishing, publishError,
        openUploadModal, closeUploadModal,
        openEditModal, closeEditModal,
        saveNewSong, deleteSong,
        saveEdit,
        handleEditChange
    };
};