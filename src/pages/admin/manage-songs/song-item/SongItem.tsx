import { Eye, EyeOff } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import type { Song } from "@interfaces/music";
import "./SongItem.scss";

interface SongItemProps {
    song: Song;
    onHide: (id: string) => void;
    onUnhide: (id: string) => void;
}

export const SongItem = ({ song, onHide, onUnhide }: SongItemProps) => {
    const isHidden = !!song.hidden;

    return (
        <div className={`song-item${isHidden ? " song-item--hidden" : ""}`}>
            <div className="song-item__info">
                <span className="song-item__id">#{song.id}</span>
                <img src={song.cover} alt={song.title} className="song-item__cover" />
            </div>

            <p className="song-item__title">{song.title}</p>

            <p className="song-item__artist">{song.artist}</p>

            <span className="song-item__genre">{song.genre}</span>

            <span className="song-item__duration">{song.duration}</span>

            <div className="song-item__actions">
                {isHidden ? (
                    <PrimaryButton onClick={() => onUnhide(song.id)} className="btn--unhide">
                        <Eye size={16} />
                    </PrimaryButton>
                ) : (
                    <PrimaryButton onClick={() => onHide(song.id)} className="btn--hide">
                        <EyeOff size={16} />
                    </PrimaryButton>
                )}
            </div>
        </div>
    );
};
