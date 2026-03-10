import { PrimaryButton } from "../../../components/ui/button/PrimaryButton";
import { SONGS_STRINGS } from "../../../constant-strings/ui/songs";

interface SongsPaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const SongsPagination = ({ currentPage, totalPages, setCurrentPage }: SongsPaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className="songs__pagination">
            <PrimaryButton
                className="songs__pagination-button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
            >
                {SONGS_STRINGS.PAGINATION.PREV}
            </PrimaryButton>
            
            <span className="songs__pagination-info">
                {SONGS_STRINGS.PAGINATION.PAGE_INFO(currentPage, totalPages)}
            </span>
            
            <PrimaryButton
                className="songs__pagination-button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                {SONGS_STRINGS.PAGINATION.NEXT}
            </PrimaryButton>
        </div>
    );
}