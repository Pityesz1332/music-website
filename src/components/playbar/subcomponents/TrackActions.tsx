import { TimerReset, Repeat, Heart, Download } from "lucide-react";
import { PrimaryButton } from "../../ui/button/PrimaryButton";
import { VolumeControl } from "./VolumeControl";
import { PLAYBAR_STRINGS } from "../../../constant-strings/ui/playbar";
import { NotificationType } from "../../../context/NotificationContext";
import type { Song } from "../../../types/music";

interface TrackActionsProps {
    volume: number;
    volumeWrapperRef: React.RefObject<HTMLDivElement | null>;
    handleVolumeDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
    handleVolumeChanger: (e: React.ChangeEvent<HTMLInputElement>) => void;
    adjustVolume: (delta: number) => void;
    resetSong: () => void;
    isLooping: boolean;
    setIsLooping: (value: boolean) => void;
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
    setIsLooping,
    isConnected,
    isSaved,
    song,
    removeSavedSong,
    saveSong,
    notify
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
                    <PrimaryButton className={`playbar__extra-button ${isLooping ? "playbar__extra-button--active" : ""}`} onClick={() => setIsLooping(!isLooping)}>
                        <Repeat size={20} />
                    </PrimaryButton>
                </div>

                {isConnected && (
                    <div className="playbar__connected-buttons">
                        <PrimaryButton
                            className={`playbar__save-button ${isSaved ? "playbar__save-button--saved" : ""}`}  
                            onClick={() => {
                                if (isSaved) {
                                    removeSavedSong(song.id);
                                    notify(PLAYBAR_STRINGS.MESSAGES.DELETED, NotificationType.SUCCESS);
                                } else {
                                    saveSong(song);
                                    notify(PLAYBAR_STRINGS.MESSAGES.SAVED, NotificationType.SUCCESS);
                                }
                            }}>
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