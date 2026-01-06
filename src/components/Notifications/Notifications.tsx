import { useNotification } from "../../context/NotificationContext";
import "./Notifications.scss";

export interface Notification {
    id: string | number;
    message: string;
    type: "success" | "error" | "info";
    duration: number;
}

const Notifications = () => {
    const { notifications } = useNotification();

    return (
        <div className="notifications-wrapper">
            {notifications.map((n: Notification) => (
                <div key={n.id} className={`notification ${n.type}`}>
                    <div className="notification-message">{n.message}</div>
                    <div className="progress" style={{ animationDuration: `${n.duration}ms` }}></div>
                </div>
            ))}
        </div>
    );
}

export default Notifications;