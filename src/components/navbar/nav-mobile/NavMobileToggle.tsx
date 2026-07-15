import { Menu, X } from "lucide-react";

interface NavMobileToggleProps {
    isOpen: boolean;
    onToggle: () => void;
}

export const NavMobileToggle = ({ isOpen, onToggle }: NavMobileToggleProps) => {
    return (
        <div className="navbar__hamburger" onClick={onToggle}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
    );
};