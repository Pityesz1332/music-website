import { useNotification, Notification } from "@context/NotificationContext";
import { NotificationItem } from "./notification-item/NotificationItem";
import "./Notifications.scss";

// global notification container
// fix position
// stacking
const Notifications = () => {
    const { notifications } = useNotification();

    return (
        <div className="notifications">
            {notifications.map((n: Notification) => (
                <NotificationItem key={n.id} notification={n} />
            ))}
        </div>
    );
}

export default Notifications;