import { useNavigate, useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";
import { NavLink } from "../nav-link/NavLink";
import { PrimaryButton } from "../../ui/button/PrimaryButton";
import { NAVBAR_STRINGS } from "../../../i18n/ui/navbar";
import { NAV_CONFIG } from "../../../constants/ui/navbar";
import { useAuth } from "../../../context/AuthContext";
import { useConnect } from "../../../hooks/auth/useConnect";
import { useDisconnect } from "../../../hooks/auth/useDisconnect";

interface NavMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NavMenu = ({ isOpen, onClose }: NavMenuProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isConnected } = useAuth();
    const { handleDemoConnect } = useConnect();
    const { handleDisconnect } = useDisconnect();

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const onConnectClick = () => {
        handleDemoConnect();
        onClose();
    }

    const onDisconnectClick = () => {
        handleDisconnect();
        onClose();
    }

    const menuItems = NAV_CONFIG.filter(item => !item.isProtected || (item.isProtected && isConnected));

    return (
        <div className={`navbar__menu ${isOpen ? "navbar__menu--open" : ""}`}>
            {menuItems.map((item) => (
                <NavLink
                    key={item.path}
                    path={item.path}
                    label={item.label}
                    Icon={item.Icon}
                    isActive={location.pathname === item.path}
                    onClick={() => handleNavigation(item.path)}
                />
            ))}

            <div className="navbar__item navbar__item--wallet">
                {isConnected ? (
                    <PrimaryButton className="navbar__button" type="button" onClick={onDisconnectClick}>
                        {NAVBAR_STRINGS.WALLET.DISCONNECT}
                    </PrimaryButton>
                ) : (
                    <PrimaryButton className="navbar__button" type="button" onClick={onConnectClick}>
                        <Wallet size={20} />
                        {NAVBAR_STRINGS.WALLET.CONNECT}
                    </PrimaryButton>
                )}
            </div>
        </div>
    );
}