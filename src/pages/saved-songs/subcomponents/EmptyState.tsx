import { Button } from "../../../components/ui/button/Button";

interface EmptyStateProps {
    title: string;
    btnTxt: string;
    onBtnClick: () => void;
}

export const EmptyState = ({ title, btnTxt, onBtnClick }: EmptyStateProps) => {
    return (
        <div className="songs__no-results">
            <h2 className="songs__no-results-title">{title}</h2>
            <Button className="songs__reset-button" onClick={onBtnClick}>
                {btnTxt}
            </Button>
        </div>
    );
};