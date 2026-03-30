import { useNotification, Notification } from "@context/NotificationContext";
import { NotificationItem } from "./notification-item/NotificationItem";
import "./Notifications.scss";

// az alkalmazás globális értesítési konténere.
// egyetlen fix helyen jelenik meg mindig.
// stack-elődik ha időn belül több hívás történik.
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