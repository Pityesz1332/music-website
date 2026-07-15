import { useAdminAuth } from "@hooks/admin/useAdminAuth";
import { ADMIN_CONNECT_STRINGS } from "@i18n/ui/admin/connect";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import "./AdminConnect.scss";

// Admin sign-in. Identity is proven by a wallet signature (SIWE) verified against
// the admin allowlist — see useAdminAuth / AdminContext. No passwords involved.
export const AdminConnect = () => {
    const { isLoading, handleConnect } = useAdminAuth();

    return (
        <div className="admin-connect-wrapper">
            <div className="admin-connect">
                <h2 className="admin-connect__title">{ADMIN_CONNECT_STRINGS.TITLE}</h2>

                <p className="admin-connect__hint">{ADMIN_CONNECT_STRINGS.HINT}</p>

                <PrimaryButton
                    className="admin-connect__button"
                    onClick={handleConnect}
                    disabled={isLoading}
                >
                    {isLoading
                        ? ADMIN_CONNECT_STRINGS.BUTTONS.CONNECTING
                        : ADMIN_CONNECT_STRINGS.BUTTONS.CONNECT}
                </PrimaryButton>
            </div>
        </div>
    );
}
