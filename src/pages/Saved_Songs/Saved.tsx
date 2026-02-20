import { useNavigate } from "react-router-dom";
import { MainRoutes } from "../../routes/constants/Main_Routes";
import { useMusic } from "../../context/MusicContext";
import { useSongClick } from "../../hooks/music/useSongClick";
import { useFilteringSaved } from "../../hooks/music/useFilteringSaved";
import { EmptyState } from "./subcomponents/EmptyState";
import "../Songs/Songs.scss";

export const Saved = () => {
    const navigate = useNavigate();
    const { savedSongs } = useMusic();

    const { handleFilteredSongClick } = useSongClick();

    const isLoading = savedSongs === undefined || savedSongs === null;
    // loading screen amíg az adatok megérkeznek
    if (isLoading) {
        return (
            <div className="songs">
                <div className="songs__status-container loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading saved songs...</p>
                </div>
            </div>
        );
    }

    const {
        searchQuery,
        filteredSongs,
        currentSongs,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useFilteringSaved(savedSongs ?? []);

    return (
        <div className="songs">
            {savedSongs.length === 0 ? (
                <EmptyState
                    title="You have no saved songs."
                    btnTxt="Browse songs"
                    onBtnClick={() => navigate(MainRoutes.SONGS)}
                />
            ) : (
                <div className="songs__container">
                    <h1 className="songs__title">Your Favorite Songs</h1>

                    {filteredSongs.length === 0 ? (
                        <EmptyState
                            title={`No song found with "${searchQuery}"`}
                            btnTxt="Reset search"
                            onBtnClick={() => navigate(MainRoutes.SAVED)}
                        />
                    ) : (
                        <>
                            <div className="songs__grid">
                                {currentSongs.map((song) => (
                                    <div key={song.id} className="songs__card-wrapper">
                                        <div
                                            className="songs__card"
                                            onClick={() => handleFilteredSongClick(song, filteredSongs)}
                                        >
                                            <img className="songs__card-image" src={song.cover} alt={song.title} />
                                            <h3 className="songs__card-title">{song.title}</h3>
                                            <p className="songs__card-genre">{song.genre}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="songs__pagination">
                                <button className="songs__pagination-button" onClick={prevPage} disabled={currentPage === 1}>Prev</button>
                                <span>Page {currentPage} / {Math.max(totalPages, 1)}</span>
                                <button className="songs__pagination-button" onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}