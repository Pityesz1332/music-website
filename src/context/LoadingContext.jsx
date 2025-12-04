import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    function showLoading() {
        setIsLoading(true);
    }

    function hideLoading() {
        setIsLoading(false);
    }

    return (
        <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

function useLoading() {
    return useContext(LoadingContext);
}

export { LoadingProvider, useLoading };