import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { SONGS_STRINGS } from "@i18n/ui/songs";
import "./SongsPagination.scss";

interface SongsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const SongsPagination = ({ currentPage, totalPages, onPageChange }: SongsPaginationProps) => {
    if (totalPages <= 1) return null;

    const handlePrevPage = () => {
        onPageChange(Math.max(currentPage - 1, 1));
    };

    const handleNextPage = () => {
        onPageChange(Math.min(currentPage + 1, totalPages));
    };

    return (
        <div className="songs__pagination">
            <PrimaryButton
                className="songs__pagination-button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
            >
                {SONGS_STRINGS.PAGINATION.PREV}
            </PrimaryButton>
            
            <span className="songs__pagination-info">
                {SONGS_STRINGS.PAGINATION.PAGE_INFO(currentPage, totalPages)}
            </span>
            
            <PrimaryButton
                className="songs__pagination-button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
            >
                {SONGS_STRINGS.PAGINATION.NEXT}
            </PrimaryButton>
        </div>
    );
}