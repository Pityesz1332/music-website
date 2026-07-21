import { Wallet } from "lucide-react";
import { NAVBAR_STRINGS } from "@i18n/ui/navbar";

// Wallet sign-in is out of scope for the MVP: the button is shown for continuity
// but disabled, with a hover tooltip explaining why. The pointer-events on the
// disabled button pass hover through to this wrapper so the title tooltip fires.
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
