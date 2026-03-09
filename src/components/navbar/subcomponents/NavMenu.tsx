import { useNavigate, useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";
import { NavLink } from "./NavLink";
import { PrimaryButton } from "../../ui/button/PrimaryButton";
import { NAVBAR_STRINGS } from "../../../constant-strings/ui/navbar";
import { PUBLIC_NAV_ITEMS, PROTECTED_NAV_ITEMS } from "../../../constants/ui/navbar";
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

    const renderNavLink = (item: any) => (
        <NavLink
            key={item.path}
            path={item.path}
            label={item.label}
            Icon={item.Icon}
            isActive={location.pathname === item.path}
            onClick={() => { navigate(item.path); onClose(); }}
        />
    );

    return (
        <ul className={`navbar__menu ${isOpen ? "navbar__menu--open" : ""}`}>
            {PUBLIC_NAV_ITEMS.map(renderNavLink)}

            {isConnected && PROTECTED_NAV_ITEMS.map(renderNavLink)}

            <li className="navbar__item navbar__item--wallet">
                {isConnected ? (
                    <PrimaryButton className="navbar__button" type="button" onClick={() => { handleDisconnect(); onClose(); }}>
                        {NAVBAR_STRINGS.WALLET.DISCONNECT}
                    </PrimaryButton>
                ) : (
                    <PrimaryButton className="navbar__button" type="button" onClick={() => { handleDemoConnect(); onClose(); }}>
                        <Wallet size={20} />
                        {NAVBAR_STRINGS.WALLET.CONNECT}
                    </PrimaryButton>
                )}
            </li>
        </ul>
    );
}