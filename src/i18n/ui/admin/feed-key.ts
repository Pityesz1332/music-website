export const ADMIN_FEED_KEY_STRINGS = {
    TITLE: "Feed Publisher Key",
    DESCRIPTION:
        "Paste the Swarm feed publisher private key to enable publishing. It is kept in memory only for this session — never stored or bundled.",
    PLACEHOLDER: "Feed publisher private key (hex)",
    BUTTONS: {
        SET: "Set Key",
        CLEAR: "Clear Key",
        ENROLL_PASSKEY: "Set up a passkey",
        ENROLLING_PASSKEY: "Waiting for passkey…",
        FORGET_PASSKEY: "Remove passkey",
    },
    STATUS: {
        SET: "Key loaded for this session.",
        NOT_SET: "No key loaded — publishing is disabled.",
        ADDRESS: "Publishes as:",
        MISMATCH:
            "Warning: this key's address does not match the configured feed owner. Published songs will not be visible to readers.",
    },
    INVALID: "Invalid private key. Expected a 32-byte hex value.",
    PASSKEY: {
        LABEL: "Music Website Admin",
        DESCRIPTION:
            "Add a passkey so you can get back into this dashboard with Touch ID, Face ID or a security key next time, instead of using the feed key to sign in. You'll still need to enter the feed key separately to publish.",
        ENROLLED: "A passkey is set up for signing in on this device.",
    },
} as const;
