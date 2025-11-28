import React from "react";
import { Outlet } from "react-router-dom";
import { useMusic } from "../context/MusicContext";
import Navbar from "../components/Navbar";
import Playbar from "../components/Playbar";

function UserLayout() {
    const { currentSong, isPlaying, togglePlay, nextSong, prevSong } = useMusic();

    return (
        <div className="user-layout">
            <Navbar />

            <main>
                <Outlet />
            </main>

            <Playbar
                song={currentSong}
                isPlaying={isPlaying}
                onPlayPause={togglePlay}
                onNext={nextSong}
                onPrev={prevSong}
            />
        </div>
    );
}

export default UserLayout;