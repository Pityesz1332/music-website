import { Copy } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { MY_ACCOUNT_STRINGS } from "@i18n/ui/my-account";
import "./WalletSection.scss";

interface WalletSectionProps {
    address: string;
    onCopy: () => void;
}

// copy wallet gomb a profil oldalon
export const WalletSection = ({ address, onCopy }: WalletSectionProps) => {
    return (
        <div className="my-account__wallet-info">
            <span className="my-account__wallet-address">{address}</span>
            <PrimaryButton onClick={onCopy} className="my-account__copy-button">
                <Copy size={16} />
                <span className="my-account__copy-text">
                    {MY_ACCOUNT_STRINGS.BUTTONS.COPY}
                </span>
            </PrimaryButton>
        </div>
    );
};