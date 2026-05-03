import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { PrimaryButton } from "../../ui/button/PrimaryButton";

interface PlaybackControlsProps {
    onPrev: () => void;
    onNext: () => void;
    handlePlay: () => void;
    isLoading: boolean;
    isPlaying: boolean;
}

export const PlaybackControls = ({
    onPrev,
    onNext,
    handlePlay,
    isLoading,
    isPlaying
}: PlaybackControlsProps) => {
    return (
        <div className="playbar__controls">
            <PrimaryButton className="playbar__control-button" onClick={onPrev}>
                <SkipBack size={24} />
            </PrimaryButton>

            <PrimaryButton className="playbar__control-button playbar__control-button--main" onClick={handlePlay}>
                {isLoading ? (
                    <div className="playbar__loader"></div>
                ) : isPlaying ? (
                    <Pause size={28} />
                ) : (
                    <Play size={28} />
                )}
            </PrimaryButton>
            
            <PrimaryButton className="playbar__control-button" onClick={onNext}>
                <SkipForward size={24} />
            </PrimaryButton>
        </div>
    );
};