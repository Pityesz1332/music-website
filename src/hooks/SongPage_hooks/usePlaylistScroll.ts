import { useEffect, useRef } from "react";
import type { Song } from "../../types/music";

// bemeneti adatok
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
        // megnézzük, melyik elemre kell fókuszálni
        // szerkesztett dal elsőbbséget élvez
        const targetId = editingSongId || currentSong?.id;
        if (!targetId || !playlistRef.current) return;

        // megkeressük a listában a konkrét elemet, id alapján
        const activeCard = itemsRef.current.get(targetId);
        if (!activeCard) return;

        const container = playlistRef.current;
        
        // kiszámoljuk mennyit kell görgetni, hogy az elem középre kerüljön
        const scrollTop = activeCard.offsetTop - (container.clientHeight / 2) + (activeCard.clientHeight / 2);
        // smooth görgetés
        container.scrollTo({
            top: scrollTop,
            behavior: "smooth"
        });
    }, [currentSong, playlist, editingSongId]);

    // segédfüggvény, ami regisztrálja a listaelemeket
    const setItemRef = (id: string, el: HTMLElement | null) => {
        if (el) {
            itemsRef.current.set(id, el);
        } else {
            itemsRef.current.delete(id);
        }
    };

    return { playlistRef, setItemRef };
}