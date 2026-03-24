import { formatTime } from "@utils/formatTime";
import type { Song } from "@interfaces/music";

interface SongDetailsProps {
    song: Song;
    currentTime: number;
}

export const SongDetails = ({ song, currentTime }: SongDetailsProps) => {
    return (
        <div className="playbar__left">
            <img src={song.cover} alt={song.title} className="playbar__cover" />
            <div className="playbar__info">
                <h4 className="playbar__title">{song.title}</h4>
                <p className="playbar__artist">{song.artist}</p>
            </div>
            <div className="playbar__time-container">
                <span className="playbar__time">
                    {formatTime(currentTime)} / {song.duration}
                </span>
            </div>
        </div>
    );
};