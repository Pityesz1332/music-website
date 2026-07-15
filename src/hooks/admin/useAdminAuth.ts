import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { useAdmin } from "@context/AdminContext";
import { useNotification, NotificationType } from "@context/NotificationContext";
import { ADMIN_AUTH_STRINGS } from "@i18n/feedback/admin/admin-auth";

export const useAdminAuth = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { connectAsAdmin } = useAdmin();
    const { notify } = useNotification();
    const navigate = useNavigate();

    // Connect wallet -> sign -> verify against the admin allowlist (SIWE).
    // Any failure (rejected signature, unauthorized wallet, no wallet) surfaces
    // its own message so the admin knows why sign-in didn't work.
    const handleConnect = async () => {
        setIsLoading(true);

        try {
            await connectAsAdmin();

            navigate(MainRoutes.ADMIN_DASHBOARD);
            notify(ADMIN_AUTH_STRINGS.MESSAGES.ACCEPT, NotificationType.SUCCESS);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : ADMIN_AUTH_STRINGS.MESSAGES.DECLINE;
            notify(message, NotificationType.ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        handleConnect,
    };
};
