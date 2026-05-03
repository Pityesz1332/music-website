import { Notification } from "@context/NotificationContext";

interface NotificationItemProps {
    notification: Notification;
}

// Each notification has its own lifecycle and timer, 
// allowing them to appear and disappear independently
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