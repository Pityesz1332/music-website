import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";
import { NavLink } from "../nav-link/NavLink";
import { PrimaryButton } from "../../ui/button/PrimaryButton";
import { Modal } from "@components/ui/modal/Modal";
import { NAVBAR_STRINGS } from "@i18n/ui/navbar";
import { NAV_CONFIG } from "@constants/ui/navbar";
import { useAuth } from "@context/AuthContext";
import { useConnect } from "@hooks/auth/useConnect";
import { useDisconnect } from "@hooks/auth/useDisconnect";
import { useDeveloperMode } from "@hooks/auth/useDeveloperMode";

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
    const { handleDevConnect } = useDeveloperMode();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const onConnectClick = () => {
        setIsModalOpen(true);
    }

    const confirmConnect = () => {
        handleDemoConnect();
        setIsModalOpen(false);
        onClose();
    }

    const confirmDeveloperConnect = () => {
        handleDevConnect();
        setIsModalOpen(false);
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Choose a connection method"
                description="Connect with passkey or developer connect (test only)"
                buttons={
                    <>
                        <PrimaryButton onClick={confirmConnect}>
                            Connect with Passkey
                        </PrimaryButton>
                        <PrimaryButton onClick={confirmDeveloperConnect}>
                            Use Dev Connect
                        </PrimaryButton>
                        <button
                            className="modal__cancel-btn"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </>
                }
            ></Modal>
        </div>
    );
}