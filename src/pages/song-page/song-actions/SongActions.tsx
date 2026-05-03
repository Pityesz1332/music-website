// Csak bejelentkezett felhasználók
import { Heart, Download } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { useSongActions } from "@hooks/playlist/useSongActions";
import type { Song } from "@interfaces/music";
import "./SongActions.scss";

interface SongActionsProps {
    song: Song;
    isMini?: boolean;
}

// Displays interaction buttons for the song.
// Features a security filter that renders buttons based on 
// the user's authentication state.
export const SongActions = ({ song, isMini = false }: SongActionsProps) => {
    const {
        isConnected,
        isSaved,
        containerClass,
        buttonClass,
        saveModifier,
        iconSize,
        handleSave,
        handleDownload
    } = useSongActions(song, isMini);

    if (!isConnected) return null;

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