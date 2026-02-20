import type { Song } from "../../../types/music";

interface RecentlyPlayedCardProps {
    item: Song;
    fade: boolean;
    onPlay: (item: Song) => void;
}

export const RecentlyPlayedCard = ({ item, fade, onPlay }: RecentlyPlayedCardProps) => {
    return (
        <section className="recently-played">
            <h2 className="recently-played__title">Recently Played</h2>
        
            <div
                className={`recently-played__card ${fade ? '' : 'recently-played__card--faded'}`}
                onClick={() => onPlay(item)}
            >
                <div className="recently-played__image-container">
                    <img src={item?.cover} alt={item?.title} className="recently-played__image" />
                </div>

                <div className="recently-played__info">
                    <span className="recently-played__artist">{item.artist}</span>
                    <h3 className="recently-played__song-title">{item.title}</h3>
                </div>
            </div>
        </section>
    );
};