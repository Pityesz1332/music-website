import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { useAdmin } from "@context/AdminContext";
import { useNotification, NotificationType } from "@context/NotificationContext";
import { ADMIN_AUTH_STRINGS } from "@i18n/feedback/admin/admin-auth";

export const useAdminAuth = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { isAdmin, error, signInAsAdmin } = useAdmin();
    const { notify } = useNotification();
    const navigate = useNavigate();

    // On successful sign-in, route to the admin dashboard.
    useEffect(() => {
        if (isAdmin) {
            navigate(MainRoutes.ADMIN_DASHBOARD);
            notify(ADMIN_AUTH_STRINGS.MESSAGES.ACCEPT, NotificationType.SUCCESS);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin]);

    useEffect(() => {
        if (error) {
            notify(error, NotificationType.ERROR);
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    const handleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInAsAdmin();
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        handleSignIn,
    };
};
