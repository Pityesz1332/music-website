import { useState, RefObject, useEffect, useRef, useCallback } from "react";

// progress bar hook, kezeli a tekerést, iőszámítást és a hover állapotot
export const useProgressBar = (audioRef: RefObject<HTMLAudioElement>) => {
    const [progress, setProgress] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverPos, setHoverPos] = useState<number>(0);

    // ref használata queryselector helyett
    const progressBarRef = useRef<HTMLDivElement>(null);
    const seekTimeRef = useRef<number>(0);

    // frissítjük a csúszkát, ahogy halad a zene
    const handleTimeUpdate = () => {
        if (isSeeking || !audioRef.current) return;
        const audio = audioRef.current;
        setCurrentTime(audio.currentTime);
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(percent || 0);
    };

    // kiszámoljuk az X koordinátából, hogy hány %, mennyi idő
    const calculateTimeFromX = (clientX: number, target: HTMLElement) => {
        const rect = target.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.min(Math.max(x / rect.width, 0), 1);
        return { percent, time: percent * (audioRef.current?.duration || 0), x };
    };

    // progress bar-ra kattintásra tekerés indítása
    const startSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        setIsSeeking(true);
        const { percent, time } = calculateTimeFromX(e.clientX, e.currentTarget);
        setProgress(percent * 100);
        seekTimeRef.current = time;
    };

    // hover állapotban mutatja, hogy hol tartana a zene
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const { time, x } = calculateTimeFromX(e.clientX, e.currentTarget);
        setHoverTime(time);
        setHoverPos(x);
    };

    const handleMouseLeave = () => setHoverTime(null);

    // sima reset
    const resetSong = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setProgress(0);
            setCurrentTime(0);
        }
    };

    // globális egérmozgatás kezelése, ha húzás közben elhagyjuk a progress bar-t
    // useCallback-kel, mert így elkerüljük az infinite loop-ot
    const handleGlobalMove = useCallback((e: MouseEvent) => {
        if (!isSeeking || !audioRef.current || !progressBarRef.current) return;
        const { percent, time } = calculateTimeFromX(e.clientX, progressBarRef.current);
        setProgress(percent * 100);
        setCurrentTime(time);
        seekTimeRef.current = time;
    }, [isSeeking, audioRef]);

    // event listener-ek a tekeréshez
    useEffect(() => {
        const handleGlobalUp = () => {
            if (isSeeking && audioRef.current) {
                audioRef.current.currentTime = seekTimeRef.current;
                setIsSeeking(false);
            }
        };
    
        if (isSeeking) {
            window.addEventListener("mousemove", handleGlobalMove);
            window.addEventListener("mouseup", handleGlobalUp);
        }
    
        return () => {
            window.removeEventListener("mousemove", handleGlobalMove);
            window.removeEventListener("mouseup", handleGlobalUp);
        };
    }, [isSeeking]);

    return {
        progress, setProgress,
        currentTime, setCurrentTime,
        isSeeking, setIsSeeking,
        hoverTime, hoverPos,
        progressBarRef,
        handleTimeUpdate,
        startSeek,
        handleMouseMove,
        handleMouseLeave,
        resetSong,
        calculateTimeFromX
    };
};