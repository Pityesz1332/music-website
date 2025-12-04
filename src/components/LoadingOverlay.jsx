import "../styles/components/LoadingOverlay.css";
import { useLoading } from "../context/LoadingContext";

function LoadingOverlay() {
    const { isLoading } = useLoading();

    console.log("LoadingOverlay rendered:", isLoading);

    if (!isLoading) return null;

    return (
        <div className="loading-overlay">
            <div className="loader"></div>
        </div>
    );
}

export default LoadingOverlay;