import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Wallet, Menu, X, Music, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";
import { useLoading } from "../../context/LoadingContext";
import "./Navbar.scss";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { connect } = useAuth();
    const { notify } = useNotification();
    const { showLoading, hideLoading } = useLoading();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isShrunk, setIsShrunk] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    // scroll-ra összenyomódik a navbar
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

    // searchbar keresés
    const executeSearch = () => {
        if (searchTerm.trim() !== "") {
            navigate(`/songs?search=${encodeURIComponent(searchTerm)}`);
            setSearchTerm("");
            setIsFocused(false);
        }
    }

    // enter gombra keres
    function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            executeSearch();
        }
    }

    // hamburgermenü ki/bezárás
    function toggleMenu() {
        setIsMenuOpen(prev => !prev);
    }

    // demo bejelentkezés (wallet connect)
    async function handleDemoConnect() {
        try {
            showLoading();
            await connect();
            hideLoading();
            notify("Wallet connected", NotificationType.SUCCESS);
        } catch(err) {
            hideLoading();
            console.error(err);
            notify("Something went wrong", NotificationType.ERROR);
        }
    }

    return (
        <nav className={`navbar ${isShrunk ? "navbar--shrunk" : ""}`}>
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

                <li className="navbar__item navbar__item--wallet">
                    <button className="navbar__button" type="button" onClick={handleDemoConnect}><Wallet size={20} />Connect Wallet</button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;