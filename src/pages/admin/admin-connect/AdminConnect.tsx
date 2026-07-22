import { Wallet, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "@hooks/admin/useAdminAuth";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { ADMIN_CONNECT_STRINGS } from "@i18n/ui/admin/connect";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import "./AdminConnect.scss";

export const AdminConnect = () => {
    const { isLoading, handleSignIn } = useAdminAuth();

    return (
        <div className="admin-connect-wrapper">
            <div className="admin-connect">
                <h2 className="admin-connect__title">{ADMIN_CONNECT_STRINGS.TITLE}</h2>
                <p className="admin-connect__description">{ADMIN_CONNECT_STRINGS.DESCRIPTION}</p>

                <PrimaryButton
                    className="admin-connect__button"
                    type="button"
                    onClick={handleSignIn}
                    disabled={isLoading}
                >
                    <Wallet size={18} />
                    {isLoading
                        ? ADMIN_CONNECT_STRINGS.BUTTONS.CONNECTING
                        : ADMIN_CONNECT_STRINGS.BUTTONS.CONNECT}
                </PrimaryButton>

                <Link className="admin-connect__home-link" to={MainRoutes.HOME}>
                    <Home size={18} />
                    {ADMIN_CONNECT_STRINGS.BUTTONS.HOME}
                </Link>
            </div>
        </div>
    );
}
