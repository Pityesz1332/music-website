import { useNavigate, useLocation } from "react-router-dom";
import { Wallet, Menu, X, Music, Search, Heart, User } from "lucide-react";
import { MainRoutes } from "../../routes/constants/MainRoutes";
import { useNavbarUI } from "../../hooks/ui/useNavbarUI";
import { useNavbarSearch } from "../../hooks/music/useNavbarSearch";
import { useAuth } from "../../context/AuthContext";
import { useConnect } from "../../hooks/auth/useConnect";
import { useDisconnect } from "../../hooks/auth/useDisconnect";
import { NAVBAR_STRINGS } from "../../constants/ui/navbar";
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
                <li
                    className={`navbar__item ${location.pathname === MainRoutes.SONGS ? "navbar__item--active" : ""}`}
                    onClick={() => { navigate(MainRoutes.SONGS); closeMenu(); }}
                >
                <Music className="navbar__item-icon" size={28} /><span className="navbar__item-text">{NAVBAR_STRINGS.MENU.SONGS_MIXES}</span>
                </li>

                {isConnected && (
                    <>
                        <li
                            className={`navbar__item ${location.pathname === MainRoutes.SAVED ? "navbar__item--active" : ""}`}
                            onClick={() => { navigate(MainRoutes.SAVED); closeMenu(); }}
                        >
                            <Heart className="navbar__item-icon" size={28} />
                            <span className="navbar__item-text">{NAVBAR_STRINGS.MENU.FAVORITES}</span>
                        </li>
                        <li
                            className={`navbar__item ${location.pathname === MainRoutes.MY_ACCOUNT ? "navbar__item--active" : ""}`}
                            onClick={() => { navigate(MainRoutes.MY_ACCOUNT); closeMenu(); }}
                        >
                            <User className="navbar__item-icon" size={28} />
                            <span className="navbar__item-text">{NAVBAR_STRINGS.MENU.ACCOUNT}</span>
                        </li>
                    </>
                )}

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