import { useState } from "react";
import { useConnection } from "wagmi";
import { registerPasskey, authPasskey, isWebAuthnSupported, PasskeyUser } from "@utils/passkeyHelpers";

interface UsePasskeyReturn {
    register: (address: string) => Promise<PasskeyUser>;
    authenticate: (address: string) => Promise<PasskeyUser>;
    isSupported: boolean;
    loading: boolean;
    error: string | null;
}

// itt minden mock adatokkal működik jelenleg, de majd átírom, ha lesz backend
export function usePasskey(): UsePasskeyReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isSupported = isWebAuthnSupported();
    const { address } = useConnection();

    const register = async (address: string): Promise<PasskeyUser> => {
        if (!address) throw new Error("No wallet connected");
        setLoading(true);
        setError(null);
        try {
            const user = await registerPasskey(address);
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

    const authenticate = async (address: string): Promise<PasskeyUser> => {
        if (!address) throw new Error("No wallet connected");
        setLoading(true);
        setError(null);
        try {
            return await authPasskey(address);
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