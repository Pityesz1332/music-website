import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { recoverMessageAddress } from "viem";
import { useLoading } from "./LoadingContext";
import { clearFeedKey } from "../swarm/feedKey";

interface AdminContextType {
    isAdmin: boolean;
    error: string | null;
    signInAsAdmin: () => Promise<void>;
    disconnectAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
    children: ReactNode;
}

// If none are configured, no wallet can sign in.
const ADMIN_ADDRESSES = ((import.meta.env.VITE_ADMIN_ADDRESS as string | undefined) ?? "")
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean);

export function AdminProvider({ children }: AdminProviderProps) {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { showLoading, hideLoading } = useLoading();

    const { address, isConnected } = useAccount();
    const { connectAsync, connectors } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { signMessageAsync } = useSignMessage();

    useEffect(() => {
        if (localStorage.getItem("adminToken")) {
            setIsAdmin(true);
        }
    }, []);

    async function signInAsAdmin() {
        showLoading();
        setError(null);

        try {
            if (ADMIN_ADDRESSES.length === 0) {
                setError("No admin address is configured for this deployment.");
                return;
            }

            // 1. Ensure a wallet is connected and get its address.
            let account = address;
            if (!isConnected || !account) {
                const connector = connectors[0];
                if (!connector) {
                    setError("No wallet connector available. Install a wallet like MetaMask.");
                    return;
                }
                const result = await connectAsync({ connector });
                account = result.accounts[0];
            }
            if (!account) {
                setError("Could not read a wallet address.");
                return;
            }

            // 2. Prove control of the address by signing a nonce.
            const nonce = crypto.randomUUID();
            const message =
                `Sign in as admin.\n` +
                `Address: ${account}\n` +
                `Nonce: ${nonce}\n` +
                `Issued At: ${new Date().toISOString()}`;
            const signature = await signMessageAsync({ account, message });

            // 3. Recover the signer and verify it is allow-listed.
            const recovered = await recoverMessageAddress({ message, signature });
            if (!ADMIN_ADDRESSES.includes(recovered.toLowerCase())) {
                setError("This wallet is not authorized as admin.");
                await disconnectAsync().catch(() => {});
                setIsAdmin(false);
                return;
            }

            localStorage.setItem("adminToken", "siwe");
            setIsAdmin(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Sign-in failed");
            setIsAdmin(false);
        } finally {
            hideLoading();
        }
    }

    function disconnectAdmin() {
        localStorage.removeItem("adminToken");
        clearFeedKey();
        setIsAdmin(false);
        setError(null);
        disconnectAsync().catch(() => {});
    }

    return (
        <AdminContext.Provider value={{ isAdmin, error, signInAsAdmin, disconnectAdmin }}>
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
