import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { useNotification, NotificationType } from "@context/NotificationContext";
import { useLoading } from "@context/LoadingContext";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { WALLET_AUTH_STRINGS } from "@i18n/feedback/wallet-connect";

export const useDisconnect = () => {
    const navigate = useNavigate();
    const { disconnect } = useAuth();
    const { notify } = useNotification();
    const { showLoading, hideLoading } = useLoading();

    // Disconnecting -> changing navbar.
    // Artificially delayed to simulate and test loading behavior.
    const handleDisconnect = async () => {
        try {
            showLoading();
            await disconnect();
            hideLoading();
            navigate(MainRoutes.HOME);
            notify(WALLET_AUTH_STRINGS.DISCONNECT_MESSAGES.DISCONNECT, NotificationType.SUCCESS);
        } catch(err) {
            hideLoading();
            notify(WALLET_AUTH_STRINGS.ERROR, NotificationType.ERROR);
        }
    };

    return { handleDisconnect };
};