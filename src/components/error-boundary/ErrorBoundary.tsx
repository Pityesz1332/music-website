import { ERROR_BOUNDARY_STRINGS } from "@i18n/ui/error-boundary";
import "./ErrorBoundary.scss";

// error fallback page with reload button
export const ErrorFallback = () => {

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="error-boundary__container">
            <h1>{ERROR_BOUNDARY_STRINGS.TITLE}</h1>
            <p>{ERROR_BOUNDARY_STRINGS.SUBTITLE}</p>
            <button className="error-boundary__button" onClick={handleReload}>
                {ERROR_BOUNDARY_STRINGS.BUTTON}
            </button>
        </div>
    );
};