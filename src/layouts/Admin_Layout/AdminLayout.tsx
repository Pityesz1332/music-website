import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/admin/Admin_Navbar/AdminNavbar";
import "./AdminLayout.scss";

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