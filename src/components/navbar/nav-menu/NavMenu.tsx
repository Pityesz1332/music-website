import { Wallet } from "lucide-react";
import { NavLink } from "../nav-link/NavLink";
import { PrimaryButton } from "../../ui/button/PrimaryButton";
import { ConnectModal } from "./ConnectModal";
import { NAVBAR_STRINGS } from "@i18n/ui/navbar";
import { useNavMenu } from "@hooks/navbar/useNavMenu";

interface NavMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NavMenu = ({ isOpen, onClose }: NavMenuProps) => {
    const {
        menuItems,
        isModalOpen, setIsModalOpen,
        isConnected,
        location,
        handleNavigation,
        onConnectClick,
        confirmConnect,
        confirmDeveloperConnect,
        onDisconnectClick
    } = useNavMenu(onClose);

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

            <ConnectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirmDemo={confirmConnect}
                onConfirmDev={confirmDeveloperConnect}
            />
        </div>
    );
}