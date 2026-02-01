import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { MainRoutes } from "../../../routes/constants/Main_Routes";
import "./AdminNavbar.scss";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [shrink, setShrink] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    // segédfüggvény az aktív menüponthoz
    const isActive = (path: string) => location.pathname === path;

    // görgetés figyelése, navbar összenyomása
    useEffect(() => {
        function handleScroll() {
            if (window.scrollY > 30) {
                setShrink(true);
            } else {
                setShrink(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // automatikus navbar zárás oldalváltáskor
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // ez még csak navigációkezelés a kijelentkezéshez
    function handleDisconnect() {
        navigate(MainRoutes.HOME);
    }

    // hamburger menü kapcsolója
    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <nav className={`admin-navbar ${shrink ? "admin-navbar--shrink" : ""}`}>
            <div className="admin-navbar__logo">DJ Enez (Admin)</div>

            <div className="admin-navbar__hamburger" onClick={toggleMenu}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </div>

            <ul className={`admin-navbar__list ${isMenuOpen ? "admin-navbar__list--open" : ""}`}>
                <li className={`admin-navbar__item ${isActive(MainRoutes.ADMIN_DASHBOARD) ? "admin-navbar__item--active" : ""}`}>
                    <Link className="admin-navbar__link" to={MainRoutes.ADMIN_DASHBOARD}>Dashboard</Link>
                </li>

                <li className={`admin-navbar__item ${isActive(MainRoutes.ADMIN_SONGS) ? "admin-navbar__item--active" : ""}`}>
                    <Link className="admin-navbar__link" to={MainRoutes.ADMIN_SONGS}>Songs/Mixes</Link>
                </li>

                <li className={`admin-navbar__item ${isActive(MainRoutes.ADMIN_USERS) ? "admin-navbar__item--active" : ""}`}>
                    <Link className="admin-navbar__link" to={MainRoutes.ADMIN_USERS}>Users</Link>
                </li>
                
                <li className="admin-navbar__item admin-navbar__item--mobile-only">
                    <button className="admin-navbar__logout-button" onClick={handleDisconnect}>Go Back</button>
                </li>
            </ul>

            <div className="admin-navbar__actions">
                <button className="admin-navbar__logout-button" onClick={handleDisconnect}>Go Back</button>
            </div>
        </nav>
    );
}

export default AdminNavbar;