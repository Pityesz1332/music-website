import { useState } from "react";
import { registerPasskey, authPasskey, isWebAuthnSupported, PasskeyUser } from "@utils/passkeyHelpers";

interface UsePasskeyReturn {
    register: () => Promise<PasskeyUser>;
    authenticate: () => Promise<PasskeyUser>;
    isSupported: boolean;
    loading: boolean;
    error: string | null;
}

// itt minden mock adatokkal működik jelenleg, de majd átírom, ha lesz backend
export function usePasskey(): UsePasskeyReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isSupported = isWebAuthnSupported();

    const register = async (): Promise<PasskeyUser> => {
        setLoading(true);
        setError(null);
        try {
            const user = await registerPasskey();
            // MOCK - backend-nél ez nem kell. szerver kezeli majd.
            localStorage.setItem("passkeyUser", JSON.stringify(user));
            return user;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const authenticate = async (): Promise<PasskeyUser> => {
        setLoading(true);
        setError(null);
        try {
            return await authPasskey();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { register, authenticate, isSupported, loading, error };
}