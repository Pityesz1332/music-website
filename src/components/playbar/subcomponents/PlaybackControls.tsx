import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "../../ui/button/Button";

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
            <Button className="playbar__control-button" onClick={onPrev}>
                <SkipBack size={24} />
            </Button>

            <Button className="playbar__control-button playbar__control-button--main" onClick={handlePlay}>
                {isLoading ? (
                    <div className="playbar__loader"></div>
                ) : isPlaying ? (
                    <Pause size={28} />
                ) : (
                    <Play size={28} />
                )}
            </Button>
            
            <Button className="playbar__control-button" onClick={onNext}>
                <SkipForward size={24} />
            </Button>
        </div>
    );
};