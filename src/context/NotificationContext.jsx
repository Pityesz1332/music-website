import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

const NotificationContext = createContext();

function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const timeouts = useRef([]);

    const notify = useCallback((message, type = "info", duration = 3000) => {
        const id = Date.now() + Math.random();

        const newNotification = { id, message, type, duration };
        setNotifications(prev => [...prev, newNotification]);

        const timeoutId = setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));

            timeouts.current = timeouts.current.filter(t => t !== timeoutId);
        }, duration);

        timeouts.current.push(timeoutId);
    }, []);

    useEffect(() => {
        return () => {
            timeouts.current.forEach(clearTimeout);
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, notify }}>
            {children}
        </NotificationContext.Provider>
    );
}

function useNotification() {
    return useContext(NotificationContext);
}

export { NotificationProvider, useNotification };