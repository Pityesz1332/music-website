import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import "./NotFound.scss";

export const NotFound = () => {
    return (
        <div className="not-found">
            <AlertTriangle className="not-found__icon" size={80} />
            <h1 className="not-found__title">Page Not Found</h1>
            <p className="not-found__text">The page you are looking for doesn't exist.</p>
            <Link to="/" className="not-found__button">Go Back Home</Link>
        </div>
    );
}