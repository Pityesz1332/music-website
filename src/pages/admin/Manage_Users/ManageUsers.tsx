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
            <h1>Manage Users</h1>

            <input 
                type="text" 
                placeholder="Search user..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="search-box"
            />

            <table className="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th className="actions-col">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>#{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td className="role">{user.role}</td>
                            <td className="actions">
                                <button onClick={() => setEditUser({ ...user })} className="edit-btn">
                                    <Edit />
                                </button>
                                <button onClick={() => deleteUser(user.id)} className="delete-btn">
                                    <Trash2 />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit User</h2>

                        <label>Name</label>
                        <input className="admin-edit-input" type="text" value={editUser.name} onChange={(e) => setEditUser((prev) => prev ? { ...prev, name: e.target.value } : prev)}/>
                        <label>Email</label>
                        <input className="admin-edit-input" type="text" value={editUser.email} onChange={(e) => setEditUser((prev) => prev ? { ...prev, email: e.target.value } : prev)}/>
                        <label>Role</label>
                        <select value={editUser.role} onChange={(e) => setEditUser((prev) => prev ? { ...prev, role: e.target.value as "user" | "admin" } : prev)}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>

                        <div className="modal-buttons">
                            <button onClick={saveEdit} className="save-btn">Save</button>
                            <button onClick={() => setEditUser(null)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}