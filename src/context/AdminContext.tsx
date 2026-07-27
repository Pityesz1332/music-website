import { createContext, useContext, useState, useSyncExternalStore, ReactNode } from "react";
import { useLoading } from "./LoadingContext";
import { clearFeedKey, setFeedKey, feedKeyMatchesOwner, hasFeedKey, subscribeToFeedKey } from "../swarm/feedKey";
import { hasEnrolledPasskey, isPasskeySupported, unlockVault } from "../swarm/passkeyAuth";
import { clearWriteUrl, setWriteUrl } from "../swarm/writeConfig";
import { FEED_OWNER_ADDRESS } from "../swarm/swarmService";

interface AdminContextType {
    isAdmin: boolean;
    error: string | null;
    canUsePasskey: boolean;
    signInWithPasskey: () => Promise<void>;
    signInWithRawKey: (hexKey: string) => Promise<void>;
    disconnectAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
    children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
    const [error, setError] = useState<string | null>(null);
    const { showLoading, hideLoading } = useLoading();

    const isAdmin = useSyncExternalStore(subscribeToFeedKey, hasFeedKey, () => false);

    const canUsePasskey = isPasskeySupported() && hasEnrolledPasskey();

    function applyFeedKey(hexKey: string) {
        setFeedKey(hexKey);
        if (FEED_OWNER_ADDRESS && !feedKeyMatchesOwner(FEED_OWNER_ADDRESS)) {
            clearFeedKey();
            throw new Error("This key does not match the configured feed owner.");
        }
    }

    async function signInWithPasskey() {
        showLoading();
        setError(null);
        try {
            const { feedKeyHex, writeUrl } = await unlockVault();
            applyFeedKey(feedKeyHex);
            if (writeUrl) setWriteUrl(writeUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Passkey sign-in failed");
        } finally {
            hideLoading();
        }
    }

    async function signInWithRawKey(hexKey: string) {
        showLoading();
        setError(null);
        try {
            applyFeedKey(hexKey);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid feed key");
        } finally {
            hideLoading();
        }
    }

    function disconnectAdmin() {
        clearFeedKey();
        clearWriteUrl();
        setError(null);
    }

    return (
        <AdminContext.Provider
            value={{
                isAdmin,
                error,
                canUsePasskey,
                signInWithPasskey,
                signInWithRawKey,
                disconnectAdmin,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin(): AdminContextType {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}
