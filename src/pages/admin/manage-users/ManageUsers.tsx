import { useUserManager } from "../../../hooks/admin/useUserManager";
import { UserItem } from "./user-item/UserItem";
import { ADMIN_MANAGE_USERS_STRINGS } from "../../../i18n/ui/admin/manage-users";
import { AdminManageTable } from "../../../components/admin/admin-manage-table/AdminManageTable";
import { users_headers } from "../table-headers/table-headers";
import { EditUser } from "./user-edit/EditUser";
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div className="manage-users">
            <header className="manage-users__header">
                <h1 className="manage-users__title">{ADMIN_MANAGE_USERS_STRINGS.TITLE}</h1>
            </header>

            <input 
                type="text"
                placeholder={ADMIN_MANAGE_USERS_STRINGS.PLACEHOLDERS.SEARCH}
                value={search} 
                onChange={handleSearchChange} 
                className="manage-users__search"
            />

            <AdminManageTable
                items={filteredUsers}
                headers={users_headers}
                className="users-list"
                variant="users"
                renderItem={(user) => (
                    <UserItem
                        user={user}
                        onEdit={startEditing}
                        onDelete={deleteUser}
                    />
                )}
            />

            <EditUser 
                user={editUser}
                onClose={cancelEditing}
                onSave={saveEdit}
                onChange={handleEditChange}
            />

        </div>
    );
}