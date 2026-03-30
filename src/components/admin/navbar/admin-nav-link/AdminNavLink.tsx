// Kiszervezett listaelemek
import { Link } from "react-router-dom";

interface AdminNavLinkProps {
    path: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

// elkülönítem a navigációs logikát, 
// hogy olvashatóbb legyen a fő komponens
export const AdminNavLink = ({ path, label, isActive, onClick }: AdminNavLinkProps) => {
    return (
        <div className={`admin-navbar__item ${isActive ? "admin-navbar__item--active" : ""}`}>
            {/* belső navigáció az oldal újratöltése nélkül */}
            <Link className="admin-navbar__link" to={path} onClick={onClick}>
                {label}
            </Link>
        </div>
    );
};