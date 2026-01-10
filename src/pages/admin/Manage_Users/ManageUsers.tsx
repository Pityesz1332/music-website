import { useState } from "react";
import { Trash2, Edit } from "lucide-react";
import { usersData } from "../../../data/usersData";
import "./ManageUsers.scss";
import { User } from "../../../data/usersData";

export const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>(usersData);
    const [search, setSearch] = useState("");
    const [editUser, setEditUser] = useState<User | null>(null);

    const filteredUsers = users.filter(
        user =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
    );

    function deleteUser(id: number) {
        setUsers(prev => prev.filter(u => u.id !== id));
    }

    function saveEdit() {
        if (!editUser) return
        setUsers((prev) =>
            prev.map((u) => (u.id === editUser.id ? editUser : u))
        );
        setEditUser(null);
    }

    return (
        <div className="manage-users">
            <h1 className="manage-users__title">Manage Users</h1>

            <input 
                type="text" 
                placeholder="Search user..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="manage-users__search"
            />

            <table className="manage-users__table">
                <thead className="manage-users__table-head">
                    <tr>
                        <th className="manage-users__th">ID</th>
                        <th className="manage-users__th">Name</th>
                        <th className="manage-users__th">Email</th>
                        <th className="manage-users__th">Role</th>
                        <th className="manage-users__th manage-users__th--actions">Actions</th>
                    </tr>
                </thead>

                <tbody className="manage-users__table-body">
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="manage-users__tr">
                            <td className="manage-users__td" data-label="ID">#{user.id}</td>
                            <td className="manage-users__td" data-label="Name">{user.name}</td>
                            <td className="manage-users__td" data-label="Email">{user.email}</td>
                            <td className="manage-users__td manage-users__td--role" data-label="Role">{user.role}</td>
                            <td className="manage-users__td manage-users__td--actions" data-lebel="Actions">
                                <button onClick={() => setEditUser({ ...user })} className="manage-users__button manage-users__button--edit">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => deleteUser(user.id)} className="manage-users__button manage-users__button--delete">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editUser && (
                <div className="manage-users__modal">
                    <div className="manage-users__modal-content">
                        <h2 className="manage-users__modal-title">Edit User</h2>

                    <div className="manage-users__form-group">
                        <label className="manage-users__label">Name</label>
                        <input className="manage-users__input" type="text" value={editUser.name} onChange={(e) => setEditUser((prev) => prev ? { ...prev, name: e.target.value } : prev)}/>
                    </div>
                    <div className="manage-users__form-group">
                        <label className="manage-users__label">Email</label>
                        <input className="manage-users__input" type="text" value={editUser.email} onChange={(e) => setEditUser((prev) => prev ? { ...prev, email: e.target.value } : prev)}/>
                    </div>

                    <div className="manage-users__form-group">
                        <label className="manage-users__label">Role</label>
                        <select className="manage-users__select" value={editUser.role} onChange={(e) => setEditUser((prev) => prev ? { ...prev, role: e.target.value as "user" | "admin" } : prev)}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                        <div className="manage-users__modal-actions">
                            <button onClick={saveEdit} className="manage-users__button manage-users__button--save">Save</button>
                            <button onClick={() => setEditUser(null)} className="manage-users__button manage-users__button--cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}