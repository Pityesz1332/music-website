import { useLocation, useNavigate } from "react-router-dom";
import { NAV_CONFIG } from "@constants/ui/navbar";
import { useNavbarUI } from "@hooks/navbar/useNavbarUI";
import { NavLogo } from "./nav-logo/NavLogo";
import { NavSearch } from "./nav-search/NavSearch";
import { NavMobileToggle } from "./nav-mobile/NavMobileToggle";
import { NavLink } from "./nav-link/NavLink";
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
                {/* Search is hidden for now */}
                <NavSearch onActionComplete={closeMenu} />

                {/* Songs/Mixes menu sits in the centered slot. */}
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
                </div>
            </div>

            <NavMobileToggle isOpen={isMenuOpen} onToggle={toggleMenu} />
        </nav>
    );
};

export default Navbar;
