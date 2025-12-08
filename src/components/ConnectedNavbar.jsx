import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useLoading } from "../context/LoadingContext";
import "../styles/components/Navbar.css";

function ConnectedNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { disconnect } = useAuth();
    const { notify } = useNotification();
    const { showLoading, hideLoading } = useLoading();
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
                        onClick={() => { navigate("/"); setIsMenuOpen(false); }}
                    >
                    Home
                    </li>
                    <li
                        className={location.pathname === "/songs"}
                        onClick={() => { navigate("/songs"); setIsMenuOpen(false); }}
                    >
                        Songs/Mixes
                    </li>
                    <li
                        className={location.pathname === "/saved"}
                        onClick={() => { navigate("/saved"); setIsMenuOpen(false); }}
                    >
                        <Heart size={28} />
                    </li>
                    <li
                        className={location.pathname === "/myaccount"}
                        onClick={() => { navigate("/myaccount"); setIsMenuOpen(false); }}
                    >
                        0x123...9DEMO
                    </li>
                    <li className="connect-wallet-btn">
                        <button type="button" onClick={handleDisconnect}>Disconnect Wallet</button>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default ConnectedNavbar;