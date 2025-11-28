import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";
import PublicNavbar from "./PublicNavbar";
import UserNavbar from "./UserNavbar";
import AdminNavbar from "./admin/AdminNavbar";

function Navbar() {
    const { auth, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleLogoutClick() {
        setIsModalOpen(true);
    }

    function handleConfirmLogout() {
        logout();
        setIsModalOpen(false);
    }

    function handleCancelLogout() {
        setIsModalOpen(false);
    }

    let content;
    if (!auth) content = <PublicNavbar onLogoutClick={handleLogoutClick} />;
    else if (auth.role === "user") content = <UserNavbar onLogoutClick={handleLogoutClick} />;
    else if (auth.role === "admin") content = <AdminNavbar onLogoutClick={handleLogoutClick} />;

    return (
        <>
            {content}
            <ConfirmModal
                isOpen={isModalOpen}
                title="Are you sure?"
                message="Do you want to disconnect?"
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </>
    );
}

export default Navbar;