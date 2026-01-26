import { useNotification, Notification } from "../../context/NotificationContext";
import "./Notifications.scss";

// notifications popup felülete
const Notifications = () => {
    const { notifications } = useNotification();

    return (
        <div className="notifications">
            {notifications.map((n: Notification) => (
                <div key={n.id} className={`notifications__item notifications__item--${n.type}`}>
                    <div className="notifications__message">{n.message}</div>
                    <div className="notifications__progress" style={{ animationDuration: `${n.duration}ms` }}></div>
                </div>
            ))}
        </div>
    );
}

export default Notifications;