import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";

export type NotificationType = "success" | "error" | "info";

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
    duration: number;
}

interface NotificationContextType {
    notifications: Notification[];
    notify: (message: string, type?: NotificationType, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

// értesítés popup kezelése bizonyos interakciók után
export const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const timeouts = useRef<number[]>([]);

    // ez a függvény feldob egy tetszőleges üzenetet, majd 
    // a 3mp után automatikusan eltünteti a listából és a memóriából is 
    const notify = useCallback((message: string, type: NotificationType = "info", duration: number = 3000) => {
        const id = Date.now() + Math.random();

        const newNotification: Notification = { id, message, type, duration };
        setNotifications(prev => [...prev, newNotification]);

        const timeoutId = setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));

            timeouts.current = timeouts.current.filter(t => t !== timeoutId);
        }, duration);

        timeouts.current.push(timeoutId);
    }, []);

    // tisztítás - leállítjuk az összes futó órát
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

export function useNotification(): NotificationContextType {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used within a NotificationProvider");
    return context;
}