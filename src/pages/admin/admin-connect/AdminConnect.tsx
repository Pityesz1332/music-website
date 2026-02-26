import { useAdminAuth } from "../../../hooks/admin/useAdminAuth";
import { ADMIN_CONNECT_STRINGS } from "../../../constants/ui/admin/connect";
import "./AdminConnect.scss";

export const AdminConnect = () => {
    
    const {
        credentials,
        isLoading,
        handleChange,
        handleSubmit
    } = useAdminAuth();

    return (
        <div className="admin-connect-wrapper">
            <form onSubmit={handleSubmit} className="admin-connect">
                <h2 className="admin-connect__title">{ADMIN_CONNECT_STRINGS.TITLE}</h2>
                
                <input
                    className="admin-connect__input"
                    type="text"
                    name="username"
                    placeholder={ADMIN_CONNECT_STRINGS.PLACEHOLDERS.USERNAME}
                    value={credentials.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    />

                <input
                    className="admin-connect__input"
                    type="password"
                    name="password"
                    placeholder={ADMIN_CONNECT_STRINGS.PLACEHOLDERS.PASSWORD}
                    value={credentials.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    />

                <button
                    className="admin-connect__button"
                    type="submit"
                    disabled={isLoading}
                >
                    {ADMIN_CONNECT_STRINGS.BUTTONS.CONNECT}
                </button>
            </form>
        </div>
    );
}