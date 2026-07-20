import { useState, useMemo } from "react";
import { useNotification, NotificationType } from "@context/NotificationContext";
import { usersData, User } from "@data/usersData";

export const useUserManager = () => {
    const [users, setUsers] = useState<User[]>(usersData);
    const [search, setSearch] = useState<string>("");
    const [editUser, setEditUser] = useState<User | null>(null);
    const { notify } = useNotification();

    // filtering list
    const filteredUsers = useMemo(() => {
        const query = search.toLowerCase();
        return users.filter(
            user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
    }, [users, search]);

    // deleting user
    const deleteUser = (id: number) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        notify("User deleted", NotificationType.SUCCESS);
    };

    // editing mode
    const startEditing = (user: User) => {
        setEditUser({ ...user });
    };

    // exit editing mode
    const cancelEditing = () => {
        setEditUser(null);
    };

    // user data editing
    const handleEditChange = (field: keyof User, value: string) => {
        setEditUser(prev => (prev ? { ...prev, [field]: value } : prev));
    };

    // save changes
    const saveEdit = () => {
        if (!editUser) return

        if (!editUser.name.trim() || !editUser.email.trim()) {
            notify("Fill the empty fields", NotificationType.INFO);
            return;
        }

        setUsers((prev) =>
            prev.map(u => (u.id === editUser.id ? editUser : u))
        );
        setEditUser(null);
        notify("Successfully updated", NotificationType.SUCCESS);
    };

    return {
        search, setSearch,
        editUser,
        filteredUsers,
        deleteUser,
        startEditing, cancelEditing, handleEditChange,
        saveEdit
    };
};