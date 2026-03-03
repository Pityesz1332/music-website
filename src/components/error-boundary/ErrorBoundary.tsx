import { ERROR_BOUNDARY_STRINGS } from "../../constant-strings/ui/errorBoundary";
import { Button } from "../ui/button/Button";
import { ErrorBoundary } from "react-error-boundary";

export const ErrorFallback = () => {
    return (
        <div style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "20px",
            color: "#fff"
        }}>
            <h1>{ERROR_BOUNDARY_STRINGS.TITLE}</h1>
            <p>{ERROR_BOUNDARY_STRINGS.SUBTITLE}</p>
            <Button onClick={() => window.location.reload()}>{ERROR_BOUNDARY_STRINGS.BUTTON}</Button>
        </div>
    );
}