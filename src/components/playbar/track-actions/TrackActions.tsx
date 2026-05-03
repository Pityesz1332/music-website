import { TimerReset, Repeat, Heart, Download } from "lucide-react";
import { PrimaryButton } from "../../ui/button/PrimaryButton";
import { VolumeControl } from "../volume-control/VolumeControl";
import { PLAYBAR_STRINGS } from "@i18n/ui/playbar";
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
    isConnected: boolean;
    isSaved: boolean;
    song: Song;
    removeSavedSong: (id: string) => void;
    saveSong: (song: any) => void;
    notify: (message: string, type: NotificationType) => void;
}

// playbar right side
// separated because these functions depend on 
// external states (authentication status)
export const TrackActions = ({
    volume,
    volumeWrapperRef,
    handleVolumeDragStart,
    handleVolumeChanger,
    adjustVolume,
    resetSong,
    isLooping,
    onToggleLoop,
    isConnected,
    isSaved,
    song,
    removeSavedSong,
    saveSong,
    notify
}: TrackActionsProps) => {
    // saving song + UI feedback
    const handleSaveToggle = () => {
        if (isSaved) {
            removeSavedSong(song.id);
            notify(PLAYBAR_STRINGS.MESSAGES.DELETED, NotificationType.SUCCESS);
        } else {
            saveSong(song);
            notify(PLAYBAR_STRINGS.MESSAGES.SAVED, NotificationType.SUCCESS);
        }
    };

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
                </div>

                {isConnected && (
                    <div className="playbar__connected-buttons">
                        <PrimaryButton
                            className={`playbar__save-button ${isSaved ? "playbar__save-button--saved" : ""}`}  
                            onClick={handleSaveToggle}>
                            <Heart size={20} />
                        </PrimaryButton>
                        <PrimaryButton className="playbar__download-button">
                            <Download size={20} />
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </div>
    );
};