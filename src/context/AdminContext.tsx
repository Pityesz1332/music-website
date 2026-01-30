import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLoading } from "./LoadingContext";

interface AdminContextType {
    isAdmin: boolean;
    error: string | null;
    connectAsAdmin: (username: string, password: string) => Promise<void>;
    disconnectAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
    children: ReactNode;
}

// egyelőre csak tesztfunkció, de jó alap lehet később backend-hez.
export function AdminProvider({ children }: AdminProviderProps) {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            setIsAdmin(true);
        }
    }, []);

    // admin beléptetés. ha megfelel az adott kód, elérhetővé válik az admin oldal.
    async function connectAsAdmin(username: string, password: string) {
        showLoading();
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            // ideiglenes logika amíg nincs backend
            if (username === "admin" && password === "pass123") {
                const mockToken = "fake-jwt-token-123";
                localStorage.setItem("adminToken", mockToken);
                setIsAdmin(true);
            } else {
                throw new Error("Wrong username or password");
            }
        } catch (err: any) {
            setError(err.message);
            setIsAdmin(false);
            throw err;
        } finally {
            hideLoading();
        }
    }

    // kiléptetés
    function disconnectAdmin() {
        localStorage.removeItem("adminToken");
        setIsAdmin(false);
        setError(null);
    }

    return (
        <AdminContext.Provider value={{ isAdmin, error, connectAsAdmin, disconnectAdmin }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin(): AdminContextType {
    const context = useContext(AdminContext);
    // hibakezelés nekem
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}