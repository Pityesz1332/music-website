import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useConnect as useWagmiConnect, useDisconnect as useWagmiDisconnect, useConnectors } from "wagmi";
import { injected } from "wagmi/connectors";
import { usePasskey } from "@hooks/auth/usePasskey";
import { PasskeyUser } from "@utils/passkeyHelpers";

interface AuthContextType {
    isConnected: boolean;
    loading: boolean;
    user: PasskeyUser | null;
    isWebAuthnSupported: boolean;
    connect: () => Promise<void>;
    devLogin: () => void;
    register: () => Promise<void>;
    disconnect: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// itt történik a bejelentkezéskezelés
export function AuthProvider({ children }: {children: ReactNode}) {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<PasskeyUser | null>(null);
    const passkey = usePasskey();
    const wagmiConnect = useWagmiConnect();
    const wagmiDisconnect = useWagmiDisconnect();
    const connectors = useConnectors();

    // ha bejelentkezünk, a bejelentkezett állapot marad, frissítésnél is
    useEffect(() => {
        const savedUser = localStorage.getItem("passkeyUser");
        const savedConnected = localStorage.getItem("isConnected");
        if (savedConnected === "true" && savedUser) {
            setIsConnected(true);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // connecting logika (passkey-el)
    const connect = async (): Promise<void> =>  {
        if (!passkey.isSupported) throw new Error("WebAuthn not supported");
        const connector = connectors[0] ?? injected();
        const result = await wagmiConnect.mutateAsync({ connector });
        const address = result.accounts[0];

        const stored = localStorage.getItem("passkeyUser");
        const user = stored ? await passkey.authenticate(address) : await passkey.register(address);
        
        setUser(user);
        setIsConnected(true);
        localStorage.setItem("isConnected", "true");
        localStorage.setItem("passkeyUser", JSON.stringify(user));
    };

    // ez a dev login csak ideiglenes, hogy ne kelljen passkey-t használni fejlesztésnél
    // megkerüli a passkey-es bejelentkezést
    const devLogin = () => {
        const dummyUser: PasskeyUser = {
            id: "dev-123",
            username: "Developer",
            displayName: "Developer"
        };

        setUser(dummyUser);
        setIsConnected(true);
        localStorage.setItem("isConnected", "true");
        localStorage.setItem("passkeyUser", JSON.stringify(dummyUser));
    };

    // regisztráljuk a user-t
    const register = async (): Promise<void> => {
        const connector = connectors[0] ?? injected();
        const result = await wagmiConnect.mutateAsync({ connector });
        const address = result.accounts[0];

        const user = await passkey.register(address);
        setUser(user);
        setIsConnected(true);
        localStorage.setItem("isConnected", "true");
    };

    // disconnect logika
    const disconnect = async (): Promise<void> => {
        await wagmiDisconnect.mutateAsync();
        setIsConnected(false);
        setUser(null);
        localStorage.removeItem("isConnected");
        localStorage.removeItem("passkeyUser");
    };

    return (
        <AuthContext.Provider value={{ 
            isConnected, 
            loading: loading || passkey.loading, 
            user,
            isWebAuthnSupported: passkey.isSupported,
            connect,
            devLogin,
            register,
            disconnect }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    // hibakezelés a fejlesztéshez
    if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}