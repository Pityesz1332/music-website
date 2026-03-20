import type { Song } from "../../../types/music";

interface BackgroundProps {
    currentSong: Song;
    isPlaying: boolean;
}

export const Background = ({ currentSong, isPlaying }: BackgroundProps) => {
    const videoConfigs = [
        { id: "default", src: currentSong.defaultBgVideo, showWhenPlaying: false },
        { id: "playing", src: currentSong.playingBgVideo, showWhenPlaying: true }
    ];

    return (
        <>
            {videoConfigs.map((video) => (
                <video
                    key={`${video.id}-${currentSong.id}`}
                    src={video.src}
                    autoPlay loop muted
                    className={`song-page__video ${
                        isPlaying === video.showWhenPlaying
                            ? "song-page__video--fade-in"
                            : "song-page__video--fade-out"
                    }`}
                />
            ))}
        </>
    );
};