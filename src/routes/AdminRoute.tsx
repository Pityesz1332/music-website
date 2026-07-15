import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "@context/AdminContext";
import { LoadingState } from "@components/loading-state/LoadingState";

interface AdminRouteProps {
    children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
    const { isAdmin, isInitializing } = useAdmin();

    // Wait for a stored session to be re-verified before deciding, so a
    // logged-in admin isn't bounced to the login page on refresh.
    if (isInitializing) return <LoadingState />;

    if (!isAdmin) return <Navigate to="/admin/connect" replace />;

    return children;
}