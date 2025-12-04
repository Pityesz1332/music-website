import { useNotification } from "../context/NotificationContext";
import "../styles/Notifications.css";

function Notifications() {
    const { notifications } = useNotification();

    return (
        <div className="notifications-wrapper">
            {notifications.map(n => (
                <div key={n.id} className={`notification ${n.type}`}>
                    <div className="notification-message">{n.message}</div>
                    <div className="progress" style={{ animationDuration: `${n.duration}ms` }}></div>
                </div>
            ))}
        </div>
    );
}

export default Notifications;