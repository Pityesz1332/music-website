import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { SONG_PAGE_STRINGS } from "@i18n/ui/song-page";

interface PlaybackControlsProps {
    isPlaying: boolean;
    onPrev: () => void;
    onNext: () => void;
    onTogglePlay: () => void;
}

// songpage gombjait tartalmazó csoport (lejátszás) 
// ez a komponens nem tudja, hogyan kell lejátszani,
// csak azt, hogy melyik gombot nyomták meg. 
export const PlaybackControls = ({ isPlaying, onPrev, onNext, onTogglePlay }: PlaybackControlsProps) => {
    return (
        <div className="song-page__controls">
            <PrimaryButton 
                className="song-page__nav-button" 
                onClick={onPrev}>
                <SkipBack size={20} />
            </PrimaryButton>
            
            <PrimaryButton
                className={`song-page__play-button song-page__play-button--neon-button ${isPlaying ? "song-page__play-button--playing" : ""}`}
                onClick={onTogglePlay}
            >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isPlaying ? SONG_PAGE_STRINGS.CONTROLS.STOP : SONG_PAGE_STRINGS.CONTROLS.PLAY}
            </PrimaryButton>

            <PrimaryButton className="song-page__nav-button" onClick={onNext}>
                <SkipForward size={20} />
            </PrimaryButton>
        </div>
    );
}