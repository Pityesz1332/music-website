import { SONG_PAGE_STRINGS } from "@i18n/ui/song-page";
import type { Song } from "@interfaces/music";
import "./SongMainInfo.scss";

interface SongCoverProps {
    currentSong: Song;
    isPlaying: boolean;
}

interface SongDetailsProps {
    currentSong: Song;
}

// visual display of song
export const SongMainInfo = {
    Cover: ({ currentSong, isPlaying }: SongCoverProps) => (
        <div className="song-page__cover-wrapper">
            <img 
                src={currentSong.cover} 
                alt={currentSong.title} 
                className="song-page__main-cover"
            />
            <div className={`song-page__glow ${isPlaying ? "song-page__glow--active" : ""}`}></div>
        </div>
    ),

    Details: ({ currentSong }: SongDetailsProps) => (
        <div className="song-page__info-text">
            <h1 className="song-page__title">{currentSong.title}</h1>
            <h2 className="song-page__artist">{currentSong.artist}</h2>
            <p className="song-page__meta">
                {SONG_PAGE_STRINGS.INFO.GENRE}
                <span className="song-page__meta-value">{currentSong.genre}</span>
            </p>
            <p className="song-page__meta">
                {SONG_PAGE_STRINGS.INFO.DURATION}
                <span className="song-page__meta-value">{currentSong.duration}</span>
            </p>
        </div>
    )
};

// debugging:
// SongMainInfo.Cover.displayName = "SongMainInfo.Cover";
// SongMainInfo.Details.displayName = "SongMainInfo.Details";