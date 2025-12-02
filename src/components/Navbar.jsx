import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Wallet, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { connect } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [isShrunk, setIsShrunk] = useState(false);
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
            setSearchTerm("");
        }
    }

    function toggleMenu() {
        setIsMenuOpen(prev => !prev);
    }

    function handleDemoConnect() {
        connect();
    }

    return (
        <>
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
                <li
                    className={location.pathname === "/" ? "active" : ""}
                    onClick={() => { navigate("/"); setIsMenuOpen(false) }}
                >
                Home
                </li>
                <li
                    className={location.pathname === "/songs" ? "active" : ""}
                    onClick={() => { navigate("/songs"); setIsMenuOpen(false); }}
                >
                Songs/Mixes
                </li>
                <li className="connect-wallet-btn">
                    <button type="button" onClick={handleDemoConnect}><Wallet size={10} />Connect Wallet</button>
                </li>
            </ul>
        </nav>
        </>
    );
}

export default Navbar;