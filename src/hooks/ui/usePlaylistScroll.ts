import { useEffect, useRef } from "react";
import type { Song } from "@interfaces/music";

interface UsePlaylistScrollProps {
    currentSong: Song | null;
    playlist: Song[];
    editingSongId: string | null;
}

export const usePlaylistScroll = ({
    currentSong,
    playlist,
    editingSongId
}: UsePlaylistScrollProps) => {
    const playlistRef = useRef<HTMLDivElement | null>(null);
    const itemsRef = useRef<Map<string, HTMLElement>>(new Map());

    useEffect(() => {
        // Identifying the element to focus on.
        // Prioritizing the track currently being edited.
        const targetId = editingSongId ?? currentSong?.id;
        if (!targetId || !playlistRef.current) return;

        // Find the specific item in the list by ID.
        const activeCard = itemsRef.current.get(targetId);
        if (!activeCard) return;

        const container = playlistRef.current;
        
        // Calculate the scroll offset required to center the element.
        const scrollTop = activeCard.offsetTop - (container.clientHeight / 2) + (activeCard.clientHeight / 2);
        // smooth scrolling
        container.scrollTo({
            top: scrollTop,
            behavior: "smooth"
        });
    }, [currentSong, playlist, editingSongId]);

    // Helper function to register list items.
    const setItemRef = (id: string, el: HTMLElement | null) => {
        if (el) {
            itemsRef.current.set(id, el);
        } else {
            itemsRef.current.delete(id);
        }
    };

    return { playlistRef, setItemRef };
}