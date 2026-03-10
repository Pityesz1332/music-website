import { useSongClick } from "../../hooks/music/useSongClick";
import { useFilteringSongs } from "../../hooks/music/useFilteringSongs";
import { SongsStatus } from "./subcomponents/SongsStatus";
import { SongsFilter } from "./subcomponents/SongsFilter";
import { SongsNoResults } from "./subcomponents/SongsNoResults";
import { SongsCard } from "./subcomponents/SongsCard";
import { SongsPagination } from "./subcomponents/SongsPagination";
import { SongsFooter } from "./subcomponents/SongsFooter";
import { SONGS_STRINGS } from "../../constant-strings/ui/songs";
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