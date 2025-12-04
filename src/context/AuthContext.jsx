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

    const connect = async () =>  {
        return new Promise((resolve, reject) => {
            try {
                setIsConnected(true);
                localStorage.setItem("isConnected", "true");
                resolve(true);
            } catch(err) {
                reject(err);
            }
        });
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