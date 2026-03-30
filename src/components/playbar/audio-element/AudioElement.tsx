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

    // adatbetöltés kezelése
    const handleLoadedData = () => {
        setIsLoading(false);
    };

    // külső vezérlés szinkronizálása.
    // ha natív felületen indítják el a zenét, 
    // ezzel a függvénnyel kényzerítjük a react állapotunkat, 
    // hogy maradjon szinkronban.
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