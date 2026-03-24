import { useAuth } from "@context/AuthContext";
import { useNotification, NotificationType } from "@context/NotificationContext";
import { useLoading } from "@context/LoadingContext";
import { WALLET_AUTH_STRINGS } from "@i18n/feedback/wallet-connect";

export const useConnect = () => {
    const { connect } = useAuth();
    const { notify } = useNotification();
    const { showLoading, hideLoading } = useLoading();

    // demo bejelentkezés (wallet connect)
    const handleDemoConnect = async () => {
        try {
            showLoading();
            await connect();
            hideLoading();
            notify(WALLET_AUTH_STRINGS.CONNECT_MESSAGES.CONNECT, NotificationType.SUCCESS);
        } catch(err) {
            hideLoading();
            console.error(err);
            notify(WALLET_AUTH_STRINGS.ERROR, NotificationType.ERROR);
        }
    };

    return { handleDemoConnect };
};