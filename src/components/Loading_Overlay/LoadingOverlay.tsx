import "./LoadingOverlay.scss";
import { useLoading } from "../../context/LoadingContext";

const LoadingOverlay = () => {
    const { isLoading } = useLoading();

    console.log("LoadingOverlay rendered:", isLoading);

    if (!isLoading) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-overlay__loader"></div>
        </div>
    );
}

export default LoadingOverlay;