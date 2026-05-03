import { Edit, Trash2 } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import type { Song } from "@interfaces/music";
import "./SongItem.scss";

interface SongItemProps {
    song: Song;
    onEdit: (song: Song) => void;
    onDelete: (id: string) => void;
}

export const SongItem = ({ song, onEdit, onDelete }: SongItemProps) => {
    return (
        <div className="song-item">
            <div className="song-item__info">
                <span className="song-item__id">#{song.id}</span>
                <img src={song.cover} alt={song.title} className="song-item__cover" />
            </div>

            <p className="song-item__title">{song.title}</p>

            <p className="song-item__artist">{song.artist}</p>

            <span className="song-item__genre">{song.genre}</span>

            <span className="song-item__duration">{song.duration}</span>

            <div className="song-item__actions">
                <PrimaryButton onClick={() => onEdit(song)} className="btn--edit">
                    <Edit size={16} />
                </PrimaryButton>
                <PrimaryButton onClick={() => onDelete(song.id)} className="btn--delete">
                    <Trash2 size={16} />
                </PrimaryButton>
            </div>
        </div>
    );
};