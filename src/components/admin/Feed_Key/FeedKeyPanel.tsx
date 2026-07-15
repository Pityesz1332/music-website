import { useState } from "react";
import { KeyRound, Check, X } from "lucide-react";
import { setFeedKey, clearFeedKey, hasFeedKey } from "../../../services/feedKey";
import { SWARM_FEED_OWNER, SWARM_BEE_API } from "../../../utils/config";
import "./FeedKeyPanel.scss";

// The admin enters the catalog feed's private key here in order to be able to publish.
// The key only lives in memory (see services/feedKey.ts) — it must be re-entered after a reload.
export const FeedKeyPanel = () => {
    const [input, setInput] = useState("");
    const [unlocked, setUnlocked] = useState<boolean>(hasFeedKey());
    const [error, setError] = useState<string | null>(null);

    // Publishing is only possible when an admin-local build is running (a Bee node is available).
    const publishingAvailable = Boolean(SWARM_BEE_API);

    function handleUnlock() {
        setError(null);
        try {
            setFeedKey(input);
            setInput("");
            setUnlocked(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not set feed key.");
        }
    }

    function handleLock() {
        clearFeedKey();
        setUnlocked(false);
    }

    if (!publishingAvailable) {
        return (
            <div className="feed-key feed-key--readonly">
                <KeyRound size={16} />
                <span>Read-only build — no Bee node configured, so publishing is disabled.</span>
            </div>
        );
    }

    if (unlocked) {
        return (
            <div className="feed-key feed-key--unlocked">
                <Check size={16} />
                <span>Publishing unlocked{SWARM_FEED_OWNER ? ` for ${SWARM_FEED_OWNER.slice(0, 6)}…${SWARM_FEED_OWNER.slice(-4)}` : ""}. Key is held in memory only.</span>
                <button className="feed-key__button feed-key__button--lock" onClick={handleLock}>
                    <X size={14} /> Lock
                </button>
            </div>
        );
    }

    return (
        <div className="feed-key">
            <label className="feed-key__label">
                <KeyRound size={16} /> Feed private key (to publish changes)
            </label>
            <div className="feed-key__row">
                <input
                    className="feed-key__input"
                    type="password"
                    autoComplete="off"
                    placeholder="0x… feed owner private key"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className="feed-key__button feed-key__button--unlock" onClick={handleUnlock} disabled={!input.trim()}>
                    Unlock
                </button>
            </div>
            {error && <p className="feed-key__error">{error}</p>}
            <p className="feed-key__hint">Kept in memory only — never stored or sent anywhere. You'll re-enter it after a reload.</p>
        </div>
    );
};
