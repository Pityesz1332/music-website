import { Wallet } from "lucide-react";
import { NavLink } from "../nav-link/NavLink";
import { PrimaryButton } from "../../ui/button/PrimaryButton";
import { NAVBAR_STRINGS } from "@i18n/ui/navbar";
import { useNavMenu } from "@hooks/navbar/useNavMenu";

interface NavMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NavMenu = ({ isOpen, onClose }: NavMenuProps) => {
    const {
        menuItems,
        location,
        handleNavigation,
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

            {/* User wallet sign-in is not part of the MVP. The button stays for
                continuity but is disabled; a friendly tooltip explains why. */}
            <div
                className="navbar__item navbar__item--wallet"
                title={NAVBAR_STRINGS.WALLET.TOOLTIP}
            >
                <PrimaryButton
                    className="navbar__button navbar__button--disabled"
                    type="button"
                    disabled
                >
                    <Wallet size={20} />
                    {NAVBAR_STRINGS.WALLET.CONNECT}
                </PrimaryButton>
            </div>
        </div>
    );
}
