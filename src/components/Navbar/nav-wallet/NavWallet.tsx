import { Wallet } from "lucide-react";
import { NAVBAR_STRINGS } from "@i18n/ui/navbar";

export const NavWallet = () => {
    return (
        <div className="navbar__item navbar__item--wallet" title={NAVBAR_STRINGS.WALLET.TOOLTIP}>
            <button className="navbar__button navbar__button--disabled" type="button" disabled>
                <Wallet size={20} />
                {NAVBAR_STRINGS.WALLET.CONNECT}
            </button>
        </div>
    );
};
