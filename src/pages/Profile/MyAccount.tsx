import { ChangeEvent, useState } from "react";
import "./MyAccount.scss";
import { Copy } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

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
        <div className="myaccount-container">
            <h1>My Account</h1>

            <div className="profile-block">
                <div className="avatar-wrapper">
                    <img src={avatar || "/assets/default-avatar.jpg"} alt="Avatar" className="avatar" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="avatar-input" />
                </div>

                <div className="wallet-block">
                    <span className="wallet-address">{shortWallet}</span>
                    <button onClick={copyWallet} className="copy-button"><Copy />Copy</button>
                </div>
            </div>
        </div>
    );
}