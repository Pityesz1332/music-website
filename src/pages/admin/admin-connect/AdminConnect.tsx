import { Home, Fingerprint, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "@hooks/admin/useAdminAuth";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { ADMIN_CONNECT_STRINGS } from "@i18n/ui/admin/connect";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import "./AdminConnect.scss";

export const AdminConnect = () => {
    const {
        isPasskeyLoading,
        isKeyLoading,
        canUsePasskey,
        rawKey,
        setRawKey,
        handlePasskeySignIn,
        cancelPasskeySignIn,
        handleRawKeySignIn,
    } = useAdminAuth();
    const busy = isPasskeyLoading || isKeyLoading;

    return (
        <div className="admin-connect-wrapper">
            <div className="admin-connect">
                <h2 className="admin-connect__title">{ADMIN_CONNECT_STRINGS.TITLE}</h2>
                <p className="admin-connect__description">{ADMIN_CONNECT_STRINGS.DESCRIPTION}</p>

                {canUsePasskey && (
                    <>
                        <PrimaryButton
                            className="admin-connect__button"
                            type="button"
                            onClick={handlePasskeySignIn}
                            disabled={busy}
                        >
                            <Fingerprint size={18} />
                            {isPasskeyLoading
                                ? ADMIN_CONNECT_STRINGS.BUTTONS.PASSKEY_WAITING
                                : ADMIN_CONNECT_STRINGS.BUTTONS.PASSKEY}
                        </PrimaryButton>

                        {isPasskeyLoading && (
                            <PrimaryButton
                                className="admin-connect__button admin-connect__button--cancel"
                                type="button"
                                onClick={cancelPasskeySignIn}
                            >
                                {ADMIN_CONNECT_STRINGS.BUTTONS.CANCEL}
                            </PrimaryButton>
                        )}

                        <span className="admin-connect__divider">
                            {ADMIN_CONNECT_STRINGS.DIVIDER}
                        </span>
                    </>
                )}

                <form className="admin-connect__raw-key" onSubmit={handleRawKeySignIn}>
                    <input
                        className="admin-connect__input"
                        type="password"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder={ADMIN_CONNECT_STRINGS.RAW_KEY.PLACEHOLDER}
                        value={rawKey}
                        onChange={(e) => setRawKey(e.target.value)}
                    />
                    <PrimaryButton
                        className="admin-connect__button"
                        type="submit"
                        disabled={busy || !rawKey.trim()}
                    >
                        <KeyRound size={18} />
                        {isKeyLoading
                            ? ADMIN_CONNECT_STRINGS.BUTTONS.RAW_KEY_WAITING
                            : ADMIN_CONNECT_STRINGS.BUTTONS.RAW_KEY}
                    </PrimaryButton>
                </form>

                <Link className="admin-connect__home-link" to={MainRoutes.HOME}>
                    <Home size={18} />
                    {ADMIN_CONNECT_STRINGS.BUTTONS.HOME}
                </Link>
            </div>
        </div>
    );
}
