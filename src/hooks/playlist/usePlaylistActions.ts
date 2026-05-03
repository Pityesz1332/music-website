import React, { useState, useRef, useEffect } from "react";
import type { Song } from "@interfaces/music";
import { NotificationType } from "@context/NotificationContext";
import { PLAYLIST_ACTIONS_STRINGS } from "@i18n/feedback/playlist-actions";
import { useClickOutside } from "@hooks/general/useClickOutside";

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

    // TO-DO: using the useClickOutside hook 
    useClickOutside({
        ref: menuRef,
        callback: () => setContextMenu(null),
        enabled: contextMenu !== null
    });
    
    // Custom context menu: overrides the default browser menu on right-click.
    const handleContextMenu = (e: React.MouseEvent, songId: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, songId });
    };

    // editing mode
    const handleEdit = (songId: string) => {
        setEditingSongId(songId);
        setContextMenu(null);
    };

    // closing editing mode
    const closeEditMode = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingSongId(null);
    };

    // moving song in the list (up-down)
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

    // deleting song from the list (after confirm)
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

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSongToDelete(null);
    };

    return {
        contextMenu,
        editingSongId,
        menuRef,
        handleContextMenu,
        handleEdit,
        closeEditMode,
        moveSong,
        openDeleteModal,
        confirmDelete,
        isDeleteModalOpen,
        closeDeleteModal,
        songToDelete
    };
};