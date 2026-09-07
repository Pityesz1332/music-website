import { Heart, Download } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { useSongActions } from "@hooks/playlist/useSongActions";
import type { Song } from "@interfaces/music";
import "./SongActions.scss";

interface SongActionsProps {
    song: Song;
    isMini?: boolean;
}

// Displays save/download interaction buttons for the song.
export const SongActions = ({ song, isMini = false }: SongActionsProps) => {
    const {
        isSaved,
        containerClass,
        buttonClass,
        saveModifier,
        iconSize,
        handleSave,
        handleDownload
    } = useSongActions(song, isMini);

    return (
        <div className={containerClass}>
            <PrimaryButton
                className={`${buttonClass} ${isSaved ? saveModifier : ""}`}
                onClick={handleSave}
            >
                <Heart size={iconSize} />
            </PrimaryButton>

            <PrimaryButton
                className={buttonClass}
                onClick={handleDownload}
            >
                <Download size={iconSize} />
            </PrimaryButton>
        </div>
    );
};