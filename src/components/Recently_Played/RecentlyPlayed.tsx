import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import "./RecentlyPlayed.scss";

export const RecentlyPlayed = () => {
    const location = useLocation();
    const isProfilePage = location.pathname === "/myaccount"
    const { recentlyPlayed, playSong } = useMusic();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState<boolean>(true);

    // csak annyi elemet nézünk, ami éppen a tömbben van.
    // ha rövidebb a lista, mint ahol állunk, visszaugrik az első elemre
    useEffect(() => {
        if (currentIndex >= recentlyPlayed.length) {
            setCurrentIndex(0);
        }
    }, [recentlyPlayed.length, currentIndex]);

    // 3 mp-ként váltakoznak az elemek a listában 
    // (homepage only, profilepage-en lista van)
    useEffect(() => {
        if (recentlyPlayed.length <= 1 || isProfilePage) return;

        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === recentlyPlayed.length -1 ? 0 : prevIndex + 1
            );
            setFade(true);
            }, 300);
        }, 3000);

        return () => clearInterval(interval);
    }, [recentlyPlayed, isProfilePage]);

    if (recentlyPlayed.length === 0) return null;

    // ha a profilepage-en vagyunk, akkor lista
    if (isProfilePage) {
        return (
            <section className="recently-played__list">
                <h2 className="recently-played__title">Recently Played</h2>
                <div className="recently-played__list-container">
                    {recentlyPlayed.map((song) => (
                        <div key={song.id} onClick={() => playSong(song)} className="recently-played__item">
                            <img src={song.cover} alt={song.title} className="recently-played__item-image" />
                            <div className="recently-played__item-info">
                                <span className="recently-played__item-title">{song.title}</span>
                                <span className="recently-played__item-artist">{song.artist}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    // az aktuális elem kiválasztása a tömbből az index alapján
    const currentItem = recentlyPlayed[currentIndex];

    // jelenlegi homepage megjelenítés
    return (
        <section className="recently-played">
            <h2 className="recently-played__title">Recently Played</h2>
        
            <div
                className={`recently-played__card ${fade ? '' : 'recently-played__card--faded'}`}
                onClick={() => playSong(currentItem)}
            >
                <div className="recently-played__image-container">
                    <img src={currentItem.cover} alt={currentItem.title} className="recently-played__image" />
                </div>

                <div className="recently-played__info">
                    <span className="recently-played__artist">{currentItem.artist}</span>
                    <h3 className="recently-played__song-title">{currentItem.title}</h3>
                </div>
            </div>
        </section>
    );
};