import { useState } from "react";
import { CheckCircle2, AlertTriangle, Fingerprint } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { setFeedKey, clearFeedKey, getFeedKeyAddress, hasFeedKey, feedKeyMatchesOwner } from "../../../swarm/feedKey";
import {
    enrollPasskey,
    hasEnrolledPasskey,
    clearEnrolledPasskey,
    isPasskeySupported,
} from "../../../swarm/passkeyAuth";
import { FEED_OWNER_ADDRESS } from "../../../swarm/swarmService";
import { ADMIN_FEED_KEY_STRINGS } from "@i18n/ui/admin/feed-key";
import "./FeedKeyPanel.scss";

export const FeedKeyPanel = () => {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [passkeyBusy, setPasskeyBusy] = useState(false);
    // Bump to re-render after the in-memory key store or passkey enrollment changes.
    const [, forceRender] = useState(0);

    const keyLoaded = hasFeedKey();
    const keyAddress = getFeedKeyAddress();
    const passkeySupported = isPasskeySupported();
    const passkeyEnrolled = hasEnrolledPasskey();
    const mismatch =
        keyLoaded &&
        !!FEED_OWNER_ADDRESS &&
        !feedKeyMatchesOwner(FEED_OWNER_ADDRESS);

    const handleSet = () => {
        try {
            setFeedKey(value);
            setError(null);
            setValue("");
            forceRender((n) => n + 1);
        } catch {
            setError(ADMIN_FEED_KEY_STRINGS.INVALID);
        }
    };

    const handleClear = () => {
        clearFeedKey();
        setError(null);
        forceRender((n) => n + 1);
    };

    const handleEnrollPasskey = async () => {
        setPasskeyBusy(true);
        setError(null);
        try {
            await enrollPasskey(ADMIN_FEED_KEY_STRINGS.PASSKEY.LABEL);
            forceRender((n) => n + 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not create the passkey.");
        } finally {
            setPasskeyBusy(false);
        }
    };

    const handleForgetPasskey = () => {
        clearEnrolledPasskey();
        setError(null);
        forceRender((n) => n + 1);
    };

    return (
        <section className="feed-key-panel">
            <header className="feed-key-panel__header">
                <h2 className="feed-key-panel__title">{ADMIN_FEED_KEY_STRINGS.TITLE}</h2>
            </header>

            <p className="feed-key-panel__description">{ADMIN_FEED_KEY_STRINGS.DESCRIPTION}</p>

            {!keyLoaded && (
                <div className="feed-key-panel__controls">
                    <input
                        className="feed-key-panel__input"
                        type="password"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder={ADMIN_FEED_KEY_STRINGS.PLACEHOLDER}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <PrimaryButton
                        className="feed-key-panel__button"
                        onClick={handleSet}
                        disabled={!value.trim()}
                    >
                        {ADMIN_FEED_KEY_STRINGS.BUTTONS.SET}
                    </PrimaryButton>
                </div>
            )}

            {error && <p className="feed-key-panel__error">{error}</p>}

            {keyLoaded ? (
                <div className="feed-key-panel__status feed-key-panel__status--set">
                    <p>
                        <CheckCircle2 size={16} /> {ADMIN_FEED_KEY_STRINGS.STATUS.SET}
                    </p>
                    {keyAddress && (
                        <p className="feed-key-panel__address">
                            {ADMIN_FEED_KEY_STRINGS.STATUS.ADDRESS} <code>{keyAddress}</code>
                        </p>
                    )}
                    {mismatch && (
                        <p className="feed-key-panel__warning">
                            <AlertTriangle size={16} /> {ADMIN_FEED_KEY_STRINGS.STATUS.MISMATCH}
                        </p>
                    )}
                    <PrimaryButton className="feed-key-panel__button" onClick={handleClear}>
                        {ADMIN_FEED_KEY_STRINGS.BUTTONS.CLEAR}
                    </PrimaryButton>
                </div>
            ) : (
                <p className="feed-key-panel__status">{ADMIN_FEED_KEY_STRINGS.STATUS.NOT_SET}</p>
            )}

            {passkeySupported && (passkeyEnrolled || keyLoaded) && (
                <div className="feed-key-panel__passkey">
                    <p className="feed-key-panel__description">
                        {passkeyEnrolled
                            ? ADMIN_FEED_KEY_STRINGS.PASSKEY.ENROLLED
                            : ADMIN_FEED_KEY_STRINGS.PASSKEY.DESCRIPTION}
                    </p>
                    {passkeyEnrolled ? (
                        <PrimaryButton className="feed-key-panel__button" onClick={handleForgetPasskey}>
                            {ADMIN_FEED_KEY_STRINGS.BUTTONS.FORGET_PASSKEY}
                        </PrimaryButton>
                    ) : (
                        // Only reachable with keyLoaded, per the outer condition above --
                        // enrolling a new login door requires already holding the real key.
                        <PrimaryButton
                            className="feed-key-panel__button"
                            onClick={handleEnrollPasskey}
                            disabled={passkeyBusy}
                        >
                            <Fingerprint size={16} />
                            {passkeyBusy
                                ? ADMIN_FEED_KEY_STRINGS.BUTTONS.ENROLLING_PASSKEY
                                : ADMIN_FEED_KEY_STRINGS.BUTTONS.ENROLL_PASSKEY}
                        </PrimaryButton>
                    )}
                </div>
            )}
        </section>
    );
};
