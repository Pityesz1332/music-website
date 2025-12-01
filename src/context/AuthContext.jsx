import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("isConnected");
        if (saved === "true") {
            setIsConnected(true);
        }
        setLoading(false);
    }, []);

    const connect = () =>  {
        setIsConnected(true);
        localStorage.setItem("isConnected", "true");
    };


    const disconnect = () => {
        setIsConnected(false);
        localStorage.removeItem("isConnected");
    };

    return (
        <AuthContext.Provider value={{ isConnected, loading, connect, disconnect }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };