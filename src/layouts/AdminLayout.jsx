import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/admin/AdminNavbar";
import "../styles/admin/AdminLayout.css";

function AdminLayout() {
    return (
        <div className="admin-container">
            <Navbar />
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;