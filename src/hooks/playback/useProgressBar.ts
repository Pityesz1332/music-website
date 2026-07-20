import { useState, RefObject, useEffect, useRef, useCallback } from "react";

export const useProgressBar = (audioRef: RefObject<HTMLAudioElement>) => {
    const [progress, setProgress] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverPos, setHoverPos] = useState<number>(0);

    const progressBarRef = useRef<HTMLDivElement>(null);
    const seekTimeRef = useRef<number>(0);

    // Updating the slider as playback progresses.
    const handleTimeUpdate = useCallback(() => {
        if (isSeeking || !audioRef.current) return;
        const audio = audioRef.current;
        setCurrentTime(audio.currentTime);
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(percent || 0);
    }, [isSeeking, audioRef]);

    // Calculating percentage and timestamp based on the X coordinate.
    const calculateTimeFromX = (clientX: number, target: HTMLElement) => {
        const rect = target.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.min(Math.max(x / rect.width, 0), 1);
        return { percent, time: percent * (audioRef.current?.duration || 0), x };
    };

    // Initialize seeking on progress bar click.
    const startSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        setIsSeeking(true);
        const { percent, time } = calculateTimeFromX(e.clientX, e.currentTarget);
        setProgress(percent * 100);
        seekTimeRef.current = time;
    };

    // hover
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const { time, x } = calculateTimeFromX(e.clientX, e.currentTarget);
        setHoverTime(time);
        setHoverPos(x);
    };

    const handleMouseLeave = () => setHoverTime(null);

    // reset
    const resetSong = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setProgress(0);
            setCurrentTime(0);
        }
    }, [audioRef]);

    // Handle global mouse movement if the cursor leaves the progress bar while dragging.
    // Using useCallback to prevent infinite re-renders.
    const handleGlobalMove = useCallback((e: MouseEvent) => {
        if (!isSeeking || !audioRef.current || !progressBarRef.current) return;
        const { percent, time } = calculateTimeFromX(e.clientX, progressBarRef.current);
        setProgress(percent * 100);
        setCurrentTime(time);
        seekTimeRef.current = time;
    }, [isSeeking, audioRef]);

    // event listeners for seeking
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