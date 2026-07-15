import { useState, useEffect, RefObject, useRef } from "react";

export const useVolumeControl = (audioRef: RefObject<HTMLAudioElement>) => {
    const [volume, setVolume] = useState<number>(1);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const volumeWrapperRef = useRef<HTMLDivElement>(null);

    // Central volume controller.
    const updateVolume = (val: number) => {
        const newVol = Math.min(Math.max(val, 0), 1);
        setVolume(newVol);
        if (audioRef.current) {
            audioRef.current.volume = newVol;
        }
    };

    // because of input type="range"
    const handleVolumeChanger = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateVolume(parseFloat(e.target.value));
    };

    // volume control with button
    const adjustVolume = (direction: number) => {
        const step = 0.05;
        updateVolume(volume - direction * step);
    };

    // Calculate the slider position percentage.
    const updateVolumeFromEvent = (clientX: number, rect: DOMRect) => {
        const x = clientX - rect.left;
        const percent = x / rect.width;
        updateVolume(percent);
    };

    // Grab the slider.
    const handleVolumeDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setIsDragging(true);
        updateVolumeFromEvent(e.clientX, rect);
    };

    // Adjust volume on drag.
    const handleVolumeDragMove = (e: MouseEvent) => {
        if (!isDragging) return;
        if (volumeWrapperRef.current) {
            const rect = volumeWrapperRef.current.getBoundingClientRect();
            updateVolumeFromEvent(e.clientX, rect);
        }
    };

    // Release mouse button.
    const handleVolumeDragEnd = () => {
        setIsDragging(false);
    };

    // gloval event listener for dragging
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
        handleVolumeDragStart, handleVolumeDragEnd,
        updateVolume
    };
};