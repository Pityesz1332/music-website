import { ERROR_BOUNDARY_STRINGS } from "../../constant-strings/ui/errorBoundary";
import { PrimaryButton } from "../ui/button/PrimaryButton";
import "./ErrorBoundary.scss";

export const ErrorFallback = () => {
    return (
        <div className="error-boundary__container">
            <h1>{ERROR_BOUNDARY_STRINGS.TITLE}</h1>
            <p>{ERROR_BOUNDARY_STRINGS.SUBTITLE}</p>
            <PrimaryButton onClick={() => window.location.reload()}>{ERROR_BOUNDARY_STRINGS.BUTTON}</PrimaryButton>
        </div>
    );
}