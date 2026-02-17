import React, { useState, useRef, useEffect } from "react";
import type { Song } from "../../types/music";
import { NotificationType } from "../../context/NotificationContext";

// paraméterek meghatározása
interface UsePlaylistActionsProps {
    playlist: Song[];
    setPlaylist: (playlist: Song[]) => void;
    currentSong: Song | null;
    nextSong: () => void;
    notify: (message: string, type: NotificationType) => void;
}

export const usePlaylistActions = ({
    playlist,
    setPlaylist,
    currentSong,
    nextSong,
    notify
}: UsePlaylistActionsProps) => {
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, songId: string } | null>(null);
    const [editingSongId, setEditingSongId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // kívülre kattintás figyelése és menü bezárása
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setContextMenu(null);
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    // jobb klikk -> saját menü, nem a böngésző default
    const handleContextMenu = (e: React.MouseEvent, songId: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, songId });
    };

    // szerkesztési mód bekapcsolása
    const handleEdit = (songId: string) => {
        setEditingSongId(songId);
        setContextMenu(null);
    };

    // szerkesztési mód bezárása
    const closeEditMode = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingSongId(null);
    };

    // zene mozgatása a listában (fel vagy le)
    const moveSong = (e: React.MouseEvent, direction: "up" | "down", songId: string) => {
        e.stopPropagation();
        const currentIndex = playlist.findIndex((s) => s.id === songId);
        if (currentIndex === -1) return;

        const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= playlist.length) return;

        const newPlaylist = [...playlist];
        [newPlaylist[currentIndex], newPlaylist[newIndex]] = [newPlaylist[newIndex], newPlaylist[currentIndex]];
        setPlaylist(newPlaylist);
    };

    // zene törlése a listából megerősítás után
    const handleDelete = (songId: string) => {
        const songToDelete = playlist.find(s => s.id === songId);
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${songToDelete?.title} from the playlist?`
        );

        if (confirmDelete) {
            const newPlaylist = playlist.filter(s => s.id !== songId);
            setPlaylist(newPlaylist);
            notify("Song deleted from playlist", NotificationType.SUCCESS);

            if (currentSong?.id === songId && newPlaylist.length > 0) {
                nextSong();
            }
        }
        setContextMenu(null);
    };

    return {
        contextMenu, setContextMenu,
        editingSongId, setEditingSongId,
        menuRef,
        handleContextMenu,
        handleEdit,
        closeEditMode,
        moveSong,
        handleDelete
    };
};