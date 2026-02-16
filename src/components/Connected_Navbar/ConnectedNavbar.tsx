import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Heart, Music, User, Search } from "lucide-react";
import { MainRoutes } from "../../routes/constants/Main_Routes";
import { useNavbarUI } from "../../hooks/useNavbarUI";
import { useNavbarSearch } from "../../hooks/useNavbarSearch";
import { useDisconnect } from "../../hooks/useDisconnect";
import "../Navbar/Navbar.scss";

// külön navbar a bejelentkezett felhasználóknak
const ConnectedNavbar = () => {
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
    const { handleDisconnect } = useDisconnect();

    return (
            <nav className={`navbar navbar--connected ${isShrunk ? "navbar--shrunk" : ""}`}>
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

                        {/* nagyító megjelenése, ha a searchbar fókuszban van */}
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

                    <li
                        className={`navbar__item ${location.pathname === MainRoutes.SAVED ? "navbar__item--active" : ""}`}
                        onClick={() => { navigate(MainRoutes.SAVED); closeMenu(); }}
                    >
                        <Heart className="navbar__item-icon" size={28} /><span className="navbar__item-text">Favorites</span>
                    </li>
                    
                    <li
                        className={`navbar__item ${location.pathname === MainRoutes.MY_ACCOUNT ? "navbar__item--active" : ""}`}
                        onClick={() => { navigate(MainRoutes.MY_ACCOUNT); closeMenu(); }}
                    >
                    <User className="navbar__item-icon" size={28} /><span className="navbar__item-text">Account</span>
                    </li>

                    <li className="navbar__item navbar__item--wallet">
                        <button className="navbar__button" type="button" onClick={handleDisconnect}>Disconnect</button>
                    </li>
                </ul>
            </nav>
    );
}

export default ConnectedNavbar;