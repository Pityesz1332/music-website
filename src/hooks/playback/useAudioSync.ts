import { useState, useEffect, useCallback, RefObject } from "react";
import { useMusic } from "@context/MusicContext";

export const useAudioSync = (
    audioRef: RefObject<HTMLAudioElement>,
    resetSong: () => void
) => {
    const { isPlaying, currentSong, togglePlay } = useMusic();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handlePlay = useCallback(() => {
        if (!currentSong) return;

        if (!isPlaying) {
            setIsLoading(true);
        }
        togglePlay();
    }, [isPlaying, togglePlay, currentSong]);

    const handleLoadedMetadata = useCallback(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        resetSong();

        const autoPlay = () => {
            if (isPlaying) {
                audio.play().catch(err => console.error("Autoplay failed: ", err));
            }
        };

        audio.load();
        audio.addEventListener("canplay", autoPlay);

        return () => audio.removeEventListener("canplay", autoPlay);
    }, [currentSong?.src, resetSong]);

    // play-pause logic
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying && audio.paused) {
            audio.play().catch(err => console.error("Playing failed: ", err));
        } else if (!isPlaying && !audio.paused) {
            audio.pause();
        }
    }, [isPlaying]);

    return {
        isLoading,
        handlePlay,
        handleLoadedMetadata,
        isPlaying,
        song: currentSong
    };
};