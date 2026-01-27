import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Menu, X, Heart, Music, User, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";
import { useLoading } from "../../context/LoadingContext";
import "../Navbar/Navbar.scss";

// külön navbar a bejelentkezett felhasználóknak
const ConnectedNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { disconnect } = useAuth();
    const { notify } = useNotification();
    const { showLoading, hideLoading } = useLoading();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isShrunk, setIsShrunk] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    // navbar összenyomódása scroll-nál
    useEffect(() => {
        function handleScroll() {
            if (window.scrollY > 50) {
                setIsShrunk(true);
            } else {
                setIsShrunk(false);
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // keresőmező (csak ha van text a searchbar-ban)
    const executeSearch = () => {
        if (searchTerm.trim() !== "") {
            navigate(`/songs?search=${encodeURIComponent(searchTerm)}`);
            setSearchTerm("");
            setIsFocused(false);
        }
    };

    // keresés enter gomb lenyomására
    function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            executeSearch();
        }
    }

    // kisebb kijelzőkön hamburgermenü kinyitás/becsukás
    function toggleMenu() {
        setIsMenuOpen(prev => !prev);
    }

    // kijelentkezés -> sima navbar-ra váltás
    // ez kicsit késleltetve van a töltés tesztje miatt
    async function handleDisconnect() {
        try {
            showLoading();
            await disconnect();
            hideLoading();
            navigate("/");
            notify("Disconnected", NotificationType.SUCCESS);
        } catch(err) {
            hideLoading();
            notify("Error", NotificationType.ERROR);
        }
    }

    return (
            <nav className={`navbar navbar--connected ${isShrunk ? "navbar--shrunk" : ""}`}>
                <div className="navbar__logo" onClick={() => navigate("/")}>DJ Enez</div>

                <div className="navbar__center">
                    <div className="navbar__search-wrapper">
                        <input
                            className="navbar__search-input"                        
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
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
                        className={`navbar__item ${location.pathname === "/songs" ? "navbar__item--active" : ""}`}
                        onClick={() => { navigate("/songs"); setIsMenuOpen(false); }}
                    >
                    <Music className="navbar__item-icon" size={28} /><span className="navbar__item-text">Songs/Mixes</span>
                    </li>

                    <li
                        className={`navbar__item ${location.pathname === "/saved" ? "navbar__item--active" : ""}`}
                        onClick={() => { navigate("/saved"); setIsMenuOpen(false); }}
                    >
                        <Heart className="navbar__item-icon" size={28} /><span className="navbar__item-text">Favorites</span>
                    </li>
                    
                    <li
                        className={`navbar__item ${location.pathname === "/myaccount" ? "navbar__item--active" : ""}`}
                        onClick={() => { navigate("/myaccount"); setIsMenuOpen(false); }}
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