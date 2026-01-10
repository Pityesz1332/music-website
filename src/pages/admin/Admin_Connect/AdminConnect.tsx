import { useState } from "react";
import "./AdminConnect.scss";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../context/AdminContext";
import { useNotification } from "../../../context/NotificationContext";

export const AdminConnect = () => {
    const [input, setInput] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const { connectAsAdmin } = useAdmin();
    const { notify } = useNotification();
    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        connectAsAdmin(input);
        const after = localStorage.getItem("isAdmin");

        if (after === "true") {
            navigate("/admin");
            notify("Welcome, Admin", "success");
        } else {
            setError("Invalid code");
            setInput("");
            notify("Invalid code. Try again!", "error");
        }
    }

    return (
        <div className="admin-connect-wrapper">
            <form onSubmit={handleSubmit} className="admin-connect">
                <h2 className="admin-connect__title">Admin Connect</h2>
                <input
                    className="admin-connect__input"
                    type="text"
                    placeholder="Admin Code"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}    
                />
                <button className="admin-connect__button" type="submit">Connect</button>
                {error && <p className="admin-connect__error admin-connect__error--active">{error}</p>}
            </form>
        </div>
    );
}