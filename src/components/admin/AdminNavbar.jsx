import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/AdminNavbar.css";

function AdminNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [shrink, setShrink] = useState(false);
    const isActive = (path) => location.pathname === path;

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

    return (
        <nav className={`admin-navbar ${shrink ? "shrink" : ""}`}>
            <div className="admin-logo">Admin Panel</div>

            <ul className="admin-links">
                <li className={isActive("/admin") ? "active" : ""}>
                    <Link to="/admin">Dashboard</Link>
                </li>
                <li className={isActive("/admin/songs") ? "active" : ""}>
                    <Link to="/admin/songs">Songs/Mixes</Link>
                </li>
                <li className={isActive("/admin/users") ? "active" : ""}>
                    <Link to="/admin/users">Users</Link>
                </li>
            </ul>

            <div className="admin-right">
                <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default AdminNavbar;