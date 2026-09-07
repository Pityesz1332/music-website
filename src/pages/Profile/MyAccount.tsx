import { MY_ACCOUNT_STRINGS } from "@i18n/ui/my-account";
import { useAccountActions } from "@hooks/user-account/useAccountActions";
import { useMusic } from "@context/MusicContext";
import { ProfileAvatar } from "./profile-avatar/ProfileAvatar";
import { WalletSection } from "./wallet-section/WalletSection";
import { HistoryModal } from "./history-modal/HistoryModal";
import { StatsDashboard } from "./stats-dashboard/StatsDashboard";
import { RecentlyPlayed } from "../../components/recently-played/RecentlyPlayed";
import "./MyAccount.scss";

export const MyAccount = () => {
    const { recentlyPlayed } = useMusic();
    const {
        avatar,
        shortWallet,
        isModalOpen,
        hasRecentlyPlayed,
        handleAvatarChange,
        handleCopyWallet,
        handleClearHistory,
        openModal,
        closeModal
    } = useAccountActions();

    return (
        <div className="my-account">
            <h1 className="my-account__title">{MY_ACCOUNT_STRINGS.TITLE}</h1>

            <div className="my-account__profile-section">
                <ProfileAvatar avatar={avatar} onChange={handleAvatarChange} />
                <WalletSection address={shortWallet} onCopy={handleCopyWallet} />

                <StatsDashboard recentlyPlayed={recentlyPlayed} />

                <div className="recent-wrapper__profile">
                    <RecentlyPlayed isProfilePage />

                    {/* clear history (if any) */}
                    <div className="recent-wrapper__header">
                        {hasRecentlyPlayed && (
                            <button
                                className="recent-wrapper__clear-history-btn"
                                onClick={openModal}
                            >
                                {MY_ACCOUNT_STRINGS.BUTTONS.CLEAR_HISTORY}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <HistoryModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleClearHistory}
            />
        </div>
    );
}
