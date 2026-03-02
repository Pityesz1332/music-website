// Kiszervezett listaelemek
import { Link } from "react-router-dom";

interface AdminNavLinkProps {
    path: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export const AdminNavLink = ({ path, label, isActive, onClick }: AdminNavLinkProps) => {
    return (
        <li className={`admin-navbar__item ${isActive ? "admin-navbar__item--active" : ""}`}>
            <Link className="admin-navbar__link" to={path} onClick={onClick}>
                {label}
            </Link>
        </li>
    );
};