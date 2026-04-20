import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { FilterModal } from "./filter-modal/FilterModal";
import { getFilterLabel } from "@utils/filterHelpers";
import { SONGS_STRINGS } from "@i18n/ui/songs";
import type { SortField, SortOrder } from "@interfaces/sort";
import "./SongsFilter.scss";

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

    const filterLabel = useMemo(
        () => getFilterLabel(selectedGenre, sortField, sortOrder),
        [selectedGenre, sortField, sortOrder]
    );

    const isFiltered = selectedGenre !== SONGS_STRINGS.FILTER.ALL || sortField !== SONGS_STRINGS.FILTER.NONE;

    return (
        <div className="songs__filter-wrapper">
            <PrimaryButton
                className={`songs__filter-toggle ${isFiltered ? "songs__filter-toggle--active" : ""}`}
                onClick={() => setIsFilterOpen(prev => !prev)}
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