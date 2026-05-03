import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MainRoutes } from "@routes/constants/MainRoutes";

export const useAdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [shrink, setShrink] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    
    const isActive = (path: string) => location.pathname === path;
    
    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    // hamburger menu
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    // scrolling
    useEffect(() => {
        const handleScroll = () => {
            setShrink(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        closeMenu();
    }, [location.pathname, closeMenu]);

    // nav handling only
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