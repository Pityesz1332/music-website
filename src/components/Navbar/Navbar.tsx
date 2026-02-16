import { useNavigate, useLocation } from "react-router-dom";
import { Wallet, Menu, X, Music, Search } from "lucide-react";
import { MainRoutes } from "../../routes/constants/Main_Routes";
import { useNavbarUI } from "../../hooks/useNavbarUI";
import { useNavbarSearch } from "../../hooks/useNavbarSearch";
import { useConnect } from "../../hooks/useConnect";
import "./Navbar.scss";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isShrunk, isMenuOpen, toggleMenu, closeMenu } = useNavbarUI();
    const {
        searchTerm, setSearchTerm,
        isFocused, setIsFocused,
        executeSearch,
        handleKeyDown,
        handleBlur
    } = useNavbarSearch(closeMenu);
    const { handleDemoConnect } = useConnect();

    return (
        <nav className={`navbar ${isShrunk ? "navbar--shrunk" : ""}`}>
            <div className="navbar__logo" onClick={() => navigate(MainRoutes.HOME)}>DJ Enez</div>

            <div className="navbar__center">
                <div className="navbar__search-wrapper">
                    <input
                        className="navbar__search-input"
                        type="text"
                        placeholder="Search..."
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
                <Music className="navbar__item-icon" size={28} /><span className="navbar__item-text">Songs/Mixes</span>
                </li>

                <li className="navbar__item navbar__item--wallet">
                    <button className="navbar__button" type="button" onClick={handleDemoConnect}><Wallet size={20} />Connect Wallet</button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;