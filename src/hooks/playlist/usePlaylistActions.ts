import React, { useState, useRef, useEffect } from "react";
import type { Song } from "@interfaces/music";
import { NotificationType } from "@context/NotificationContext";
import { PLAYLIST_ACTIONS_STRINGS } from "@i18n/feedback/playlist-actions";

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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [songToDelete, setSongToDelete] = useState<Song | null>(null);

    
    const menuRef = useRef<HTMLDivElement | null>(null);

    // kívülre kattintás figyelése és menü bezárása
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setContextMenu(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
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
    const openDeleteModal = (songId: string) => {
        const song = playlist.find(s => s.id === songId);
        if (song) {
            setSongToDelete(song);
            setIsDeleteModalOpen(true);
        }
        setContextMenu(null);
    };

    const confirmDelete = () => {
        if (!songToDelete) return;

        const newPlaylist = playlist.filter(s => s.id !== songToDelete.id);
        setPlaylist(newPlaylist);
        notify(PLAYLIST_ACTIONS_STRINGS.MESSAGE, NotificationType.SUCCESS);

        if (currentSong?.id === songToDelete.id && newPlaylist.length > 0) {
            nextSong();
        }

        setIsDeleteModalOpen(false);
        setSongToDelete(null);
    };

    return {
        contextMenu, setContextMenu,
        editingSongId, setEditingSongId,
        menuRef,
        handleContextMenu,
        handleEdit,
        closeEditMode,
        moveSong,
        openDeleteModal,
        confirmDelete,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        songToDelete
    };
};