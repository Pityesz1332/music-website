import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    isConnected: boolean;
    loading: boolean;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// itt történik a bejelentkezéskezelés
export function AuthProvider({ children }: AuthProviderProps) {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    // ha bejelentkezünk, a bejelentkezett állapot marad, frissítésnél is
    useEffect(() => {
        const saved = localStorage.getItem("isConnected");
        if (saved === "true") {
            setIsConnected(true);
        }
        setLoading(false);
    }, []);

    // connecting logika (kis timeout-tal, a vizualitás kedvéért)
    const connect = async (): Promise<void> =>  {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    setIsConnected(true);
                    localStorage.setItem("isConnected", "true");
                    resolve();
                }, 1200);
            } catch(err) {
                reject(err);
            }
        });
    };

    // disconnect logika
    const disconnect = async (): Promise<void> => {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    setIsConnected(false);
                    localStorage.removeItem("isConnected");
                    resolve();
                }, 500);
            } catch(err) {
                reject(err);
            }
        });
    };

    return (
        <AuthContext.Provider value={{ isConnected, loading, connect, disconnect }}>
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