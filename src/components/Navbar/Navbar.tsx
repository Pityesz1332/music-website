import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Wallet, Menu, X, Music, Search } from "lucide-react";
import { NAVBAR_STRINGS } from "@i18n/ui/navbar";
import "./Navbar.scss";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isShrunk, setIsShrunk] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    // navbar shrinks on scroll
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

    // searchbar search
    const executeSearch = () => {
        if (searchTerm.trim() !== "") {
            navigate(`/songs?search=${encodeURIComponent(searchTerm)}`);
            setSearchTerm("");
            setIsFocused(false);
        }
    }

    // searches on Enter key
    function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            executeSearch();
        }
    }

    // toggles the hamburger menu open/closed
    function toggleMenu() {
        setIsMenuOpen(prev => !prev);
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

                <li className="navbar__item navbar__item--wallet" title={NAVBAR_STRINGS.WALLET.TOOLTIP}>
                    <button className="navbar__button navbar__button--disabled" type="button" disabled>
                        <Wallet size={20} />{NAVBAR_STRINGS.WALLET.CONNECT}
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;