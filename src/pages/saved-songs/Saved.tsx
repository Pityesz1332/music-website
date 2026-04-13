import { useNavigate } from "react-router-dom";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { useMusic } from "@context/MusicContext";
import { useSongClick } from "@hooks/music-control/useSongClick";
import { useFilteringSaved } from "@hooks/music-control/useFilteringSaved";
import { LoadingState } from "@components/loading-state/LoadingState";
import { SongsPagination } from "@pages/songs/songs-pagination/SongsPagination";
import { SAVED_STRINGS } from "@i18n/ui/saved";
import type { Song } from "@interfaces/music";
import { EmptyState } from "./empty-state/EmptyState";
import { SongsCard } from "../songs/songs-card/SongsCard";
import "../songs/Songs.scss";

export const Saved = () => {
    const navigate = useNavigate();
    const { savedSongs } = useMusic();
    const {
        searchQuery,
        filteredSongs,
        currentSongs,
        currentPage, setCurrentPage,
        totalPages
    } = useFilteringSaved(savedSongs ?? []);
    const { handleFilteredSongClick } = useSongClick();

    const handleBrowseSongs = () => navigate(MainRoutes.SONGS);
    const handleResetSearch = () => navigate(MainRoutes.SAVED);
    const onSongClick = (song: Song) => handleFilteredSongClick(song, filteredSongs);
    
    // loading screen amíg az adatok megérkeznek
    if (!savedSongs) return <LoadingState message={SAVED_STRINGS.LOADING} />

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

                            <SongsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};