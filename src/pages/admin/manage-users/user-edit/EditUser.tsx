import { Modal } from "@components/ui/modal/Modal";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { ADMIN_MANAGE_USERS_STRINGS } from "@i18n/ui/admin/manage-users";
import type { User } from "@data/usersData";
import "./EditUser.scss";

interface EditUserProps {
    user: User | null;
    onClose: () => void;
    onSave: () => void;
    onChange: (field: keyof User, value: string) => void;
}

export const EditUser = ({ user, onClose, onSave, onChange }: EditUserProps) => {
    if (!user) return null;

    const handleFieldChange = (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange(field, e.target.value);
    };

    return (
        <Modal
            isOpen={!!user}
            onClose={onClose}
            title={ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.TITLE}
            buttons={
                <>
                    <PrimaryButton onClick={onClose} className="modal__btn--cancel">
                        {ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.BUTTONS.CANCEL}
                    </PrimaryButton>
                    <PrimaryButton onClick={onSave} className="modal__btn--save">
                        {ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.BUTTONS.SAVE}
                    </PrimaryButton>
                </>
            }
        >
            <div className="edit-user-form">
                <div className="edit-user-form__group">
                    <label className="edit-user-form__label">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.LABELS.NAME}</label>
                    <input className="edit-user-form__input" type="text" value={user.name} onChange={handleFieldChange("name")}/>
                </div>
                <div className="edit-user-form__group">
                    <label className="edit-user-form__label">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.LABELS.EMAIL}</label>
                    <input className="edit-user-form__input" type="email" value={user.email} onChange={handleFieldChange("email")}/>
                </div>

                <div className="edit-user-form__group">
                    <label className="edit-user-form__label">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.LABELS.ROLE}</label>
                    <select className="edit-user-form__select" value={user.role} onChange={handleFieldChange("role")}>
                        <option value="user">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.ROLES.USER}</option>
                        <option value="admin">{ADMIN_MANAGE_USERS_STRINGS.EDIT_MODAL.ROLES.ADMIN}</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
};