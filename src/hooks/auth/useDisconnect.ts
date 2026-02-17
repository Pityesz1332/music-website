import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";
import { useLoading } from "../../context/LoadingContext";
import { MainRoutes } from "../../routes/constants/Main_Routes";

export const useDisconnect = () => {
    const navigate = useNavigate();
    const { disconnect } = useAuth();
    const { notify } = useNotification();
    const { showLoading, hideLoading } = useLoading();

    // kijelentkezés -> sima navbar-ra váltás
    // ez kicsit késleltetve van a töltés tesztje miatt
    const handleDisconnect = async () => {
        try {
            showLoading();
            await disconnect();
            hideLoading();
            navigate(MainRoutes.HOME);
            notify("Disconnected", NotificationType.SUCCESS);
        } catch(err) {
            hideLoading();
            notify("Error", NotificationType.ERROR);
        }
    };

    return { handleDisconnect };
};