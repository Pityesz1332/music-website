// Csak bejelentkezett felhasználók
import { Heart, Download } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { useMusic } from "@context/MusicContext";
import { useToggleSave } from "@hooks/music/useToggleSave";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import type { Song } from "@interfaces/music";

interface SongActionsProps {
    song: Song;
    isMini?: boolean;
}

export const SongActions = ({ song, isMini = false }: SongActionsProps) => {
    const auth = useAuth();
    const { savedSongs } = useMusic();
    const { toggleSave } = useToggleSave();

    const isConnected = auth?.isConnected;
    if (!isConnected) return null;

    const isSaved = savedSongs.some((s) => s.id === song.id);

    const containerClass = isMini ? "song-page__card-actions" : "song-page__actions";
    const buttonClass = isMini ? "song-page__card-action-btn" : "song-page__action-button";
    const saveModifier = isMini ? "song-page__card-action-btn--saved" : "song-page__action-button--saved";
    const iconSize = isMini ? 16 : 24;

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleSave(song);
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        // letöltési logika majd
    };

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