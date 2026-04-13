import { useRef } from "react";
import { Menu, X } from "lucide-react";
import { useAdminNavbar } from "@hooks/admin/useAdminNavbar";
import { ADMIN_NAVBAR_STRINGS } from "@i18n/ui/admin/navbar";
import { ADMIN_NAV_ITEMS } from "@constants/ui/admin/adminNavbar";
import { useClickOutside } from "@hooks/general/useClickOutside";
import { AdminNavLink } from "./admin-nav-link/AdminNavLink";
import { PrimaryButton } from "../../ui/button/PrimaryButton";
import "./AdminNavbar.scss";

const AdminNavbar = () => {
    const {
        shrink,
        isMenuOpen,
        isActive,
        handleDisconnect,
        toggleMenu,
        closeMenu
    } = useAdminNavbar();

    const navRef = useRef<HTMLDivElement>(null);

    useClickOutside({ ref: navRef, callback: closeMenu, enabled: isMenuOpen });

    const goBackBtn = (className: string) => (
        <PrimaryButton
            className={className}
            onClick={handleDisconnect}
        >
            {ADMIN_NAVBAR_STRINGS.ACTIONS.GO_BACK}
        </PrimaryButton>
    );

    return (
        <nav ref={navRef} className={`admin-navbar ${shrink ? "admin-navbar--shrink" : ""}`}>
            <div className="admin-navbar__logo">{ADMIN_NAVBAR_STRINGS.LOGO_SUFFIX}</div>

            <div className="admin-navbar__hamburger" onClick={toggleMenu}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </div>

            <div className={`admin-navbar__list ${isMenuOpen ? "admin-navbar__list--open" : ""}`}>
                {ADMIN_NAV_ITEMS.map((item) => (
                    <AdminNavLink 
                        key={item.path}
                        path={item.path}
                        label={item.label}
                        isActive={isActive(item.path)}
                        onClick={closeMenu}
                    />
                ))}
                
                <div className="admin-navbar__item admin-navbar__item--mobile-only">
                    {goBackBtn("admin-navbar__logout-button")}
                </div>
            </div>

            <div className="admin-navbar__actions">
                {goBackBtn("admin-navbar__logout-button")}
            </div>
        </nav>
    );
}

export default AdminNavbar;