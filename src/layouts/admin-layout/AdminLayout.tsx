import { Outlet } from "react-router-dom";
import AdminNavbar from "@components/admin/navbar/AdminNavbar";
import "./AdminLayout.scss";

// az admin felület vizuális felépítését határozza meg
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