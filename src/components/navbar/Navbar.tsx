import { useNavigate, useLocation } from "react-router-dom";
import { Wallet, Menu, X, Music, Search, Heart, User } from "lucide-react";
import { MainRoutes } from "../../routes/constants/MainRoutes";
import { useNavbarUI } from "../../hooks/ui/useNavbarUI";
import { useNavbarSearch } from "../../hooks/music/useNavbarSearch";
import { useAuth } from "../../context/AuthContext";
import { useConnect } from "../../hooks/auth/useConnect";
import { useDisconnect } from "../../hooks/auth/useDisconnect";
import { NAVBAR_STRINGS } from "../../constant-strings/ui/navbar";
import { NavLink } from "./subcomponents/NavLink";
import { PUBLIC_NAV_ITEMS, PROTECTED_NAV_ITEMS } from "../../constants/ui/navbar";
import "./Navbar.scss";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isConnected } = useAuth();
    const { handleDemoConnect } = useConnect();
    const { handleDisconnect } = useDisconnect();
    const { isShrunk, isMenuOpen, toggleMenu, closeMenu } = useNavbarUI();
    const {
        searchTerm, setSearchTerm,
        isFocused, setIsFocused,
        executeSearch,
        handleKeyDown,
        handleBlur
    } = useNavbarSearch(closeMenu);

    const renderNavLink = (item: any) => (
        <NavLink 
            key={item.path}
            path={item.path}
            label={item.label}
            Icon={item.Icon}
            isActive={location.pathname === item.path}
            onClick={() => { navigate(item.path); closeMenu(); }}
        />
    );

    return (
        <nav className={`navbar ${isShrunk ? "navbar--shrunk" : ""} ${isConnected ? "navbar--connected" : ""}`}>
            <div className="navbar__logo" onClick={() => navigate(MainRoutes.HOME)}>DJ Enez</div>

            <div className="navbar__center">
                <div className="navbar__search-wrapper">
                    <input
                        className="navbar__search-input"
                        type="text"
                        placeholder={NAVBAR_STRINGS.PLACEHOLDER}
                        value={searchTerm}
                        onFocus={() => setIsFocused(true)}
                        onBlur={handleBlur}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {(searchTerm || isFocused) && (
                        <Search className="navbar__search-icon" size={18} onClick={executeSearch} />
                    )}
                </div>
            </div>

            <div className="navbar__hamburger" onClick={toggleMenu}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </div>

            <ul className={`navbar__menu ${isMenuOpen ? "navbar__menu--open" : ""}`}>
                {PUBLIC_NAV_ITEMS.map(renderNavLink)}

                {isConnected && PROTECTED_NAV_ITEMS.map(renderNavLink)}

                <li className="navbar__item navbar__item--wallet">
                    {isConnected ? (
                        <button className="navbar__button" type="button" onClick={() => { handleDisconnect(); closeMenu(); }}>
                            {NAVBAR_STRINGS.WALLET.DISCONNECT}
                        </button>
                    ) : (
                        <button className="navbar__button" type="button" onClick={() => { handleDemoConnect(); closeMenu(); }}>
                            <Wallet size={20} />
                            {NAVBAR_STRINGS.WALLET.CONNECT}
                        </button>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;