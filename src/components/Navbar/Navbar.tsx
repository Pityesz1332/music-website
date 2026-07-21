import { useLocation, useNavigate } from "react-router-dom";
import { NAV_CONFIG } from "@constants/ui/navbar";
import { useNavbarUI } from "@hooks/navbar/useNavbarUI";
import { NavLogo } from "./nav-logo/NavLogo";
import { NavSearch } from "./nav-search/NavSearch";
import { NavMobileToggle } from "./nav-mobile/NavMobileToggle";
import { NavLink } from "./nav-link/NavLink";
import { NavWallet } from "./nav-wallet/NavWallet";
import "./Navbar.scss";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isShrunk, isMenuOpen, toggleMenu, closeMenu } = useNavbarUI();

    const handleNavigate = (path: string) => {
        navigate(path);
        closeMenu();
    };

    return (
        <nav className={`navbar ${isShrunk ? "navbar--shrunk" : ""}`}>
            <NavLogo onClick={closeMenu} />

            <div className="navbar__center">
                <NavSearch onActionComplete={closeMenu} />
            </div>

            <NavMobileToggle isOpen={isMenuOpen} onToggle={toggleMenu} />

            <div className={`navbar__menu ${isMenuOpen ? "navbar__menu--open" : ""}`}>
                {NAV_CONFIG.map((item) => (
                    <NavLink
                        key={item.path}
                        path={item.path}
                        label={item.label}
                        Icon={item.Icon}
                        isActive={location.pathname === item.path}
                        onClick={() => handleNavigate(item.path)}
                    />
                ))}

                <NavWallet />
            </div>
        </nav>
    );
};

export default Navbar;
