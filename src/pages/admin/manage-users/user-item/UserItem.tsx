import { Edit, Trash2 } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import type { User } from "@data/usersData";

interface UserItemProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

// mutatja a user-ek adatait és felel az edit és delete kezeléséért
export const UserItem = ({ user, onEdit, onDelete }: UserItemProps) => {
    return (
        <div className="user-item">
            <div className="user-item__info">
                <span className="user-item__id">{user.id}</span>
                <div className="user-item__details">
                    <p className="user-item__name">{user.name}</p>
                    <p className="user-item__email">{user.email}</p>
                </div>
            </div>
            <div className="user-item__role">
                <span className={`role-badge role-badge--${user.role}`}>{user.role}</span>
            </div>
            <div className="user-item__actions">
                <PrimaryButton onClick={() => onEdit(user)} className="btn--edit">
                    <Edit size={18} />
                </PrimaryButton>
                <PrimaryButton onClick={() => onDelete(user.id)} className="btn--delete">
                    <Trash2 size={18} />
                </PrimaryButton>
            </div>
        </div>
    );
};