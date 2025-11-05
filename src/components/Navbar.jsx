import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import LoginModal from "../components/LoginModal";
import { useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
        <nav className="navbar">
            <div className="logo" onClick={() => navigate("/")}>(Pagename)</div>

            <div className="nav-center">
                <input type="text" placeholder="Search..." />
            </div>

            <ul>
                <li onClick={() => navigate("/")}>Home</li>
                <li onClick={() => navigate("/songs")}>Songs/Mixes</li>
                <li onClick={() => setShowLogin(true)}>Login</li>
            </ul>
        </nav>
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </>
    );
}

export default Navbar;