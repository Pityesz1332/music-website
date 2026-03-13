import { useSongClick } from "../../hooks/music/useSongClick";
import { useFilteringSongs } from "../../hooks/music/useFilteringSongs";
import { SongsStatus } from "./_components/SongsStatus";
import { SongsFilter } from "./_components/SongsFilter";
import { SongsNoResults } from "./_components/SongsNoResults";
import { SongsCard } from "./_components/SongsCard";
import { SongsPagination } from "./_components/SongsPagination";
import { SongsFooter } from "./_components/SongsFooter";
import { SONGS_STRINGS } from "../../i18n/ui/songs";
import "./Songs.scss";

export const Songs = () => {
    const { handleFilteredSongClick } = useSongClick();

    const {
        currentSongs,
        filteredSongs,
        genres,
        selectedGenre,
        searchQuery,
        currentPage, setCurrentPage,
        totalPages,
        loading,
        error,
        handleGenreChange,
        retry
    } = useFilteringSongs(15);

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
                />

                    
                {filteredSongs.length === 0 && (
                    <SongsNoResults searchQuery={searchQuery} />
                )}

                <div className="songs__grid">
                    {currentSongs.map((song) => (
                        <SongsCard
                            key={song.id}
                            song={song}
                            onClick={(s) => handleFilteredSongClick(s, filteredSongs)}
                        />
                    ))}
                </div>

                <SongsPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>

            <SongsFooter />
        </div>
    );
};