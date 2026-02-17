import { useAuth } from "../../context/AuthContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";
import { useLoading } from "../../context/LoadingContext";

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
            notify("Wallet connected", NotificationType.SUCCESS);
        } catch(err) {
            hideLoading();
            console.error(err);
            notify("Something went wrong", NotificationType.ERROR);
        }
    };

    return { handleDemoConnect };
};