import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import LoginModal from "../components/LoginModal";
import "../styles/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogin, setShowLogin] = useState(false);
    const [isShrunk, setIsShrunk] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
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
        setIsMenuOpen(!isMenuOpen);
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
                    onClick={() => navigate("/")}
                >
                Home
                </li>
                <li
                    className={location.pathname === "/songs" ? "active" : ""}
                    onClick={() => { navigate("/songs"); setIsMenuOpen(false); }}
                >
                Songs/Mixes
                </li>
                <li
                    className="navbar-login"
                    onClick={() => { setShowLogin(true); setIsMenuOpen(false); }}
                >
                <button>
                Login
                </button>
                </li>
            </ul>
        </nav>
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </>
    );
}

export default Navbar;