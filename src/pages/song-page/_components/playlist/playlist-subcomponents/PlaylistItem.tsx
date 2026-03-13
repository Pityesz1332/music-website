import { ChevronUp, ChevronDown, X } from "lucide-react";
import { SongActions } from "../../SongActions";
import { PrimaryButton } from "../../../../../components/ui/button/PrimaryButton";
import type { Song } from "../../../../../types/music";

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
    setItemRef: (id: string, el: HTMLDivElement | null) => void;
}

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
    setItemRef
}: PlaylistItemProps) => {
    return (
        <div
            ref={(el) => setItemRef(song.id, el)}
            className={`song-page__mini-card ${isCurrent ? "song-page__mini-card--active" : ""}`}
            onClick={() => onSongClick(song)}
            onContextMenu={(e) => onContextMenu(e, song.id)}
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
                        onClick={(e) => onMove(e, "up", song.id)}
                        className="song-page__move-btn"
                    >
                        <ChevronUp size={16} />
                    </PrimaryButton>
                    <PrimaryButton onClick={(e) => onCloseEdit(e)}>
                        <X size={16} />
                    </PrimaryButton>
                    <PrimaryButton
                        disabled={index === playlistLength - 1}
                        onClick={(e) => onMove(e, "down", song.id)}
                        className="song-page__move-btn"
                    >
                        <ChevronDown size={16} />
                    </PrimaryButton>
                </div>
            )}
        </div>
    );
};