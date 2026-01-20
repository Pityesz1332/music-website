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

// egyelőre csak tesztfunkció, de jó alap lehet később backend-hez.
export function AdminProvider({ children }: AdminProviderProps) {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // admin beléptetés. ha megfelel az adott kód, elérhetővé válik az admin oldal.
    function connectAsAdmin(code: string) {
        if (code.toLowerCase() === ADMIN_CODE.toLowerCase()) {
            setIsAdmin(true);
            localStorage.setItem("isAdmin", "true");
        } else {
            setIsAdmin(false);
            localStorage.removeItem("isAdmin");
        }
    }

    // kiléptetés
    function disconnectAdmin() {
        setIsAdmin(false);
        localStorage.removeItem("isAdmin");
    }

    // frissítésnél is megmarad a belépett állapot
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
    // hibakezelés nekem
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}