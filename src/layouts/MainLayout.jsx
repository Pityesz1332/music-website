import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMusic } from "../context/MusicContext";
import Navbar from "../components/Navbar";
import ConnectedNavbar from "../components/ConnectedNavbar";
import Playbar from "../components/Playbar";

function MainLayout() {
    const { isConnected } = useAuth();
    const { currentSong, isPlaying, togglePlay, nextSong, prevSong } = useMusic();

    return (
        <div>
            {isConnected ? <ConnectedNavbar /> : <Navbar />}
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