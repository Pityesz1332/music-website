import { useNavigate } from "react-router-dom";
import { MainRoutes } from "../../routes/constants/MainRoutes";
import { useMusic } from "../../context/MusicContext";
import { useSongClick } from "../../hooks/music/useSongClick";
import { useFilteringSaved } from "../../hooks/music/useFilteringSaved";
import { EmptyState } from "./subcomponents/EmptyState";
import { SAVED_STRINGS } from "../../constant-strings/ui/saved";
import { PrimaryButton } from "../../components/ui/button/PrimaryButton";
import "../songs/Songs.scss";

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
                    <p>{SAVED_STRINGS.LOADING}</p>
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
                    title={SAVED_STRINGS.EMPTY_STATE.NO_SAVED}
                    btnTxt={SAVED_STRINGS.EMPTY_STATE.BROWSE_BTN}
                    onBtnClick={() => navigate(MainRoutes.SONGS)}
                />
            ) : (
                <div className="songs__container">
                    <h1 className="songs__title">{SAVED_STRINGS.TITLE}</h1>

                    {filteredSongs.length === 0 ? (
                        <EmptyState
                            title={SAVED_STRINGS.SEARCH.NOT_FOUND(searchQuery)}
                            btnTxt={SAVED_STRINGS.SEARCH.RESET_BTN}
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
                                <PrimaryButton className="songs__pagination-button" onClick={prevPage} disabled={currentPage === 1}>
                                    {SAVED_STRINGS.PAGINATION.PREV}
                                </PrimaryButton>
                                <span>{SAVED_STRINGS.PAGINATION.PAGE_INFO(currentPage, totalPages)}</span>
                                <PrimaryButton className="songs__pagination-button" onClick={nextPage} disabled={currentPage === totalPages}>
                                    {SAVED_STRINGS.PAGINATION.NEXT}
                                </PrimaryButton>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};