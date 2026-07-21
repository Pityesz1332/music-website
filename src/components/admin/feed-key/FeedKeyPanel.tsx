import { useState } from "react";
import { KeyRound, CheckCircle2, AlertTriangle } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { setFeedKey, clearFeedKey, getFeedKeyAddress, hasFeedKey } from "../../../swarm/feedKey";
import { ADMIN_FEED_KEY_STRINGS } from "@i18n/ui/admin/feed-key";
import "./FeedKeyPanel.scss";

const FEED_OWNER_ADDRESS = (import.meta.env.VITE_FEED_OWNER_ADDRESS as string | undefined) ?? "";

export const FeedKeyPanel = () => {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    // Bump to re-render after the in-memory key store changes.
    const [, forceRender] = useState(0);

    const keyLoaded = hasFeedKey();
    const keyAddress = getFeedKeyAddress();
    const mismatch =
        keyLoaded &&
        !!FEED_OWNER_ADDRESS &&
        keyAddress?.toLowerCase() !== FEED_OWNER_ADDRESS.toLowerCase();

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

    return (
        <section className="feed-key-panel">
            <header className="feed-key-panel__header">
                <KeyRound size={18} />
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
        </section>
    );
};
