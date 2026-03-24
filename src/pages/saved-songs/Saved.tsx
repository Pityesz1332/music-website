import { useNavigate } from "react-router-dom";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { useMusic } from "@context/MusicContext";
import { useSongClick } from "@hooks/music/useSongClick";
import { useFilteringSaved } from "@hooks/music/useFilteringSaved";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { LoadingState } from "@components/loading-state/LoadingState";
import { SAVED_STRINGS } from "@i18n/ui/saved";
import type { Song } from "@interfaces/music";
import { EmptyState } from "./empty-state/EmptyState";
import { SongsCard } from "../songs/songs-card/SongsCard";
import "../songs/Songs.scss";

export const Saved = () => {
    const navigate = useNavigate();
    const { savedSongs } = useMusic();
    const { handleFilteredSongClick } = useSongClick();

    // loading screen amíg az adatok megérkeznek
    if (!savedSongs) return <LoadingState message={SAVED_STRINGS.LOADING} />

    const {
        searchQuery,
        filteredSongs,
        currentSongs,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useFilteringSaved(savedSongs ?? []);

    const handleBrowseSongs = () => navigate(MainRoutes.SONGS);
    const handleResetSearch = () => navigate(MainRoutes.SAVED);
    const onSongClick = (song: Song) => handleFilteredSongClick(song, filteredSongs);

    return (
        <div className="songs">
            {savedSongs.length === 0 ? (
                <EmptyState
                    title={SAVED_STRINGS.EMPTY_STATE.NO_SAVED}
                    btnTxt={SAVED_STRINGS.EMPTY_STATE.BROWSE_BTN}
                    onBtnClick={handleBrowseSongs}
                />
            ) : (
                <div className="songs__container">
                    <h1 className="songs__title">{SAVED_STRINGS.TITLE}</h1>

                    {filteredSongs.length === 0 ? (
                        <EmptyState
                            title={SAVED_STRINGS.SEARCH.NOT_FOUND(searchQuery)}
                            btnTxt={SAVED_STRINGS.SEARCH.RESET_BTN}
                            onBtnClick={handleResetSearch}
                        />
                    ) : (
                        <>
                            <div className="songs__grid">
                                {currentSongs.map((song) => (
                                    <SongsCard 
                                        key={song.id}
                                        song={song}
                                        onClick={onSongClick}
                                    />
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