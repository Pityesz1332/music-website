import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Wallet, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function PublicNavbar({ onLogoutClick }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, loginUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [isShrunk, setIsShrunk] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [clickCount, setClickCount] = useState(0);

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
        setIsMenuOpen(!isMenuOpen);
    }

    function handleDemoConnect() {
        setClickCount(prev => {
            const newCount = prev + 1;

            if (newCount === 2) {
                loginUser({ role: "user", wallet: "0x123456789DEMO" });
                return 0;
            }

            setTimeout(() => {
                setClickCount(curr => (curr === 1 ? 0 : curr));
            }, 500);

            return newCount;
        });
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

                {!auth && (
                    <li className="connect-wallet-btn">
                        <button type="button" onClick={handleDemoConnect}>
                            Connect Wallet
                        </button>
                    </li>
                )}
            </ul>
        </nav>
        </>
    );
}

export default PublicNavbar;