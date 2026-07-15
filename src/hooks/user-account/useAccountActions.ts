import { useState, useMemo } from "react";
import { useMusic } from "@context/MusicContext";
import { useNotification, NotificationType } from "@context/NotificationContext";
import { useAvatarUpload } from "@hooks/user-account/useAvatarUpload";
import { useClipboard } from "@hooks/user-account/useClipboard";
import { MY_ACCOUNT_STRINGS } from "@i18n/ui/my-account";

// MOCK
export const useAccountActions = () => {
    const walletAddress = "0x123456789DEMO";

    const { avatar, handleAvatarChange } = useAvatarUpload(null);
    const { copyToClipboard } = useClipboard();
    const { notify } = useNotification();
    const { clearRecentlyPlayed, recentlyPlayed } = useMusic();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const shortWallet = useMemo(() => 
        walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4),
    [walletAddress]);

    const handleCopyWallet = () => {
        copyToClipboard(walletAddress, "Wallet address copied");
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleClearHistory = () => {
        clearRecentlyPlayed();
        notify(MY_ACCOUNT_STRINGS.MESSAGE, NotificationType.SUCCESS);
        closeModal();
    };

    return {
        avatar,
        shortWallet,
        isModalOpen,
        hasRecentlyPlayed: recentlyPlayed.length > 0,
        handleAvatarChange,
        handleCopyWallet,
        handleClearHistory,
        openModal,
        closeModal
    };
}