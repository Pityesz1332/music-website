import { PrimaryButton } from "../../../components/ui/button/PrimaryButton";
import { SONGS_STRINGS } from "../../../i18n/ui/songs";

interface SongsPaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const SongsPagination = ({ currentPage, totalPages, setCurrentPage }: SongsPaginationProps) => {
    if (totalPages <= 1) return null;

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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