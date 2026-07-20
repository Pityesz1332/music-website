import { useNavigate } from "react-router-dom";
import { MainRoutes } from "@routes/constants/MainRoutes";

interface NavLogoProps {
    className?: string;
    onClick?: () => void;
}

export const NavLogo = ({ className, onClick }: NavLogoProps) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate(MainRoutes.HOME);
        if (onClick) onClick();
    };

    return (
        <div className={className || "navbar__logo"} onClick={handleLogoClick}>
            DJ Enez
        </div>
    );
};