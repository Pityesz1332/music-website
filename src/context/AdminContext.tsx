import { createContext, useContext, useState, ReactNode } from "react";
import { useLoading } from "./LoadingContext";
import { clearFeedKey, setFeedKey, feedKeyMatchesOwner } from "../swarm/feedKey";
import { hasEnrolledPasskey, isPasskeySupported, verifyPasskey } from "../swarm/passkeyAuth";
import { FEED_OWNER_ADDRESS } from "../swarm/swarmService";

interface AdminContextType {
    isAdmin: boolean;
    error: string | null;
    /** True when this device has a passkey enrolled as an admin-login credential. */
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
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { showLoading, hideLoading } = useLoading();

    // Read fresh on every render rather than caching in state, since enrolling
    // a passkey elsewhere in the SPA (no full page reload) would otherwise
    // leave a stale false here.
    const canUsePasskey = isPasskeySupported() && hasEnrolledPasskey();

    /**
     * Passkey sign-in is a pure access gate: it proves this device/biometric,
     * nothing more. It does not load the feed key -- publishing still needs
     * the key entered separately in the Feed Key panel.
     */
    async function signInWithPasskey() {
        showLoading();
        setError(null);
        try {
            await verifyPasskey();
            setIsAdmin(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Passkey sign-in failed");
            setIsAdmin(false);
        } finally {
            hideLoading();
        }
    }

    /**
     * Bootstrap and recovery path: sign in by pasting the raw feed key. Since
     * there is no other credential the first time (no passkey enrolled yet),
     * this is the only door in until one is set up.
     */
    async function signInWithRawKey(hexKey: string) {
        showLoading();
        setError(null);
        try {
            setFeedKey(hexKey);
            if (FEED_OWNER_ADDRESS && !feedKeyMatchesOwner(FEED_OWNER_ADDRESS)) {
                clearFeedKey();
                throw new Error("This key does not match the configured feed owner.");
            }
            setIsAdmin(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid feed key");
            setIsAdmin(false);
        } finally {
            hideLoading();
        }
    }

    function disconnectAdmin() {
        clearFeedKey();
        setIsAdmin(false);
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
