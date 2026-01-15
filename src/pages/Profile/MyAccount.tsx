import { ChangeEvent, useState } from "react";
import { Copy } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { RecentlyPlayed } from "../../components/Recently_Played/RecentlyPlayed";
import "./MyAccount.scss";

export const MyAccount = () => {
    const [avatar, setAvatar] = useState<string | null>(null);
    const walletAddress = "0x123456789DEMO";
    const shortWallet = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
    const { notify } = useNotification();
    
    function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    function copyWallet() {
        navigator.clipboard.writeText(walletAddress);
        notify("Wallet address copied to clipboard", "success");
    }

    return (
        <div className="my-account">
            <h1 className="my-account__title">My Account</h1>

            <div className="my-account__profile-section">
                <div className="my-account__avatar-container">
                    <img src={avatar || "/assets/default-avatar.jpg"} alt="Avatar" className="my-account__avatar-image" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="my-account__avatar-input" />
                </div>

                <div className="my-account__wallet-info">
                    <span className="my-account__wallet-address">{shortWallet}</span>
                    <button onClick={copyWallet} className="my-account__copy-button"><Copy size={16} /><span className="my-account__copy-text">Copy</span></button>
                </div>
                
                <div className="recent-wrapper__profile">
                    <RecentlyPlayed />
                </div>
            </div>
        </div>
    );
}