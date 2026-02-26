import { useLocation } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import { useRecentlyPlayedUI } from "../../hooks/ui/useRecentlyPlayedUI";
import { RecentlyPlayedList } from "./subcomponents/RecentlyPlayedList";
import { RecentlyPlayedCard } from "./subcomponents/RecentlyPlayedCard";
import "./RecentlyPlayed.scss";

export const RecentlyPlayed = () => {
    const location = useLocation();
    const isProfilePage = location.pathname === "/myaccount"
    const { recentlyPlayed, playSong } = useMusic();
    const { currentItem, fade } = useRecentlyPlayedUI(recentlyPlayed, isProfilePage);

    if (recentlyPlayed.length === 0) return null;

    return isProfilePage ? (
        <RecentlyPlayedList songs={recentlyPlayed} onPlay={playSong} />
    ) : (
        <RecentlyPlayedCard item={currentItem} fade={fade} onPlay={playSong} />
    )
};