import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Wallet, Menu, X, Music, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
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

    const executeSearch = () => {
        if (searchTerm.trim() !== "") {
            navigate(`/songs?search=${encodeURIComponent(searchTerm)}`);
            setSearchTerm("");
            setIsFocused(false);
        }
    }

    function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            executeSearch();
        }
    }

    function toggleMenu() {
        setIsMenuOpen(prev => !prev);
    }

    async function handleDemoConnect() {
        try {
            showLoading();
            await connect();
            hideLoading();
            notify("Wallet connected", "success");
        } catch(err) {
            hideLoading();
            console.error(err);
            notify("Something went wrong", "error");
        }
    }

    return (
        <>
        <nav className={`navbar ${isShrunk ? "shrink" : ""}`}>
            <div className="logo" onClick={() => navigate("/")}>DJ Enez</div>

            <div className="nav-center">
                <div className="search-wrapper">
                    <input
                        className="searchbar"
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />

                    {(searchTerm || isFocused) && (
                        <Search className="search-icon" size={18} onClick={executeSearch} />
                    )}
                </div>
            </div>

            <div className="hamburger" onClick={toggleMenu}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </div>

            <ul className={isMenuOpen ? "open" : ""}>
                <li
                    className={`nav-menu-item ${location.pathname === "/songs" ? "active" : ""}`}
                    onClick={() => { navigate("/songs"); setIsMenuOpen(false); }}
                >
                <Music size={28} />Songs/Mixes
                </li>
                <li className="connect-wallet-btn">
                    <button type="button" onClick={handleDemoConnect}><Wallet size={20} />Connect Wallet</button>
                </li>
            </ul>
        </nav>
        </>
    );
}

export default Navbar;