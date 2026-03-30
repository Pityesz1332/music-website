import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { NOT_FOUND_STRINGS } from "@i18n/ui/not-found";
import "./NotFound.scss";

// fallback oldal
export const NotFound = () => {
    return (
        <div className="not-found">
            <AlertTriangle className="not-found__icon" size={80} />
            <h1 className="not-found__title">{NOT_FOUND_STRINGS.TITLE}</h1>
            <p className="not-found__text">{NOT_FOUND_STRINGS.DESCRIPTION}</p>
            <Link to={MainRoutes.HOME} className="not-found__button">{NOT_FOUND_STRINGS.BUTTONS.BACK}</Link>
        </div>
    );
}