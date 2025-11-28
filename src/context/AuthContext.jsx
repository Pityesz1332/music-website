import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [auth, setAuth] = useState(null);

    function loginUser(wallet) {
        setAuth({ role: "user", wallet: "0x123456789DEMO" });
    }

    function loginAdmin() {
        setAuth({ role: "admin" });
    }

    function logout() {
        setAuth(null);
    }

    return (
        <AuthContext.Provider value={{ auth, loginUser, loginAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };