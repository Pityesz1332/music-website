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

// Currently a test feature, but serves as a solid foundation for future backend integration.
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

    // Admin login logic. Grants access to the admin 
    // panel upon successful code verification.
    async function connectAsAdmin(username: string, password: string) {
        showLoading();
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            // Temporary logic until the backend is implemented.
            if (username === "admin" && password === "pass123") {
                const mockToken = "fake-jwt-token-123";
                localStorage.setItem("adminToken", mockToken);
                setIsAdmin(true);
            } else {
                setError("Wrong username or password");
                setIsAdmin(false);
            }
        } finally {
            hideLoading();
        }
    }

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
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}