import { useState } from "react";
import "./AdminConnect.scss";
import { useNavigate } from "react-router-dom";
import { MainRoutes } from "../../../routes/constants/Main_Routes";
import { useAdmin } from "../../../context/AdminContext";
import { useNotification, NotificationType } from "../../../context/NotificationContext";

export const AdminConnect = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const { connectAsAdmin } = useAdmin();
    const { notify } = useNotification();
    const navigate = useNavigate();

    // input kezelés a "name" alapján
    function handleChange (e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // login folyamat kezelése
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await connectAsAdmin(credentials.username, credentials.password);
            
            navigate(MainRoutes.ADMIN_DASHBOARD);
            notify("Welcome, Admin", NotificationType.SUCCESS);
        } catch (err: any) {
            // hibánál jelszó mező ürítése
            setCredentials({ ...credentials, password: "" });
            notify("Invalid credentials!", NotificationType.ERROR);
        }
    }

    return (
        <div className="admin-connect-wrapper">
            <form onSubmit={handleSubmit} className="admin-connect">
                <h2 className="admin-connect__title">Admin Login</h2>
                
                <input
                    className="admin-connect__input"
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={handleChange}    
                />

                <input
                    className="admin-connect__input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                />

                <button
                    className="admin-connect__button"
                    type="submit"
                >
                    Login as Admin
                </button>
            </form>
        </div>
    );
}