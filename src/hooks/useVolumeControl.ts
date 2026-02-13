import { useState, useEffect, RefObject, useRef } from "react";

// külön kezeljük a hangerőállítást
export const useVolumeControl = (audioRef: RefObject<HTMLAudioElement>) => {
    const [volume, setVolume] = useState<number>(1);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    // átírtam ref-re
    const volumeWrapperRef = useRef<HTMLDivElement>(null);

    // központi hangerő állító
    const updateVolume = (val: number) => {
        const newVol = Math.min(Math.max(val, 0), 1);
        setVolume(newVol);
        if (audioRef.current) {
            audioRef.current.volume = newVol;
        }
    };

    // az 'input type="range"' miatt
    const handleVolumeChanger = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateVolume(parseFloat(e.target.value));
    };

    // gombbal való hangerőszabályzás
    const adjustVolume = (direction: number) => {
        const step = 0.05;
        updateVolume(volume - direction * step);
    };

    // kiszámoljuk, hogy hány %-on áll a csúszka
    const updateVolumeFromEvent = (clientX: number, rect: DOMRect) => {
        const x = clientX - rect.left;
        const percent = x / rect.width;
        updateVolume(percent);
    };

    // megfogjuk a csúszkát
    const handleVolumeDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setIsDragging(true);
        updateVolumeFromEvent(e.clientX, rect);
    };

    // hangerő állítása drag-re
    const handleVolumeDragMove = (e: MouseEvent) => {
        if (!isDragging) return;
        if (volumeWrapperRef.current) {
            const rect = volumeWrapperRef.current.getBoundingClientRect();
            updateVolumeFromEvent(e.clientX, rect);
        }
    };

    // egér elengedése
    const handleVolumeDragEnd = () => {
        setIsDragging(false);
    };

    // globális event listener a drag-hez
    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleVolumeDragMove);
            window.addEventListener("mouseup", handleVolumeDragEnd);
        }
        return () => {
            window.removeEventListener("mousemove", handleVolumeDragMove);
            window.removeEventListener("mouseup", handleVolumeDragEnd);
        };
    }, [isDragging]);

    return {
        volume,
        setVolume,
        isDragging,
        volumeWrapperRef,
        handleVolumeChanger,
        adjustVolume,
        handleVolumeDragStart,
        updateVolume
    };
};