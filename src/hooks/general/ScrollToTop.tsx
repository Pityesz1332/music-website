import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// mindig az oldal tetejére dob
export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}