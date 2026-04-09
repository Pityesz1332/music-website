import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { FilterModal } from "./filter-modal/FilterModal";
import { SONGS_STRINGS } from "@i18n/ui/songs";
import type { SortField, SortOrder } from "@interfaces/sort";

interface SongsFilterProps {
    genres: string[];
    selectedGenre: string;
    onGenreChange: (genre: string) => void;
    sortField: SortField;
    sortOrder: SortOrder;
    onSort: (field: SortField, order: SortOrder) => void;
    onClear: () => void;
}

// dinamikus szűrőpanel, amely lehetővé teszi a user-nek, 
// hogy műfajok szerint (egyelőre) szűkítse a dallistát.
export const SongsFilter = ({ 
    genres, 
    selectedGenre, 
    onGenreChange,
    sortField,
    sortOrder,
    onSort,
    onClear
}: SongsFilterProps) => {
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

    const filterLabel = useMemo(() => {
        const activeFilters: string[] = [];

        if (selectedGenre !== "All") {
            activeFilters.push(`${SONGS_STRINGS.FILTER.GENRE_PREFIX}${selectedGenre}`);
        }

        if (sortField !== "none") {
            const fieldLabel = sortField === "name" ? SONGS_STRINGS.FILTER.BY_NAME : SONGS_STRINGS.FILTER.BY_DURATION;
            const orderLabel = sortOrder === "asc" ?  SONGS_STRINGS.FILTER.ASC : SONGS_STRINGS.FILTER.DESC;
            activeFilters.push(`${SONGS_STRINGS.FILTER.SORT_PREFIX}${fieldLabel} - ${orderLabel}`);
        }

        if (activeFilters.length === 0) return SONGS_STRINGS.FILTER.LABEL;

        return activeFilters.join(" | ");
    }, [selectedGenre, sortField, sortOrder]);

    const isFiltered = selectedGenre !== "All" || sortField !== "none";

    return (
        <div className="songs__filter-wrapper">
            <PrimaryButton
                className={`songs__filter-toggle ${isFiltered ? "songs__filter-toggle--active" : ""}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
                <div className="songs__filter-label">
                    <Filter size={18} className="songs__filter-icon" />
                    <span>{filterLabel}</span>
                </div>
            </PrimaryButton>

            <FilterModal 
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                genres={genres}
                selectedGenre={selectedGenre}
                onGenreChange={onGenreChange}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={onSort}
                onClear={onClear}
            />            
        </div>
    );
};