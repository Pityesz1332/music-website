import React, { useState } from "react";
import { Trash2, Edit } from "lucide-react";
import { usersData } from "../../data/usersData";
import "../../styles/admin/ManageUsers.css";

function ManageUsers() {
    const [users, setUsers] = useState(usersData);
    const [search, setSearch] = useState("");
    const [editUser, setEditUser] = useState(null);

    const filteredUsers = users.filter(
        user =>
            user.name.toLowerCase().includes(search.toLowerCase) ||
            user.email.toLowerCase().includes(search.toLowerCase())
    );

    function deleteUser(id) {
        setUsers(prev => prev.filter(u => u.id !== id));
    }

    function saveEdit() {
        setUsers(prev =>
            prev.map(u => (u.id === editUser.id ? editUser : u))
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
                        <input className="admin-edit-input" type="text" value={editUser.name} onChange={(e) => setEditUser({ editUser, name: e.target.value })}/>
                        <label>Email</label>
                        <input className="admin-edit-input" type="text" value={editUser.email} onChange={(e) => setEditUser({ editUser, email: e.target.value })}/>
                        <label>Role</label>
                        <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
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

export default ManageUsers;