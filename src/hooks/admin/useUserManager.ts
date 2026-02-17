import { useState, useMemo } from "react";
import { usersData, User } from "../../data/usersData";

export const useUserManager = () => {
    const [users, setUsers] = useState<User[]>(usersData);
    const [search, setSearch] = useState<string>("");
    const [editUser, setEditUser] = useState<User | null>(null);

    // lista szűrése
    const filteredUsers = useMemo(() => {
        const query = search.toLowerCase();
        return users.filter(
            user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
    }, [users, search]);

    // user törlése
    const deleteUser = (id: number) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    const startEditing = (user: User) => {
        setEditUser({ ...user });
    };

    const cancelEditing = () => {
        setEditUser(null);
    };

    const handleEditChange = (field: keyof User, value: string) => {
        setEditUser(prev => (prev ? { ...prev, [field]: value } : prev));
    };

    // szerkesztés mentése
    const saveEdit = () => {
        if (!editUser) return
        setUsers((prev) =>
            prev.map(u => (u.id === editUser.id ? editUser : u))
        );
        setEditUser(null);
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