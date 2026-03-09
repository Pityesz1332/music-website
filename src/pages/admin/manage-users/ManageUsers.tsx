import { useUserManager } from "../../../hooks/admin/useUserManager";
import { UserItem } from "./subcomponents/UserItem";
import { ADMIN_MANAGE_USERS_STRINGS } from "../../../constant-strings/ui/admin/manageUsers";
import { PrimaryButton } from "../../../components/ui/button/PrimaryButton";
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
            <header className="manage-users__header">
                <h1 className="manage-users__title">{ADMIN_MANAGE_USERS_STRINGS.TITLE}</h1>
            </header>

            <input 
                type="text"
                placeholder={ADMIN_MANAGE_USERS_STRINGS.PLACEHOLDERS.SEARCH}
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="manage-users__search"
            />

            <div className="users-list">
                <div className="users-list__header-row">
                    <span>{ADMIN_MANAGE_USERS_STRINGS.TABLE.NAME}</span>
                    <span>{ADMIN_MANAGE_USERS_STRINGS.TABLE.ROLE}</span>
                    <span>{ADMIN_MANAGE_USERS_STRINGS.TABLE.ACTIONS}</span>
                </div>

                <div className="users-list__content">
                    {filteredUsers.map(user => (
                        <UserItem 
                            key={user.id}
                            user={user}
                            onEdit={startEditing}
                            onDelete={deleteUser}
                        />
                    ))}
                </div>
            </div>

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
                            <PrimaryButton onClick={saveEdit} className="manage-users__button manage-users__button--save">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.BUTTONS.SAVE}</PrimaryButton>
                            <PrimaryButton onClick={cancelEditing} className="manage-users__button manage-users__button--cancel">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.BUTTONS.CANCEL}</PrimaryButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}