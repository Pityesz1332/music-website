import { useNotification, NotificationType } from "../../context/NotificationContext";

export const useClipboard = () => {
    const { notify } = useNotification();
    
    // copy gomb, (walletcím másoláshoz)
    const copyToClipboard = (text: string, successMessage: string = "Copied to clipboard") => {
        navigator.clipboard.writeText(text);
        notify(successMessage, NotificationType.SUCCESS);
    };

    return { copyToClipboard };
};