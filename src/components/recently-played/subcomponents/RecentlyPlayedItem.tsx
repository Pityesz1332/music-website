import React from "react";
import type { Song } from "../../../types/music";

interface RecentlyPlayedItemProps {
    song: Song;
    onPlay: (song: Song) => void;
}

export const RecentlyPlayedItem = React.memo(({ song, onPlay }: RecentlyPlayedItemProps) => {
    return (
        <button
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
        </button>
    );
});

// Debugging miatt
RecentlyPlayedItem.displayName = "RecentlyPlayedItem";