import { Trash2, Edit } from "lucide-react";
import { useUserManager } from "../../../hooks/admin/useUserManager";
import { ADMIN_MANAGE_USERS_STRINGS } from "../../../constants/ui/admin/manageUsers";
import "./ManageUsers.scss";

export const ManageUsers = () => {

    const {
        search, setSearch,
        editUser,
        filteredUsers,
        deleteUser,
        startEditing, cancelEditing, handleEditChange,
        saveEdit
    } = useUserManager();

    return (
        <div className="manage-users">
            <h1 className="manage-users__title">{ADMIN_MANAGE_USERS_STRINGS.TITLE}</h1>

            <input 
                type="text" 
                placeholder={ADMIN_MANAGE_USERS_STRINGS.PLACEHOLDERS.SEARCH}
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="manage-users__search"
            />

            <table className="manage-users__table">
                <thead className="manage-users__table-head">
                    <tr>
                        <th className="manage-users__th">{ADMIN_MANAGE_USERS_STRINGS.TABLE.ID}</th>
                        <th className="manage-users__th">{ADMIN_MANAGE_USERS_STRINGS.TABLE.NAME}</th>
                        <th className="manage-users__th">{ADMIN_MANAGE_USERS_STRINGS.TABLE.EMAIL}</th>
                        <th className="manage-users__th">{ADMIN_MANAGE_USERS_STRINGS.TABLE.ROLE}</th>
                        <th className="manage-users__th manage-users__th--actions">{ADMIN_MANAGE_USERS_STRINGS.TABLE.ACTIONS}</th>
                    </tr>
                </thead>

                <tbody className="manage-users__table-body">
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="manage-users__tr">
                            <td className="manage-users__td" data-label="ID">#{user.id}</td>
                            <td className="manage-users__td" data-label="Name">{user.name}</td>
                            <td className="manage-users__td" data-label="Email">{user.email}</td>
                            <td className="manage-users__td manage-users__td--role" data-label="Role">{user.role}</td>
                            <td className="manage-users__td manage-users__td--actions" data-label="Actions">
                                <button onClick={() => startEditing(user)} className="manage-users__button manage-users__button--edit">
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
                        <h2 className="manage-users__modal-title">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.TITLE}</h2>

                    <div className="manage-users__form-group">
                        <label className="manage-users__label">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.LABELS.NAME}</label>
                        <input className="manage-users__input" type="text" value={editUser.name} onChange={(e) => handleEditChange("name", e.target.value)}/>
                    </div>
                    <div className="manage-users__form-group">
                        <label className="manage-users__label">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.LABELS.EMAIL}</label>
                        <input className="manage-users__input" type="text" value={editUser.email} onChange={(e) => handleEditChange("email", e.target.value)}/>
                    </div>

                    <div className="manage-users__form-group">
                        <label className="manage-users__label">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.LABELS.ROLE}</label>
                        <select className="manage-users__select" value={editUser.role} onChange={(e) => handleEditChange("role", e.target.value)}>
                            <option value="user">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.ROLES.USER}</option>
                            <option value="admin">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.ROLES.ADMIN}</option>
                        </select>
                    </div>

                        <div className="manage-users__modal-actions">
                            <button onClick={saveEdit} className="manage-users__button manage-users__button--save">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.BUTTONS.SAVE}</button>
                            <button onClick={cancelEditing} className="manage-users__button manage-users__button--cancel">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.BUTTONS.CANCEL}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}