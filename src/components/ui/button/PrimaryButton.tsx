// "Okos" gomb komponens
import { useNavigate } from "react-router-dom";

interface PrimaryButtonProps {
    children: React.ReactNode; 
    className?: string;
    to?: string;
    disabled?: boolean;
    type?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const PrimaryButton = ({
    children,
    className = "",
    to,
    disabled,
    type,
    onClick
}: PrimaryButtonProps) => {
    const navigate = useNavigate();

    const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        if (to) navigate(to);
        if (onClick) onClick(e);
    };

    return (
        <button
            className={className}
            onClick={handlePress}
            disabled={disabled}
        >
            {children}
        </button>
    );
}