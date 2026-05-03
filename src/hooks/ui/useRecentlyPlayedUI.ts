import { useState, useEffect } from "react";

export const useRecentlyPlayedUI = <T>(recentlyPlayed: T[], isProfilePage: boolean) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState<boolean>(true);

    // Prevent selecting an index outside the list range.
    useEffect(() => {
        if (currentIndex >= recentlyPlayed.length) {
            setCurrentIndex(0);
        }
    }, [recentlyPlayed.length, currentIndex]);
    
    useEffect(() => {
        // No rotation needed for single items or on the profile page.
        if (recentlyPlayed.length <= 1 || isProfilePage) {
            return;
        }

        let timer: ReturnType<typeof setTimeout>;

        const interval = setInterval(() => {
            setFade(false);

            timer = setTimeout(() => {
                setCurrentIndex((prevIndex) => prevIndex === recentlyPlayed.length - 1 ? 0 : prevIndex + 1);
                setFade(true);
            }, 300);
        }, 3000);

        return () => {
            clearInterval(interval);
            if (timer) clearTimeout(timer);
        }
    }, [recentlyPlayed.length, isProfilePage]);

    return {
        currentIndex, setCurrentIndex,
        currentItem: recentlyPlayed[currentIndex] as T | undefined,
        fade
    };
};