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
    return (
        <audio
            src={songSrc}
            ref={audioRef}
            loop={isLooping}
            preload="metadata"
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={resetSong}
            onLoadedData={() => setIsLoading(false)}
            onPlay={() => {
                setIsLoading(false);
                if (!isPlaying) onPlayPause();
            }}
            onPause={() => {
                if (isPlaying) onPlayPause();
            }}
            onEnded={onNext}
        />
    );
};