import { ERROR_BOUNDARY_STRINGS } from "../../i18n/ui/error-boundary";
import { PrimaryButton } from "../ui/button/PrimaryButton";
import "./ErrorBoundary.scss";

export const ErrorFallback = () => {

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="error-boundary__container">
            <h1>{ERROR_BOUNDARY_STRINGS.TITLE}</h1>
            <p>{ERROR_BOUNDARY_STRINGS.SUBTITLE}</p>
            <PrimaryButton onClick={handleReload}>{ERROR_BOUNDARY_STRINGS.BUTTON}</PrimaryButton>
        </div>
    );
};