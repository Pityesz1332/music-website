import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Menu, X, Heart, Music, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { useLoading } from "../../context/LoadingContext";
import "../Navbar/Navbar.scss";

const ConnectedNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { disconnect } = useAuth();
    const { notify } = useNotification();
    const { showLoading, hideLoading } = useLoading();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isShrunk, setIsShrunk] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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

    function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            navigate(`/songs?search=${encodeURIComponent(searchTerm)}`);
            setSearchTerm("");
        }
    }

    function toggleMenu() {
        setIsMenuOpen(prev => !prev);
    }

    async function handleDisconnect() {
        try {
            showLoading();
            await disconnect();
            hideLoading();
            navigate("/");
            notify("Disconnected", "success");
        } catch(err) {
            hideLoading();
            notify("Error", "error");
        }
    }

    return (
        <>
            <nav className={`navbar connected-navbar ${isShrunk ? "shrink" : ""}`}>
                <div className="logo" onClick={() => navigate("/")}>DJ Enez</div>

                <div className="nav-center">
                    <input
                        className="searchbar"                        
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
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
                    <li
                        className={`nav-menu-item ${location.pathname === "/saved" ? "active" : ""}`}
                        onClick={() => { navigate("/saved"); setIsMenuOpen(false); }}
                    >
                        <Heart size={28} /> Favorites
                    </li>
                    <li
                        className={`${location.pathname === "/myaccount" ? "active" : ""}`}
                        onClick={() => { navigate("/myaccount"); setIsMenuOpen(false); }}
                    >
                    <User size={28} />
                    </li>
                    <li className="connect-wallet-btn">
                        <button type="button" onClick={handleDisconnect}>Disconnect</button>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default ConnectedNavbar;