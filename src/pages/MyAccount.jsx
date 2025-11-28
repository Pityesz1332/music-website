import React from "react";
import { useAuth } from "../context/AuthContext";
import { Wallet, Settings, Copy, Shield} from "lucide-react";
import "../styles/MyAccount.css";

function MyAccount() {
    const { auth } = useAuth();

    const walletShort = `${auth.wallet.slice(0, 6)}...${auth.wallet.slice(-4)}`

    function copyWallet() {
        navigator.clipboard.writeText(auth.wallet); 
    }

    return (
        <div className="account-container">
            <h1 className="account-title">My Account</h1>

            <div className="account-sections">

                <section className="account-card">
                    <h2 className="account-card-title">
                        <Wallet size={20} /> Wallet
                    </h2>

                    <div className="account-info">
                        <p><strong>Address:</strong> {walletShort}</p>
                        <button className="account-btn small" onClick={copyWallet}>
                            <Copy size={16} /> Copy address
                        </button>
                    </div>
                </section>

                <section className="account-card">
                    <h2 className="account-card-title">
                        <Shield size={20} /> Security
                    </h2>
                
                    <div className="account-actions">
                        <button className="account-btn">Refresh signature</button>
                        <button className="account-btn">View login history</button>
                    </div>
                </section>

                <section className="account-card">
                    <h2 className="account-card-title">My Library</h2>

                    <ul className="account-list">
                        <li>Favorites</li>
                        <li>My Playlist</li>
                        <li>Recently Played</li>
                    </ul>
                </section>

                <section className="account-card">
                    <h2 className="account-card-title">
                        <Settings size={20} /> Swarm Storage
                    </h2>

                    <div className="account-info">
                        <p><strong>Storage:</strong> 300Mb</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MyAccount;