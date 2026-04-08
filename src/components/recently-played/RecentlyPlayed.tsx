import { useMusic } from "@context/MusicContext";
import { useRecentlyPlayedUI } from "@hooks/ui/useRecentlyPlayedUI";
import { RecentlyPlayedList } from "./recently-played-list/RecentlyPlayedList";
import { RecentlyPlayedCard } from "./recently-played-card/RecentlyPlayedCard";
import "./RecentlyPlayed.scss";

interface RecentlyPlayedProps {
    isProfilePage?: boolean;
}

export const RecentlyPlayed = ({ isProfilePage = false }: RecentlyPlayedProps) => {
    const { recentlyPlayed, playSong } = useMusic();
    const { currentItem, fade } = useRecentlyPlayedUI(recentlyPlayed, isProfilePage);
    

    if (recentlyPlayed.length === 0) return null;

    return isProfilePage ? (
        <RecentlyPlayedList songs={recentlyPlayed} onPlay={playSong} />
    ) : (
        <RecentlyPlayedCard item={currentItem} fade={fade} onPlay={playSong} />
    );
};