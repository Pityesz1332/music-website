import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useConnect as useWagmiConnect, useDisconnect as useWagmiDisconnect, useConnectors } from "wagmi";
import { injected } from "wagmi/connectors";

interface AuthContextType {
    isConnected: boolean;
    loading: boolean;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: {children: ReactNode}) {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const wagmiConnect = useWagmiConnect();
    const wagmiDisconnect = useWagmiDisconnect();
    const connectors = useConnectors();

    useEffect(() => {
        setIsConnected(localStorage.getItem("isConnected") === "true");
        setLoading(false);
    }, []);

    const connect = async (): Promise<void> =>  {
        const connector = connectors[0] ?? injected();
        await wagmiConnect.mutateAsync({ connector });

        setIsConnected(true);
        localStorage.setItem("isConnected", "true");
    };

    const disconnect = async (): Promise<void> => {
        await wagmiDisconnect.mutateAsync();
        setIsConnected(false);
        localStorage.removeItem("isConnected");
    };

    return (
        <AuthContext.Provider value={{ isConnected, loading, connect, disconnect }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
