import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginModal from "../components/LoginModal";
import "../styles/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogin, setShowLogin] = useState(false);
    const [isShrunk, setIsShrunk] = useState(false);

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

    return (
        <>
        <nav className={`navbar ${isShrunk ? "shrink" : ""}`}>
            <div className="logo" onClick={() => navigate("/")}>(Pagename)</div>

            <div className="nav-center">
                <input type="text" placeholder="Search..." />
            </div>

            <ul>
                <li
                    className={location.pathname === "/" ? "active" : ""}
                    onClick={() => navigate("/")}
                >
                Home
                </li>
                <li
                    className={location.pathname === "/songs" ? "active" : ""}
                    onClick={() => navigate("/songs")}
                >
                Songs/Mixes
                </li>
                <li
                    className="navbar-login"
                    onClick={() => setShowLogin(true)}
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