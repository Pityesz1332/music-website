import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainRoutes } from "../../routes/constants/Main_Routes";
import { useAdmin } from "../../context/AdminContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";

export const useAdminAuth = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { connectAsAdmin } = useAdmin();
    const { notify } = useNotification();
    const navigate = useNavigate();

    // input kezelés a "name" alapján
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // login folyamat kezelése
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!credentials.username || !credentials.password) {
            notify("Please fill in all fields", NotificationType.INFO);
            return;
        }

        setIsLoading(true);

        try {
            await connectAsAdmin(credentials.username, credentials.password);
            
            navigate(MainRoutes.ADMIN_DASHBOARD);
            notify("Welcome, Admin", NotificationType.SUCCESS);
        } catch (err: any) {
            // hibánál jelszó mező ürítése
            setCredentials(prev => ({ ...prev, password: "" }));
            notify("Invalid credentials!", NotificationType.ERROR);
            setIsLoading(false);
        }
    };

    return {
        credentials,
        isLoading,
        handleChange,
        handleSubmit
    };
};