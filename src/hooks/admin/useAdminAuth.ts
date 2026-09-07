import { useEffect, useRef, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { useAdmin } from "@context/AdminContext";
import { useNotification, NotificationType } from "@context/NotificationContext";
import { ADMIN_AUTH_STRINGS } from "@i18n/feedback/admin/admin-auth";
import { createAttemptTracker } from "../../swarm/attempt";

export const useAdminAuth = () => {
    const [isPasskeyLoading, setIsPasskeyLoading] = useState<boolean>(false);
    const [isKeyLoading, setIsKeyLoading] = useState<boolean>(false);
    const [rawKey, setRawKey] = useState<string>("");

    const { isAdmin, error, canUsePasskey, signInWithPasskey, signInWithRawKey } = useAdmin();
    const { notify } = useNotification();
    const navigate = useNavigate();

    // Guards the passkey ceremony against a cancel/retry racing its result —
    // see src/swarm/attempt.ts.
    const attemptsRef = useRef(createAttemptTracker());
    const controllerRef = useRef<AbortController | undefined>(undefined);

    // Leaving the page must not let a stale ceremony flip busy state back on
    // for an unmounted component.
    useEffect(
        () => () => {
            attemptsRef.current.supersede();
            controllerRef.current?.abort();
        },
        [],
    );

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
        const attempt = attemptsRef.current.begin();
        const controller = new AbortController();
        controllerRef.current = controller;
        setIsPasskeyLoading(true);
        try {
            await attempt.guard(signInWithPasskey(controller.signal));
        } catch {
            // SupersededError from a cancel/retry — that call already reset
            // the busy state, nothing further to do here.
        } finally {
            if (attempt.current) {
                setIsPasskeyLoading(false);
                controllerRef.current = undefined;
            }
        }
    };

    /** Abort the in-flight passkey prompt and return the UI to idle. */
    const cancelPasskeySignIn = () => {
        attemptsRef.current.supersede();
        controllerRef.current?.abort();
        controllerRef.current = undefined;
        setIsPasskeyLoading(false);
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
        cancelPasskeySignIn,
        handleRawKeySignIn,
    };
};
