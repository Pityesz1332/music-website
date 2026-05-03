import { RefObject } from "react";

interface AudioElementProps {
    audioRef: RefObject<HTMLAudioElement | null>;
    songSrc: string;
    isLooping: boolean;
    isPlaying: boolean;
    onTimeUpdate: () => void;
    resetSong: () => void;
    onLoaded: () => void;
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
    onLoaded,
    onPlayPause,
    onNext
}: AudioElementProps) => {

    const handleLoadedData = () => {
        onLoaded();
    };

    // Synchronizing external control.
    // If music is started from a native interface,
    // this function forces the react state to stay in sync.
    const handlePlay = () => {
        onLoaded();
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