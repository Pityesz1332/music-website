import { useSongClick } from "@hooks/music-control/useSongClick";
import { useFilteringSongs } from "@hooks/music-control/useFilteringSongs";
import { SONGS_STRINGS } from "@i18n/ui/songs";
import type { Song } from "@interfaces/music";
import { SongsStatus } from "./songs-status/SongsStatus";
import { SongsFilter } from "./songs-filter/SongsFilter";
import { SongsNoResults } from "./songs-no-results/SongsNoResults";
import { SongsCard } from "./songs-card/SongsCard";
import { SongsPagination } from "./songs-pagination/SongsPagination";
import { SongsFooter } from "./songs-footer/SongsFooter";
import "./Songs.scss";

export const Songs = () => {
    const { handleFilteredSongClick } = useSongClick();

    const {
        currentSongs,
        filteredSongs,
        genres,
        selectedGenre,
        searchQuery,
        sortField,
        sortOrder,
        currentPage, setCurrentPage,
        totalPages,
        loading,
        error,
        handleGenreChange,
        handleSort,
        clearFilters,
        retry
    } = useFilteringSongs(15);

    const onSongCardClick = (song: Song) => {
        handleFilteredSongClick(song, filteredSongs);
    };

    if (loading || error) {
        return <SongsStatus loading={loading} error={error} retry={retry} />
    }

    return (
        <div className="songs">
            <div className="songs__container">
                <h1 className="songs__title">{SONGS_STRINGS.TITLE}</h1>

                <SongsFilter
                    genres={genres}
                    selectedGenre={selectedGenre}
                    onGenreChange={handleGenreChange}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    onClear={clearFilters}
                />

                    
                {filteredSongs.length === 0 ? (
                    <SongsNoResults searchQuery={searchQuery} />
                ) : (
                    <>
                        <div className="songs__grid">
                            {currentSongs.map((song) => (
                                <SongsCard
                                    key={song.id}
                                    song={song}
                                    onClick={onSongCardClick}
                                />
                            ))}
                        </div>
                    
                        <SongsPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                    </>
                )}
            </div>

            <SongsFooter />
        </div>
    );
};