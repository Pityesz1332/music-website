import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../../styles/AdminNavbar.css";

function AdminNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [shrink, setShrink] = useState(false);
    const isActive = (path) => location.pathname === path;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        function handleScroll() {
            if (window.scrollY > 30) {
                setShrink(true);
            } else {
                setShrink(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function handleLogout() {
        navigate("/");
    }

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <nav className={`admin-navbar ${shrink ? "shrink" : ""}`}>
            <div className="admin-logo">DJ Enez (Admin)</div>

            <div className="admin-hamburger" onClick={toggleMenu}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </div>

            <ul className={isMenuOpen ? "open" : ""}>
                <li className={isActive("/admin") ? "active" : ""}>
                    <Link to="/admin">Dashboard</Link>
                </li>
                <li className={isActive("/admin/songs") ? "active" : ""}>
                    <Link to="/admin/songs">Songs/Mixes</Link>
                </li>
                <li className={isActive("/admin/users") ? "active" : ""}>
                    <Link to="/admin/users">Users</Link>
                </li>
                
                <li className="mobile-logout">
                    <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
                </li>
            </ul>

            <div className="admin-right">
                <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default AdminNavbar;