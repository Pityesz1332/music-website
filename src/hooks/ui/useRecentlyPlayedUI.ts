import { useState, useEffect } from "react";

export const useRecentlyPlayedUI = <T>(recentlyPlayed: T[], isProfilePage: boolean) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState<boolean>(true);

    // ellenőrzi, hogy ne csússzunk ki a lista tartományából
    useEffect(() => {
        if (currentIndex >= recentlyPlayed.length) {
            setCurrentIndex(0);
        }
    }, [recentlyPlayed.length, currentIndex]);
    
    // 3 mp-ként váltjuk a listaelemeket
    useEffect(() => {
        // ha csak 1 elem van, vagy a profil oldalon vagyunk, nem kell pörgetni
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