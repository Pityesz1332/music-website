import { useState } from "react";
import { Filter } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { SONGS_STRINGS } from "@i18n/ui/songs";

interface SongsFilterProps {
    genres: string[];
    selectedGenre: string;
    onGenreChange: (genre: string) => void;
}

// dinamikus szűrőpanel, amely lehetővé teszi a user-nek, 
// hogy műfajok szerint (egyelőre) szűkítse a dallistát.
export const SongsFilter = ({ genres, selectedGenre, onGenreChange }: SongsFilterProps) => {
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

    const handleGenreClick = (genre: string) => {
        onGenreChange(genre);
        setIsFilterOpen(false);
    };

    return (
        <div className="songs__filter-wrapper">
            <PrimaryButton
                className={`songs__filter-toggle ${selectedGenre !== "All" ? "songs__filter-toggle--active" : ""}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
                <div className="songs__filter-label">
                    <Filter size={18} className="songs__filter-icon" />
                    <span>{selectedGenre === "All" ? SONGS_STRINGS.FILTER.LABEL : `${SONGS_STRINGS.FILTER.GENRE_PREFIX}${selectedGenre}`}</span>
                </div>
            </PrimaryButton>
            {isFilterOpen && (
                <div className="songs__filter-bar">
                    {genres.map((genre) => (
                        <PrimaryButton
                            key={genre}
                            className={`songs__genre-button ${selectedGenre === genre ? "songs__genre-button--active" : ""}`}
                            onClick={() => handleGenreClick(genre)}
                        >
                            {genre}
                        </PrimaryButton>
                    ))}
                </div>
            )}
        </div>
    );
};