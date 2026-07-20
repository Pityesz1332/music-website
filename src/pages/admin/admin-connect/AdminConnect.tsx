import { useAdminAuth } from "@hooks/admin/useAdminAuth";
import { ADMIN_CONNECT_STRINGS } from "@i18n/ui/admin/connect";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import "./AdminConnect.scss";

// Administration panel for user login.
// The process is centralized by the useAdminAuth hook.
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

                <PrimaryButton
                    className="admin-connect__button"
                    type="submit"
                    disabled={isLoading}
                >
                    {ADMIN_CONNECT_STRINGS.BUTTONS.CONNECT}
                </PrimaryButton>
            </form>
        </div>
    );
}