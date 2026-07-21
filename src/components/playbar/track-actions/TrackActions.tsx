import { TimerReset, Repeat, Shuffle } from "lucide-react";
import { PrimaryButton } from "../../ui/button/PrimaryButton";
import { VolumeControl } from "../volume-control/VolumeControl";
import { NotificationType } from "@context/NotificationContext";
import type { Song } from "@interfaces/music";

interface TrackActionsProps {
    volume: number;
    volumeWrapperRef: React.RefObject<HTMLDivElement | null>;
    handleVolumeDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
    handleVolumeChanger: (e: React.ChangeEvent<HTMLInputElement>) => void;
    adjustVolume: (delta: number) => void;
    resetSong: () => void;
    isLooping: boolean;
    onToggleLoop: () => void;
    isShuffle: boolean;
    onToggleShuffle: () => void;
    isConnected: boolean;
    isSaved: boolean;
    song: Song;
    removeSavedSong: (id: string) => void;
    saveSong: (song: any) => void;
    notify: (message: string, type: NotificationType) => void;
}

export const TrackActions = ({
    volume,
    volumeWrapperRef,
    handleVolumeDragStart,
    handleVolumeChanger,
    adjustVolume,
    resetSong,
    isLooping,
    onToggleLoop,
    isShuffle,
    onToggleShuffle,
}: TrackActionsProps) => {
    return (
        <div className="playbar__right-container">
            <div className="playbar__extra">
                <VolumeControl
                    volume={volume}
                    volumeWrapperRef={volumeWrapperRef}
                    handleVolumeDragStart={handleVolumeDragStart}
                    handleVolumeChanger={handleVolumeChanger}
                    adjustVolume={adjustVolume}
                />

                <div className="playbar__extra-buttons">
                    <PrimaryButton className="playbar__reset-seeker" onClick={resetSong}>
                        <TimerReset size={20} />
                    </PrimaryButton>
                    <PrimaryButton className={`playbar__extra-button ${isLooping ? "playbar__extra-button--active" : ""}`} onClick={onToggleLoop}>
                        <Repeat size={20} />
                    </PrimaryButton>
                    <PrimaryButton className={`playbar__extra-button ${isShuffle ? "playbar__extra-button--active" : ""}`} onClick={onToggleShuffle}>
                        <Shuffle size={20} />
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};
