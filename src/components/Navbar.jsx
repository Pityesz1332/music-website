import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Wallet, Menu, X } from "lucide-react";
import "../styles/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isShrunk, setIsShrunk] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [demoConnect, setDemoConnect] = useState(false);
    const [clickCount, setClickCount] = useState(0);

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

    function handleDemoConnect() {
        setClickCount(prev => {
            const newCount = prev + 1;

            if (newCount === 2) {
                setDemoConnect(true);
                return 0;
            }

            setTimeout(() => {
                setClickCount(curr => (curr === 1 ? 0 : curr));
            }, 500);

            return newCount;
        });
    }

    function handleDemoDisconnect() {
        setDemoConnect(false);
        setClickCount(0);
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

                {demoConnect ? (
                    <>
                        <li className="connect-wallet-btn" onClick={() => { handleDemoDisconnect(); setIsMenuOpen(false); }}>
                            <button>Disconnect</button>
                        </li>
                    </>
                ) : (
                    <li className="connect-wallet-btn">
                    <button onClick={() => { handleDemoConnect(); setIsMenuOpen(false); }}>
                        <Wallet size={13} style={{ paddingRight: "0.3rem" }} />
                        Connect Wallet
                    </button>
                    </li>
                )}
            </ul>
        </nav>
        </>
    );
}

export default Navbar;