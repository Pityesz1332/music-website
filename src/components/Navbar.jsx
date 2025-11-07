import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import LoginModal from "../components/LoginModal";
import { useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
        <nav className="navbar">
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