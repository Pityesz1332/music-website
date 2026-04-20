import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MainRoutes } from "@routes/constants/MainRoutes";

export const useAdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [shrink, setShrink] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    
    // segédfüggvény az aktív menüponthoz
    const isActive = (path: string) => location.pathname === path;
    
    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    // hamburger menü kapcsolója
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

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
        closeMenu();
    }, [location.pathname, closeMenu]);

    // ez még csak navigációkezelés a kijelentkezéshez
    const handleDisconnect = () => {
        closeMenu();
        navigate(MainRoutes.HOME);
    };

    return {
        shrink,
        isMenuOpen,
        isActive,
        handleDisconnect,
        toggleMenu,
        closeMenu
    };
};