import { useNavigate, useLocation } from "react-router-dom";
import { X, Menu, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function UserNavbar({ onLogoutClick }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const [isShrunk, setIsShrunk] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    function handleSearch(e) {
        if (e.key === "Enter") {
            navigate(`/songs?search=${encodeURIComponent(searchTerm)}`);
            searchTerm("");
        }
    }

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <nav className={`navbar ${isShrunk ? "shrink" : ""}`}>
            <div className="logo" onClick={() => navigate("/")}>DJ Enez</div>

            <div className="nav-center">
                <input
                    className="searchbar"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>

            <div className="hamburger" onClick={toggleMenu}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </div>

            <ul className={isMenuOpen ? "open" : ""}>
                <li className={location.pathname === "/" ? "active" : ""} onClick={() => navigate("/")}>Home</li>
                <li className={location.pathname === "/songs" ? "active" : ""} onClick={() => navigate("/songs")}>Songs/Mixes</li>
                <li className={location.pathname === "/saved" ? "active" : ""} onClick={() => navigate("/saved")}><Heart /></li>
                <li className={`wallet-display ${location.pathname === "/myaccount" ? "active" : ""}`} onClick={() => navigate("/myaccount")}>{auth.wallet.slice(0, 6)}...{auth.wallet.slice(-4)}</li>
                <li className="connect-wallet-btn"><button type="button" onClick={onLogoutClick}>Disconnect</button></li>
            </ul>
        </nav>
    );
}

export default UserNavbar;