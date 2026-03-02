import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { MainRoutes } from "../../../routes/constants/MainRoutes";
import { useAdminNavbar } from "../../../hooks/admin/useAdminNavbar";
import { ADMIN_NAVBAR_STRINGS } from "../../../constant-strings/ui/admin/navbar";
import { ADMIN_NAV_ITEMS } from "../../../constants/ui/admin/adminNavbar";
import { AdminNavLink } from "./subcomponents/AdminNavLink";
import "./AdminNavbar.scss";

const AdminNavbar = () => {
    const {
        shrink,
        isMenuOpen,
        isActive,
        handleDisconnect,
        toggleMenu
    } = useAdminNavbar();

    return (
        <nav className={`admin-navbar ${shrink ? "admin-navbar--shrink" : ""}`}>
            <div className="admin-navbar__logo">{ADMIN_NAVBAR_STRINGS.LOGO_SUFFIX}</div>

            <div className="admin-navbar__hamburger" onClick={toggleMenu}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </div>

            <ul className={`admin-navbar__list ${isMenuOpen ? "admin-navbar__list--open" : ""}`}>
                {ADMIN_NAV_ITEMS.map((item) => (
                    <AdminNavLink 
                        key={item.path}
                        path={item.path}
                        label={item.label}
                        isActive={isActive(item.path)}
                        onClick={toggleMenu}
                    />
                ))}
                
                <li className="admin-navbar__item admin-navbar__item--mobile-only">
                    <button className="admin-navbar__logout-button" onClick={handleDisconnect}>{ADMIN_NAVBAR_STRINGS.ACTIONS.GO_BACK}</button>
                </li>
            </ul>

            <div className="admin-navbar__actions">
                <button className="admin-navbar__logout-button" onClick={handleDisconnect}>{ADMIN_NAVBAR_STRINGS.ACTIONS.GO_BACK}</button>
            </div>
        </nav>
    );
}

export default AdminNavbar;