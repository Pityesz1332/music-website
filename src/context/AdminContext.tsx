import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ADMIN_CODE } from "../utils/config";

interface AdminContextType {
    isAdmin: boolean;
    connectAsAdmin: (wallet: string) => void;
    disconnectAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
    children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    function connectAsAdmin(wallet: string) {
        if (wallet.toLowerCase() === ADMIN_CODE.toLowerCase()) {
            setIsAdmin(true);
            localStorage.setItem("isAdmin", "true");
        } else {
            setIsAdmin(false);
            localStorage.removeItem("isAdmin");
        }
    }

    function disconnectAdmin() {
        setIsAdmin(false);
        localStorage.removeItem("isAdmin");
    }

    useEffect(() => {
        const saved = localStorage.getItem("isAdmin");
        if (saved === "true") setIsAdmin(true);
    }, []);

    return (
        <AdminContext.Provider value={{ isAdmin, connectAsAdmin, disconnectAdmin }}>
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