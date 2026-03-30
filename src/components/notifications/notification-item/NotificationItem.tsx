import { Notification } from "@context/NotificationContext";

interface NotificationItemProps {
    notification: Notification;
}

// minden értesítének saját életciklusa és időzítője van, 
// így függetlenül meg tudnak jelenni és eltünni
export const NotificationItem = ({ notification }: NotificationItemProps) => {
    return (
        <div className={`notifications__item notifications__item--${notification.type}`}>
            <div className="notifications__message">{notification.message}</div>
            <div
                className="notifications__progress"
                style={{ animationDuration: `${notification.duration}ms` }}
            ></div>
        </div>
    );
};