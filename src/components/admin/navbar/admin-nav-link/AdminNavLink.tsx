import { Link } from "react-router-dom";

interface AdminNavLinkProps {
    path: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}
// Decoupled navigation logic to improve main component readability
export const AdminNavLink = ({ path, label, isActive, onClick }: AdminNavLinkProps) => {
    return (
        <div className={`admin-navbar__item ${isActive ? "admin-navbar__item--active" : ""}`}>
            <Link className="admin-navbar__link" to={path} onClick={onClick}>
                {label}
            </Link>
        </div>
    );
};