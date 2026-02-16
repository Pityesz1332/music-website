import { useLocation } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import { useRecentlyPlayedUI } from "../../hooks/useRecentlyPlayedUI";
import "./RecentlyPlayed.scss";

export const RecentlyPlayed = () => {
    const location = useLocation();
    const isProfilePage = location.pathname === "/myaccount"
    const { recentlyPlayed, playSong } = useMusic();
    const { currentItem, fade } = useRecentlyPlayedUI(recentlyPlayed, isProfilePage);

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

    // jelenlegi homepage megjelenítés
    return (
        <section className="recently-played">
            <h2 className="recently-played__title">Recently Played</h2>
        
            <div
                className={`recently-played__card ${fade ? '' : 'recently-played__card--faded'}`}
                onClick={() => playSong(currentItem)}
            >
                <div className="recently-played__image-container">
                    <img src={currentItem?.cover} alt={currentItem?.title} className="recently-played__image" />
                </div>

                <div className="recently-played__info">
                    <span className="recently-played__artist">{currentItem.artist}</span>
                    <h3 className="recently-played__song-title">{currentItem.title}</h3>
                </div>
            </div>
        </section>
    );
};