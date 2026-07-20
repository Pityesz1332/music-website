import { Outlet } from "react-router-dom";
import AdminNavbar from "@components/admin/navbar/AdminNavbar";
import "./AdminLayout.scss";

// Defines the visual layout of the admin interface.
function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminNavbar />
            <main className="admin-layout__content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;