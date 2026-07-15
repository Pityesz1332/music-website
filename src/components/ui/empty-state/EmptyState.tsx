import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import "./EmptyState.scss";

interface EmptyStateProps {
    title: string;
    description?: string;
    buttonText: string;
    to?: string;
    onButtonClick?: () => void;
}

// Shared placeholder for "nothing to show here" screens: empty catalogs,
// empty saved lists, or searches/filters that matched no results.
// The button either navigates (via `to`) or runs a callback (via `onButtonClick`).
export const EmptyState = ({ title, description, buttonText, to, onButtonClick }: EmptyStateProps) => {
    return (
        <div className="empty-state">
            <h2 className="empty-state__title">{title}</h2>
            {description && <p className="empty-state__text">{description}</p>}
            <PrimaryButton className="empty-state__button" to={to} onClick={onButtonClick}>
                {buttonText}
            </PrimaryButton>
        </div>
    );
};
