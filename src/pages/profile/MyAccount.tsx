import { RecentlyPlayed } from "@components/recently-played/RecentlyPlayed";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { MY_ACCOUNT_STRINGS } from "@i18n/ui/my-account";
import { useAccountActions } from "@hooks/user-account/useAccountActions";
import { HistoryModal } from "./history-modal/HistoryModal";
import { ProfileAvatar } from "./profile-avatar/ProfileAvatar";
import { WalletSection } from "./wallet-section/WalletSection";
import "./MyAccount.scss";

export const MyAccount = () => {
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
                
                <div className="recent-wrapper__profile">
                    <RecentlyPlayed isProfilePage={true} />
                
                {/* deleting history */}
                    <div className="recent-wrapper__header">
                        {hasRecentlyPlayed && (
                            <PrimaryButton 
                                className="recent-wrapper__clear-history-btn"
                                onClick={openModal}
                            >
                                {MY_ACCOUNT_STRINGS.BUTTONS.CLEAR_HISTORY}
                            </PrimaryButton>
                        )}
                    </div>

                    <HistoryModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        onConfirm={handleClearHistory}
                    />
                </div>
            </div>
        </div>
    );
}