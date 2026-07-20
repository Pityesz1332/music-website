import { useState, useEffect } from "react";

// Handling navbar appearance on scroll and hamburger menu logic.
export const useNavbarUI = (scrollLimit = 50) => {
    const [isShrunk, setIsShrunk] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > scrollLimit) {
                setIsShrunk(true);
            } else {
                setIsShrunk(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [scrollLimit]);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const closeMenu = () => setIsMenuOpen(false);
    
    return {
        isShrunk,
        isMenuOpen,
        toggleMenu,
        closeMenu
    };
};