import { useAuth } from "@context/AuthContext";
import { useNotification, NotificationType } from "@context/NotificationContext";

// dev login (temporary)
export const useDeveloperMode = () => {
    const { devLogin } = useAuth();
    const { notify } = useNotification();

    const handleDevConnect = () => {
        devLogin();
        notify("Dev Connect: Active", NotificationType.SUCCESS);
    };

    return { handleDevConnect };
};