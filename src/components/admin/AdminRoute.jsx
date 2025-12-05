import { Navigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

function AdminRoute({ children }) {
    const { isAdmin } = useAdmin();

    if (!isAdmin) return <Navigate to="/admin/connect" replace />;

    return children;
}

export default AdminRoute;