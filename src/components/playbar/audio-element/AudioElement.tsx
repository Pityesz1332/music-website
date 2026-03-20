import { RefObject } from "react";

interface AudioElementProps {
    audioRef: RefObject<HTMLAudioElement | null>;
    songSrc: string;
    isLooping: boolean;
    isPlaying: boolean;
    onTimeUpdate: () => void;
    resetSong: () => void;
    setIsLoading: (loading: boolean) => void;
    onPlayPause: () => void;
    onNext: () => void;
}

export const AudioElement = ({
    audioRef,
    songSrc,
    isLooping,
    isPlaying,
    onTimeUpdate,
    resetSong,
    setIsLoading,
    onPlayPause,
    onNext
}: AudioElementProps) => {

    const handleLoadedData = () => {
        setIsLoading(false);
    };

    const handlePlay = () => {
        setIsLoading(false);
        if (!isPlaying) {
            onPlayPause();
        }
    };

    const handlePause = () => {
        if (isPlaying) {
            onPlayPause();
        }
    };

    return (
        <audio
            src={songSrc}
            ref={audioRef}
            loop={isLooping}
            preload="metadata"
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={resetSong}
            onLoadedData={handleLoadedData}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={onNext}
        />
    );
};