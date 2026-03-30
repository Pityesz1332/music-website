import type { Song } from "@interfaces/music";

interface SongsCardProps {
    song: Song;
    onClick: (song: Song) => void;
}

// zenék kártyája
export const SongsCard = ({ song, onClick }: SongsCardProps) => {
    return (
        <div className="songs__card-wrapper">
            <div
                className="songs__card"
                onClick={() => onClick(song)}
            >
                <img className="songs__card-image" src={song.cover} alt={song.title} loading="lazy" />
                <h3 className="songs__card-title">{song.title}</h3>
                <p className="songs__card-genre">{song.genre}</p>
            </div>
        </div>
    );
};