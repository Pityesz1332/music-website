import { useMusic } from "../../context/MusicContext";
import { useSongInit } from "../../hooks/audio/useSongInit";
import { Background } from "./subcomponents/background";
import { SongMainInfo } from "./subcomponents/SongMainInfo";
import { PlaybackControls } from "./subcomponents/PlaybackControls";
import { SongActions } from "./subcomponents/SongActions";
import { PlaylistSection } from "./subcomponents/PlaylistSection";
import { ScrollToTop } from "../../components/scroll-to-top/ScrollToTop";
import { SONG_PAGE_STRINGS } from "../../constant-strings/ui/songPage";
import "./SongPage.scss";

export const SongPage = () => {
    const {
        currentSong, isPlaying, playlist,
        togglePlay, setPlaylist, nextSong, prevSong
    } = useMusic();

    useSongInit({ playlist, setPlaylist });

    // hibakezelés, ha nem találjuk az adott zenét
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

                    {/* mentés és letöltés, csak a bejelentkezett user-eknek */}
                    <SongActions song={currentSong} />
                </div>
            </div>

            <PlaylistSection  />

            {/* mindig az oldal tetejére dob */}
            <ScrollToTop />
        </div>
    );
};