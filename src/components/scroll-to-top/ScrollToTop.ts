import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// always scrolls to the top of the page
export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }, [pathname]);

    return null;
}