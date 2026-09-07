import { useRef, useState, useSyncExternalStore } from "react";
import { CheckCircle2, AlertTriangle, Fingerprint } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import {
    setFeedKey,
    clearFeedKey,
    getFeedKeyAddress,
    getFeedKeyHex,
    hasFeedKey,
    feedKeyMatchesOwner,
    subscribeToFeedKey,
} from "../../../swarm/feedKey";
import {
    setWriteUrl,
    clearWriteUrl,
    getWriteUrl,
    hasWriteUrl,
    subscribeToWriteUrl,
} from "../../../swarm/writeConfig";
import {
    createPasskeyVaultKey,
    sealVault,
    hasEnrolledPasskey,
    clearEnrolledPasskey,
    isPasskeySupported,
} from "../../../swarm/passkeyAuth";
import { createAttemptTracker } from "../../../swarm/attempt";
import { FEED_OWNER_ADDRESS } from "../../../swarm/swarmService";
import { ADMIN_FEED_KEY_STRINGS } from "@i18n/ui/admin/feed-key";
import "./FeedKeyPanel.scss";

export const FeedKeyPanel = () => {
    const [value, setValue] = useState("");
    const [urlValue, setUrlValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [urlError, setUrlError] = useState<string | null>(null);
    const [passkeyBusy, setPasskeyBusy] = useState(false);
    const [passkeyEnrolled, setPasskeyEnrolled] = useState(hasEnrolledPasskey);

    // Guards enrollment's two awaited steps (ceremony, then seal-and-persist)
    // against a cancel landing between them — see src/swarm/attempt.ts.
    const attemptsRef = useRef(createAttemptTracker());
    const controllerRef = useRef<AbortController | undefined>(undefined);

    const keyLoaded = useSyncExternalStore(subscribeToFeedKey, hasFeedKey, () => false);
    const urlLoaded = useSyncExternalStore(subscribeToWriteUrl, hasWriteUrl, () => false);
    const keyAddress = getFeedKeyAddress();
    const writeUrl = getWriteUrl();
    const passkeySupported = isPasskeySupported();
    const mismatch =
        keyLoaded &&
        !!FEED_OWNER_ADDRESS &&
        !feedKeyMatchesOwner(FEED_OWNER_ADDRESS);
    const canEnrollPasskey = keyLoaded && urlLoaded;

    const handleSet = () => {
        try {
            setFeedKey(value);
            setError(null);
            setValue("");
        } catch {
            setError(ADMIN_FEED_KEY_STRINGS.INVALID);
        }
    };

    const handleClear = () => {
        clearFeedKey();
        setError(null);
    };

    const handleSetUrl = () => {
        try {
            setWriteUrl(urlValue);
            setUrlError(null);
            setUrlValue("");
        } catch {
            setUrlError(ADMIN_FEED_KEY_STRINGS.WRITE_URL.INVALID);
        }
    };

    const handleClearUrl = () => {
        clearWriteUrl();
        setUrlError(null);
    };

    const handleEnrollPasskey = async () => {
        const feedKeyHex = getFeedKeyHex();
        if (!feedKeyHex || !writeUrl) return;

        const attempt = attemptsRef.current.begin();
        const controller = new AbortController();
        controllerRef.current = controller;
        setPasskeyBusy(true);
        setError(null);
        try {
            const { credentialId, key } = await attempt.guard(
                createPasskeyVaultKey(ADMIN_FEED_KEY_STRINGS.PASSKEY.LABEL, controller.signal),
            );
            // A cancel landing here still stops the write below — the
            // ceremony above can't always be aborted mid-flight once the
            // authenticator has already answered.
            await attempt.guard(sealVault(credentialId, key, { feedKeyHex, writeUrl }));
            setPasskeyEnrolled(hasEnrolledPasskey());
        } catch (err) {
            if (attempt.current) {
                setError(err instanceof Error ? err.message : "Could not create the passkey.");
            }
        } finally {
            if (attempt.current) {
                setPasskeyBusy(false);
                controllerRef.current = undefined;
            }
        }
    };

    /** Abort the in-flight enrollment and return the panel to idle. */
    const handleCancelEnrollPasskey = () => {
        attemptsRef.current.supersede();
        controllerRef.current?.abort();
        controllerRef.current = undefined;
        setPasskeyBusy(false);
    };

    const handleForgetPasskey = () => {
        clearEnrolledPasskey();
        setPasskeyEnrolled(hasEnrolledPasskey());
        setError(null);
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

            <div className="feed-key-panel__section">
                <h3 className="feed-key-panel__section-title">{ADMIN_FEED_KEY_STRINGS.WRITE_URL.TITLE}</h3>
                <p className="feed-key-panel__description">{ADMIN_FEED_KEY_STRINGS.WRITE_URL.DESCRIPTION}</p>

                {!urlLoaded && (
                    <div className="feed-key-panel__controls">
                        <input
                            className="feed-key-panel__input"
                            type="text"
                            autoComplete="off"
                            spellCheck={false}
                            placeholder={ADMIN_FEED_KEY_STRINGS.WRITE_URL.PLACEHOLDER}
                            value={urlValue}
                            onChange={(e) => setUrlValue(e.target.value)}
                        />
                        <PrimaryButton
                            className="feed-key-panel__button"
                            onClick={handleSetUrl}
                            disabled={!urlValue.trim()}
                        >
                            {ADMIN_FEED_KEY_STRINGS.WRITE_URL.BUTTONS.SET}
                        </PrimaryButton>
                    </div>
                )}

                {urlError && <p className="feed-key-panel__error">{urlError}</p>}

                {urlLoaded ? (
                    <div className="feed-key-panel__status feed-key-panel__status--set">
                        <p>
                            <CheckCircle2 size={16} /> {ADMIN_FEED_KEY_STRINGS.WRITE_URL.STATUS.SET}
                        </p>
                        {writeUrl && (
                            <p className="feed-key-panel__address">
                                <code>{writeUrl}</code>
                            </p>
                        )}
                        <PrimaryButton className="feed-key-panel__button" onClick={handleClearUrl}>
                            {ADMIN_FEED_KEY_STRINGS.WRITE_URL.BUTTONS.CLEAR}
                        </PrimaryButton>
                    </div>
                ) : (
                    <p className="feed-key-panel__status">{ADMIN_FEED_KEY_STRINGS.WRITE_URL.STATUS.NOT_SET}</p>
                )}
            </div>

            {passkeySupported && (passkeyEnrolled || canEnrollPasskey) && (
                <div className="feed-key-panel__passkey">
                    <p className="feed-key-panel__description">
                        {passkeyEnrolled
                            ? ADMIN_FEED_KEY_STRINGS.PASSKEY.ENROLLED
                            : ADMIN_FEED_KEY_STRINGS.PASSKEY.DESCRIPTION}
                    </p>
                    {passkeyEnrolled ? (
                        <PrimaryButton
                            className="feed-key-panel__button feed-key-panel__button--compact"
                            onClick={handleForgetPasskey}
                        >
                            {ADMIN_FEED_KEY_STRINGS.BUTTONS.FORGET_PASSKEY}
                        </PrimaryButton>
                    ) : (
                        <>
                            <PrimaryButton
                                className="feed-key-panel__button feed-key-panel__button--compact"
                                onClick={handleEnrollPasskey}
                                disabled={passkeyBusy}
                            >
                                <Fingerprint size={16} />
                                {passkeyBusy
                                    ? ADMIN_FEED_KEY_STRINGS.BUTTONS.ENROLLING_PASSKEY
                                    : ADMIN_FEED_KEY_STRINGS.BUTTONS.ENROLL_PASSKEY}
                            </PrimaryButton>
                            {passkeyBusy && (
                                <PrimaryButton
                                    className="feed-key-panel__button feed-key-panel__button--compact feed-key-panel__button--cancel"
                                    onClick={handleCancelEnrollPasskey}
                                >
                                    {ADMIN_FEED_KEY_STRINGS.BUTTONS.CANCEL}
                                </PrimaryButton>
                            )}
                        </>
                    )}
                </div>
            )}
        </section>
    );
};
