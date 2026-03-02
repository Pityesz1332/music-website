// "Okos" gomb komponens
import { useNavigate } from "react-router-dom";

interface ButtonProps {
    children: React.ReactNode; 
    className?: string;
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
    to?: string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({
    children,
    className = "",
    variant = "primary",
    size = "md",
    to,
    disabled,
    onClick
}: ButtonProps) => {
    const navigate = useNavigate();

    const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        if (to) navigate(to);
        if (onClick) onClick(e);
    };

    return (
        <button
            className={`btn btn--${variant} btn--${size} ${className}`}
            onClick={handlePress}
            disabled={disabled}
        >
            {children}
        </button>
    );
}