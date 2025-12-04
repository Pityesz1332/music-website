import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import "../styles/pages/NotFound.css";

function NotFound() {
    return (
        <div className="notfound-container">
            <AlertTriangle size={80} />
            <h1>Page Not Found</h1>
            <p>The page you are looking for doesn't exist.</p>
            <Link to="/" className="notfound-btn">Go Back Home</Link>
        </div>
    );
}

export default NotFound;