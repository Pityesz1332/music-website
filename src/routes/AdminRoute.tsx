import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

interface AdminRouteProps {
    children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
    const { isAdmin } = useAdmin();

    if (!isAdmin) return <Navigate to="/admin/connect" replace />;

    return children;
}