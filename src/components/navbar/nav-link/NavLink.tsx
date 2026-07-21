// Extracted list items
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
    path: string;
    label: string;
    Icon: LucideIcon;
    isActive: boolean;
    onClick: () => void;
}
 
// path prop could be useful in the future
export const NavLink = ({ path, label, Icon, isActive, onClick }: NavLinkProps) => {
    return (
        <div
            className={`navbar__item ${isActive ? "navbar__item--active" : ""}`}
            onClick={onClick}
        >
            <Icon className="navbar__item-icon" size={28} />
            <span className="navbar__item-text">{label}</span>
        </div>
    );
};