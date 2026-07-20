import { PrimaryButton } from "@components/ui/button/PrimaryButton";

interface EmptyStateProps {
    title: string;
    btnTxt: string;
    onBtnClick: () => void;
}

// handling empty state
export const EmptyState = ({ title, btnTxt, onBtnClick }: EmptyStateProps) => {
    return (
        <div className="songs__no-results">
            <h2 className="songs__no-results-title">{title}</h2>
            <PrimaryButton className="songs__reset-button" onClick={onBtnClick}>
                {btnTxt}
            </PrimaryButton>
        </div>
    );
};