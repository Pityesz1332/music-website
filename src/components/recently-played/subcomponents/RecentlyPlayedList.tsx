import type { Song } from "../../../types/music";
import { RECENTLY_PLAYED_STRINGS } from "../../../constant-strings/ui/recentlyPlayed";

interface RecentlyPlayedListProps {
    songs: Song[];
    onPlay: (song: Song) => void;
}

export const RecentlyPlayedList = ({songs, onPlay}: RecentlyPlayedListProps) => {
    return (
        <section className="recently-played__list">
            <h2 className="recently-played__title">{RECENTLY_PLAYED_STRINGS.TITLE}</h2>
            <div className="recently-played__list-container">
                {songs.map((song) => (
                    <div key={song.id} onClick={() => onPlay(song)} className="recently-played__item">
                        <img src={song.cover} alt={song.title} className="recently-played__item-image" />
                        <div className="recently-played__item-info">
                            <span className="recently-played__item-title">{song.title}</span>
                            <span className="recently-played__item-artist">{song.artist}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}