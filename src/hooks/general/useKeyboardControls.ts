import { useEffect } from "react";

interface KeyboardControlsProp {
    audioRef: React.RefObject<HTMLAudioElement>;
    isPlaying: boolean;
    volume: number;
    updateVolume: (newVolume: number) => void;
    handlePlay: () => void;
    songExist: boolean;
}

export const useKeyboardControls = ({
    audioRef,
    isPlaying,
    volume,
    updateVolume,
    handlePlay,
    songExist
}: KeyboardControlsProp) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (!audioRef.current || !songExist) return;
            const audio = audioRef.current;

            switch (e.code) {
                case "Space":
                    e.preventDefault();
                    handlePlay();
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    updateVolume(Math.min(volume + 0.1, 1));
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    updateVolume(Math.max(volume - 0.1, 0));
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    audio.currentTime = Math.max(audio.currentTime - 5, 0);
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    audio.currentTime = Math.min(audio.currentTime + 5, audio.duration || 0);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPlaying, volume, handlePlay, songExist, updateVolume, audioRef]);
};