import { Menu, X } from "lucide-react";
import { useAdminNavbar } from "../../../hooks/admin/useAdminNavbar";
import { ADMIN_NAVBAR_STRINGS } from "../../../i18n/ui/admin/navbar";
import { ADMIN_NAV_ITEMS } from "../../../constants/ui/admin/adminNavbar";
import { AdminNavLink } from "./_components/AdminNavLink";
import { PrimaryButton } from "../../ui/button/PrimaryButton";
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
                    <PrimaryButton className="admin-navbar__logout-button" onClick={handleDisconnect}>{ADMIN_NAVBAR_STRINGS.ACTIONS.GO_BACK}</PrimaryButton>
                </li>
            </ul>

            <div className="admin-navbar__actions">
                <PrimaryButton className="admin-navbar__logout-button" onClick={handleDisconnect}>{ADMIN_NAVBAR_STRINGS.ACTIONS.GO_BACK}</PrimaryButton>
            </div>
        </nav>
    );
}

export default AdminNavbar;