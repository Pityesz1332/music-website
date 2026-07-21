import { Outlet } from "react-router-dom";
import Navbar from "@components/Navbar/Navbar";
import Playbar from "@components/Playbar/Playbar";
import { useMusic } from "@context/MusicContext";

// Defines the visual structure of the layout.
const MainLayout = () => {
    const { currentSong, isPlaying, togglePlay, nextSong, prevSong } = useMusic();

    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
                <Playbar
                    song={currentSong}
                    isPlaying={isPlaying}
                    onPlayPause={togglePlay}
                    onNext={nextSong}
                    onPrev={prevSong}
                />
            </main>
        </div>
    );
}

export default MainLayout;