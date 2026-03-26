import { useRef } from "react";
import { useNavbarUI } from "@hooks/ui/useNavbarUI";
import { useClickOutside } from "@hooks/general/useClickOutside";
import { useAuth } from "@context/AuthContext";
import { NavLogo } from "./nav-logo/NavLogo";
import { NavSearch } from "./nav-search/NavSearch";
import { NavMenu } from "./nav-menu/NavMenu";
import { NavMobileToggle } from "./nav-mobile/NavMobileToggle";
import "./Navbar.scss";

const Navbar = () => {
    const { isConnected } = useAuth();
    const { isShrunk, isMenuOpen, toggleMenu, closeMenu } = useNavbarUI();
    const navRef = useRef<HTMLElement>(null);

    useClickOutside({ref: navRef, callback: closeMenu, enabled: isMenuOpen});
    
    return (
        <nav 
            ref={navRef}
            className={`navbar ${isShrunk ? "navbar--shrunk" : ""} ${isConnected ? "navbar--connected" : ""}`}
        >
            <NavLogo className="navbar__logo" onClick={closeMenu} />

            <div className="navbar__center">
                <NavSearch onActionComplete={closeMenu} />
            </div>

            <NavMobileToggle isOpen={isMenuOpen} onToggle={toggleMenu} />

            <NavMenu isOpen={isMenuOpen} onClose={closeMenu} />
        </nav>
    );
};

export default Navbar;