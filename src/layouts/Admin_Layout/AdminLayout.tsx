import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/admin/Admin_Navbar/AdminNavbar";
import "./AdminLayout.scss";

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