import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import "../styles/AdminLayout.css";

function AdminLayout() {
    return (
        <div className="admin-container">
            <AdminNavbar />
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;