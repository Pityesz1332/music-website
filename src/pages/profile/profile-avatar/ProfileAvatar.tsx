import "./ProfileAvatar.scss";

interface ProfileAvatarProps {
    avatar: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatar = ({ avatar, onChange }: ProfileAvatarProps) => {
    const defaultAvatar = `${import.meta.env.BASE_URL}assets/default-avatar.jpg`;

    return (
        <div className="my-account__avatar-container">
            <label htmlFor="avatar-upload" className="my-account__avatar-label">
                <img 
                    src={avatar || defaultAvatar} 
                    alt="Profile Avatar"
                    className="my-account__avatar-image" 
                />
                <div className="my-account__avatar-overlay">
                    <span>Change Avatar</span>
                </div>
            </label>

            <input 
                id="avatar-upload"
                type="file" 
                accept="image/*" 
                onChange={onChange} 
                className="my-account__avatar-input"
            />
        </div>
    );
};