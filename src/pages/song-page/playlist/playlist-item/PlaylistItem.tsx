import { ChevronUp, ChevronDown, X } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import type { Song } from "@interfaces/music";
import { SongActions } from "../../song-actions/SongActions";

interface PlaylistItemProps {
    song: Song;
    isCurrent: boolean;
    isEditing: boolean;
    playlistLength: number;
    index: number;
    onSongClick: (song: Song) => void;
    onContextMenu: (e: React.MouseEvent, id: string) => void;
    onMove: (e: React.MouseEvent, direction: "up" | "down", id: string) => void;
    onCloseEdit: (e: React.MouseEvent) => void;
    itemRef: (id: string, el: HTMLDivElement | null) => void;
}

// kártya, ami támogatja a lejátszást, a kontextus menüt 
// és a manuális sorrendezést
export const PlaylistItem = ({
    song,
    isCurrent,
    isEditing,
    playlistLength,
    index,
    onSongClick,
    onContextMenu,
    onMove,
    onCloseEdit,
    itemRef
}: PlaylistItemProps) => {

    const handleRef = (el: HTMLDivElement | null) => {
        itemRef(song.id, el);
    };

    const handleClick = () => {
        onSongClick(song);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        onContextMenu(e, song.id);
    };

    const handleMoveUp = (e: React.MouseEvent) => {
        e.stopPropagation();
        onMove(e, "up", song.id);
    };

    const handleMoveDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        onMove(e, "down", song.id);
    };

    return (
        <div
            ref={handleRef}
            className={`song-page__mini-card ${isCurrent ? "song-page__mini-card--active" : ""}`}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
        >
            <img className="song-page__card-image" src={song.cover} alt={song.title} />
            <div className="song-page__card-info">
                <p className="song-page__card-title">{song.title}</p>
            </div>

            <SongActions song={song} isMini={true} />
                        
            {/* zenék mozgatása a playlist-en */}
            {isEditing && (
                <div className="song-page__edit-controls">
                    <PrimaryButton
                        disabled={index === 0}
                        onClick={handleMoveUp}
                        className="song-page__move-btn"
                    >
                        <ChevronUp size={16} />
                    </PrimaryButton>
                    <PrimaryButton onClick={onCloseEdit}>
                        <X size={16} />
                    </PrimaryButton>
                    <PrimaryButton
                        disabled={index === playlistLength - 1}
                        onClick={handleMoveDown}
                        className="song-page__move-btn"
                    >
                        <ChevronDown size={16} />
                    </PrimaryButton>
                </div>
            )}
        </div>
    );
};