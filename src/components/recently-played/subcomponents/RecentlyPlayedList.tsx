import type { Song } from "../../../types/music";
import { RECENTLY_PLAYED_STRINGS } from "../../../constant-strings/ui/recentlyPlayed";
import { RecentlyPlayedItem } from "./RecentlyPlayedItem";

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
                    <RecentlyPlayedItem 
                        key={song.id}
                        song={song}
                        onPlay={onPlay}
                    />
                ))}
            </div>
        </section>
    );
}