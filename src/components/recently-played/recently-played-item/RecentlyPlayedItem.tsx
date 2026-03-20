import type { Song } from "../../../types/music";
import { PrimaryButton } from "../../ui/button/PrimaryButton";

interface RecentlyPlayedItemProps {
    song: Song;
    onPlay: (song: Song) => void;
}

export const RecentlyPlayedItem = ({ song, onPlay }: RecentlyPlayedItemProps) => {
    return (
        <PrimaryButton
            type="button"
            className="recently-played__item"
            onClick={() => onPlay(song)}
        >
            <img 
                src={song.cover}
                alt={song.title}
                className="recently-played__item-image"
            />
            <div className="recently-played__item-info">
                <span className="recently-played__item-title">{song.title}</span>
                <span className="recently-played__item-artist">{song.artist}</span>
            </div>
        </PrimaryButton>
    );
};