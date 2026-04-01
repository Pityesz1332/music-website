import { SortAsc, SortDesc, RotateCcw } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { Modal } from "@components/ui/modal/Modal";
import { SONGS_STRINGS } from "@i18n/ui/songs";
import type { SortField, SortOrder } from "@interfaces/sort";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    genres: string[];
    selectedGenre: string;
    onGenreChange: (genre: string) => void;
    sortField: SortField;
    sortOrder: SortOrder;
    onSort: (field: SortField, order: SortOrder) => void;
    onClear: () => void;
}

export const FilterModal = ({
    isOpen,
    onClose,
    genres,
    selectedGenre,
    onGenreChange,
    sortField,
    sortOrder,
    onSort,
    onClear
}: FilterModalProps) => {
    const handleClear = () => {
        onClear();
        onClose();
    };

    const isSortActive = sortField !== "none" || sortOrder !== "none";
    const isGenreActive = selectedGenre !== "All";

    const isSortOrderMissing = !sortOrder || sortOrder === "none";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={SONGS_STRINGS.FILTER.LABEL}
            buttons={
                <div className="songs__filter-modal-actions">
                    <PrimaryButton onClick={handleClear}>
                        {SONGS_STRINGS.FILTER.ACTIONS.CLEAR}
                    </PrimaryButton>
                    <PrimaryButton onClick={onClose}>
                        {SONGS_STRINGS.FILTER.ACTIONS.DONE}
                    </PrimaryButton>
                </div>
            }
            >
            <div className="songs__filter-modal-content">
                <section className="songs__filter-section">
                    <div className="songs__filter-header">
                        <h4>{SONGS_STRINGS.FILTER.SORT_ORDER}</h4>
                            {isSortActive && (
                                <PrimaryButton
                                    className="songs__section-clear-btn"
                                    onClick={() => onSort("none", "none")}
                                >
                                    <RotateCcw size={14} />
                                </PrimaryButton>
                            )}
                    </div>
                    
                    <div className="songs__sort-order-grid">
                        <PrimaryButton
                            className={`songs__sort-button ${sortOrder === "asc" ? "active" : ""}`}
                            onClick={() => onSort(sortField === "none" ? "name" : sortField, "asc")}
                        >
                            <SortAsc size={16} /> {SONGS_STRINGS.FILTER.ASC}
                        </PrimaryButton>
                        <PrimaryButton
                            className={`songs__sort-button ${sortOrder === "desc" ? "active" : ""}`}
                            onClick={() => onSort(sortField === "none" ? "name" : sortField, "desc")}
                        >
                            <SortDesc size={16} /> {SONGS_STRINGS.FILTER.DESC}
                        </PrimaryButton>
                    </div>

                    <h4>{SONGS_STRINGS.FILTER.SORT_BY}</h4>
                    <div className="songs__sort-field-grid">
                        <PrimaryButton
                            className={`songs__sort-button ${sortField === "name" ? "active" : ""}`}
                            onClick={() => onSort("name", sortOrder)}
                            disabled={isSortOrderMissing}
                        >
                            {SONGS_STRINGS.FILTER.BY_NAME}
                        </PrimaryButton>
                        <PrimaryButton
                            className={`songs__sort-button ${sortField === "duration" ? "active" : ""}`}
                            onClick={() => onSort("duration", sortOrder)}
                            disabled={isSortOrderMissing}
                        >
                            {SONGS_STRINGS.FILTER.BY_DURATION}
                        </PrimaryButton>
                    </div>
                </section>

                <section className="songs__filter-section">
                    <div className="songs__filter-header">
                        <h4>{SONGS_STRINGS.FILTER.GENRES_TITLE}</h4>
                            {isGenreActive && (
                                <PrimaryButton
                                    className="songs__section-clear-btn"
                                    onClick={() => onGenreChange("All")}
                                >
                                    <RotateCcw size={14} />
                                </PrimaryButton>
                            )}
                    </div>

                    <div className="songs__genre-grid">
                        {genres.map((genre) => (
                            <PrimaryButton
                                key={genre}
                                className={`songs__genre-button ${
                                    selectedGenre === genre ? "songs__genre-button--active" : ""
                                }`}
                                onClick={() => onGenreChange(genre)}
                            >
                                {genre}
                            </PrimaryButton>
                        ))}
                    </div>
                </section>
            </div>
        </Modal>
    );
};