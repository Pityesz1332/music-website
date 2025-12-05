import { useState } from "react";
import "../../styles/admin/AdminConnect.css";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { useNotification } from "../../context/NotificationContext";

function AdminConnect() {
    const [input, setInput] = useState("");
    const [error, setError] = useState(null);
    const { connectAsAdmin } = useAdmin();
    const { notify } = useNotification();
    const navigate = useNavigate();

    function handleSubmit(e) {
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
        <form onSubmit={handleSubmit} className="admin-connect-form">
            <h2>Admin Connect</h2>
            <input
                type="text"
                placeholder="Admin Code"
                value={input}
                onChange={(e) => setInput(e.target.value)}    
            />
            <button type="submit">Connect</button>
            {error && <p style={{ color: "red" }} className="invalid-code-error">{error}</p>}
        </form>
    );
}

export default AdminConnect;