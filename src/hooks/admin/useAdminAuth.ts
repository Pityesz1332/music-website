import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { useAdmin } from "@context/AdminContext";
import { useNotification, NotificationType } from "@context/NotificationContext";
import { ADMIN_AUTH_STRINGS } from "@i18n/feedback/admin/admin-auth";

export const useAdminAuth = () => {
    const [isPasskeyLoading, setIsPasskeyLoading] = useState<boolean>(false);
    const [isKeyLoading, setIsKeyLoading] = useState<boolean>(false);
    const [rawKey, setRawKey] = useState<string>("");

    const { isAdmin, error, canUsePasskey, signInWithPasskey, signInWithRawKey } = useAdmin();
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
            setIsPasskeyLoading(false);
            setIsKeyLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    const handlePasskeySignIn = async () => {
        setIsPasskeyLoading(true);
        try {
            await signInWithPasskey();
        } finally {
            setIsPasskeyLoading(false);
        }
    };

    const handleRawKeySignIn = async (event: FormEvent) => {
        event.preventDefault();
        if (!rawKey.trim()) return;

        setIsKeyLoading(true);
        try {
            await signInWithRawKey(rawKey);
            setRawKey("");
        } finally {
            setIsKeyLoading(false);
        }
    };

    return {
        isPasskeyLoading,
        isKeyLoading,
        canUsePasskey,
        rawKey,
        setRawKey,
        handlePasskeySignIn,
        handleRawKeySignIn,
    };
};
