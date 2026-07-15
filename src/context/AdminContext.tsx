import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    requestAdminSignature,
    verifyAdminSession,
    type AdminSession,
} from "../services/siwe";

interface AdminContextType {
    isAdmin: boolean;
    adminAddress: string | null;
    // true while we re-verify a stored session on first load, so route
    // guards can wait instead of bouncing a real admin to the login page
    isInitializing: boolean;
    connectAsAdmin: () => Promise<void>;
    disconnectAdmin: () => void;
}

const ADMIN_SESSION_KEY = "adminSession";

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
    children: ReactNode;
}

// Admin identity is a Sign-In-With-Ethereum signature: the connected wallet signs
// a nonce'd, time-boxed message, and we only trust it if the recovered address is on
// the ADMIN_ADDRESSES allowlist (see services/siwe.ts). There are no shared secrets in
// the bundle, and a tampered stored session fails verification. Note this gate is still
// client-side only — the real write boundary is the Swarm feed key entered at runtime.
export function AdminProvider({ children }: AdminProviderProps) {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [adminAddress, setAdminAddress] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);

    // Re-verify any stored session on load. A valid, unexpired signature from an
    // allowlisted address restores admin access; anything else is discarded.
    useEffect(() => {
        let cancelled = false;

        (async () => {
            const raw = localStorage.getItem(ADMIN_SESSION_KEY);
            if (!raw) {
                setIsInitializing(false);
                return;
            }

            try {
                const session = JSON.parse(raw) as AdminSession;
                const address = await verifyAdminSession(session);
                if (cancelled) return;

                if (address) {
                    setIsAdmin(true);
                    setAdminAddress(address);
                } else {
                    localStorage.removeItem(ADMIN_SESSION_KEY);
                }
            } catch {
                localStorage.removeItem(ADMIN_SESSION_KEY);
            } finally {
                if (!cancelled) setIsInitializing(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    // Prompts the wallet to sign, then verifies the signature against the allowlist.
    // Throws on rejection / unauthorized wallet so the caller can surface the reason.
    async function connectAsAdmin() {
        const session = await requestAdminSignature();
        const address = await verifyAdminSession(session);

        if (!address) {
            throw new Error("This wallet is not authorized as admin.");
        }

        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        setIsAdmin(true);
        setAdminAddress(address);
    }

    function disconnectAdmin() {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        setIsAdmin(false);
        setAdminAddress(null);
    }

    return (
        <AdminContext.Provider
            value={{ isAdmin, adminAddress, isInitializing, connectAsAdmin, disconnectAdmin }}
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
