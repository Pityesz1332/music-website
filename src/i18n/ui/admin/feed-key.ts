export const ADMIN_FEED_KEY_STRINGS = {
    TITLE: "Feed Publisher Key",
    DESCRIPTION:
        "Paste the Swarm feed publisher private key to enable publishing. It is kept in memory only for this session — never stored or bundled.",
    PLACEHOLDER: "Feed publisher private key (hex)",
    BUTTONS: {
        SET: "Set Key",
        CLEAR: "Clear Key",
    },
    STATUS: {
        SET: "Key loaded for this session.",
        NOT_SET: "No key loaded — publishing is disabled.",
        ADDRESS: "Publishes as:",
        MISMATCH:
            "Warning: this key's address does not match the configured feed owner. Published songs will not be visible to readers.",
    },
    INVALID: "Invalid private key. Expected a 32-byte hex value.",
} as const;
