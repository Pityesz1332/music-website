import { useState } from "react";
import "../styles/pages/MyAccount.css";
import { Copy } from "lucide-react";
import { useNotification } from "../context/NotificationContext";

function MyAccount() {
    const [avatar, setAvatar] = useState(null);
    const walletAddress = "0x123456789DEMO";
    const shortWallet = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
    const { notify } = useNotification();
    
    function handleAvatarChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
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

export default MyAccount;