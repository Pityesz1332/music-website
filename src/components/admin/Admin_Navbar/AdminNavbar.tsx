import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./AdminNavbar.scss";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [shrink, setShrink] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    
    const isActive = (path: string) => location.pathname === path;

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

    function handleDisconnect() {
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
                    <button className="admin-logout-btn" onClick={handleDisconnect}>Disconnect</button>
                </li>
            </ul>

            <div className="admin-right">
                <button className="admin-logout-btn" onClick={handleDisconnect}>Disconnect</button>
            </div>
        </nav>
    );
}

export default AdminNavbar;