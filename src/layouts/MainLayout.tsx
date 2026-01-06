import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMusic } from "../context/MusicContext";
import Navbar from "../components/Navbar/Navbar";
import ConnectedNavbar from "../components/Connected_Navbar/ConnectedNavbar";
import Playbar from "../components/Playbar/Playbar";

const MainLayout: React.FC = () => {
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