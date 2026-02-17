import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MainRoutes } from "../../routes/constants/Main_Routes";

export const useAdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [shrink, setShrink] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    // segédfüggvény az aktív menüponthoz
    const isActive = (path: string) => location.pathname === path;

    // görgetés figyelése, navbar összenyomása
    useEffect(() => {
        const handleScroll = () => {
            setShrink(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // automatikus navbar zárás oldalváltáskor
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // ez még csak navigációkezelés a kijelentkezéshez
    const handleDisconnect = () => {
        navigate(MainRoutes.HOME);
    };

    // hamburger menü kapcsolója
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    return {
        shrink,
        isMenuOpen,
        isActive,
        handleDisconnect,
        toggleMenu
    };
};