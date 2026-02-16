import { useState, useEffect } from "react";

export const useRecentlyPlayedUI = (recentlyPlayed: any[], isProfilePage: boolean) => {
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

        const interval = setInterval(() => {
            setFade(false);

            const timer = setTimeout(() => {
                setCurrentIndex((prevIndex) => prevIndex === recentlyPlayed.length - 1 ? 0 : prevIndex + 1);
                setFade(true);
            }, 300);

            return () => clearTimeout(timer);
        }, 3000);

        return () => clearInterval(interval);
    }, [recentlyPlayed, isProfilePage]);

    return {
        currentIndex, setCurrentIndex,
        currentItem: recentlyPlayed[currentIndex],
        fade
    };
};