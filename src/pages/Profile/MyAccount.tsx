import { Copy } from "lucide-react";
import { useMusic } from "../../context/MusicContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";
import { RecentlyPlayed } from "../../components/Recently_Played/RecentlyPlayed";
import { useAvatarUpload } from "../../hooks/useAvatarUpload";
import { useClipboard } from "../../hooks/useClipboard";
import "./MyAccount.scss";

export const MyAccount = () => {
    const walletAddress = "0x123456789DEMO";
    const shortWallet = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

    const { avatar, handleAvatarChange } = useAvatarUpload(null);
    const { copyToClipboard } = useClipboard();
    const { notify } = useNotification();
    const { clearRecentlyPlayed, recentlyPlayed } = useMusic();

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
                    <button onClick={() => copyToClipboard(walletAddress, "Wallet address copied")} className="my-account__copy-button"><Copy size={16} /><span className="my-account__copy-text">Copy</span></button>
                </div>
                
                <div className="recent-wrapper__profile">
                    <RecentlyPlayed />
                
                {/* előzmények törlése (ha van) */}
                    <div className="recent-wrapper__header">
                        {recentlyPlayed.length > 0 && (
                            <button 
                                className="recent-wrapper__clear-history-btn"
                                onClick={() => {
                                    clearRecentlyPlayed();
                                    notify("History cleared", NotificationType.SUCCESS);
                                }}
                            >
                                Clear History
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}