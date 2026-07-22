import { useState, useEffect } from "react";
import { publishSongsToFeed, resolveSwarmCover } from "../../swarm/swarmService";
import type { Song } from "@interfaces/music";
import { useSongsFromSwarm } from "@hooks/swarm/useSongsFromSwarm";
import { getFeedKey } from "../../swarm/feedKey";

export const useSongManager = () => {
    // Admin manages hidden songs too, so it needs the unfiltered catalog.
    const { songs: swarmSongs, loading: swarmLoading } = useSongsFromSwarm({ includeHidden: true });
    const [songs, setSongs] = useState<Song[]>([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);

    // Initializing list
    useEffect(() => {
        if (!swarmLoading && swarmSongs.length > 0) {
            setSongs(swarmSongs);
        }
    }, [swarmLoading, swarmSongs]);

    // Feed publishing
    const publishToSwarm = async (updatedSongs: Song[]) => {
        const feedKey = getFeedKey();
        if (!feedKey) {
            setPublishError("Enter the feed publisher key before publishing.");
            return;
        }
        try {
            setPublishing(true);
            setPublishError(null);
            await publishSongsToFeed(updatedSongs, feedKey);
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
            cover: song.coverHash ? resolveSwarmCover(song.coverHash) : "",
            coverHash: song.coverHash,
            defaultBgVideo: `${import.meta.env.BASE_URL}assets/animation1.mp4`,
            playingBgVideo: `${import.meta.env.BASE_URL}assets/waveform-to3.mp4`
        };

        const updated = [...songs, newSong];
        setSongs(updated);
        setIsUploadOpen(false);
        await publishToSwarm(updated);
    };

    // Hiding is the only possible "removal": the song leaves the public dapp
    // listing, but its chunks stay on Swarm. Setting hidden:false restores it.
    const setSongHidden = async (id: string, hidden: boolean) => {
        const updated = songs.map(s => s.id === id ? { ...s, hidden } : s);
        setSongs(updated);
        await publishToSwarm(updated);
    };

    const hideSong = (id: string) => setSongHidden(id, true);
    const unhideSong = (id: string) => setSongHidden(id, false);

    // modal handling
    const openUploadModal = () => setIsUploadOpen(true);
    const closeUploadModal = () => setIsUploadOpen(false);

    return {
        songs,
        isUploadOpen,
        publishing, publishError,
        openUploadModal, closeUploadModal,
        saveNewSong,
        hideSong, unhideSong,
    };
};