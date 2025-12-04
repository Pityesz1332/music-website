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
                setTimeout(() => {
                    setIsConnected(true);
                    localStorage.setItem("isConnected", "true");
                    resolve(true);
                }, 1200);
            } catch(err) {
                reject(err);
            }
        });
    };


    const disconnect = async () => {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    setIsConnected(false);
                    localStorage.removeItem("isConnected");
                    resolve(true);
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

function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };