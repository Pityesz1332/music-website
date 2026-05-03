import { ScrollToTop } from "@components/scroll-to-top/ScrollToTop";
import { useMusic } from "@context/MusicContext";
import { useLoading } from "@context/LoadingContext";
import { useSongInit } from "@hooks/playback/useSongInit";
import { SONG_PAGE_STRINGS } from "@i18n/ui/song-page";
import { Background } from "./background/Background";
import { SongMainInfo } from "./song-info/SongMainInfo";
import { PlaybackControls } from "./playback-controls/PlaybackControls";
import { SongActions } from "./song-actions/SongActions";
import { PlaylistSection } from "./playlist/playlist-section/PlaylistSection";
import "./SongPage.scss";

export const SongPage = () => {
    const {
        currentSong, isPlaying, playlist,
        togglePlay, setPlaylist, nextSong, prevSong
    } = useMusic();
    const { isLoading } = useLoading();

    useSongInit({ playlist, setPlaylist });

    if (isLoading) {
        return ( 
            <div className="song-page song-page--loading">
                <div className="song-page__spinner"></div>
            </div>
        );
    }

    if (!currentSong) {
        return (
            <div className="song-page">
                <p className="song-page__not-found">{SONG_PAGE_STRINGS.ERROR.NOT_FOUND}</p>
            </div>
        );
    }

    return (
        <div className="song-page">
            <Background currentSong={currentSong} isPlaying={isPlaying} />
        
            <div className="song-page__content">
                <SongMainInfo.Cover currentSong={currentSong} isPlaying={isPlaying} />

                <div className="song-page__info song-page__info--glass">
                    <SongMainInfo.Details currentSong={currentSong} />

                    <PlaybackControls
                        isPlaying={isPlaying}
                        onPrev={prevSong}
                        onNext={nextSong}
                        onTogglePlay={togglePlay}
                    />

                    {/* save and download, only for connected users */}
                    <SongActions song={currentSong} />
                </div>
            </div>
            
            {/* playlist */}
            <PlaylistSection  />

            {/* scrolling to the top of the page automatically */}
            <ScrollToTop />
        </div>
    );
};