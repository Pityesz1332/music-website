import { createContext, useContext, useState, useEffect } from "react";
import { ADMIN_CODE } from "../utils/config";

const AdminContext = createContext();

function AdminProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);

    function connectAsAdmin(wallet) {
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

function useAdmin() {
    return useContext(AdminContext);
}

export { AdminProvider, useAdmin };