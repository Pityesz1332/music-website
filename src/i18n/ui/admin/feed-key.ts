export const ADMIN_FEED_KEY_STRINGS = {
    TITLE: "Feed Publisher Key",
    DESCRIPTION:
        "Paste the Swarm feed publisher private key to enable publishing. It is held in memory for this session only, and is never bundled. It is written to this device only if you seal it behind a passkey below, and only as ciphertext.",
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
            "Add a passkey to store this feed key encrypted on this device. Next time you can unlock it with Touch ID, Face ID or a security key instead of pasting the key again — this is the last time you need to type it here.",
        ENROLLED:
            "This device holds an encrypted copy of the feed key, unlocked by your passkey. Removing it means pasting the key again next time.",
    },
} as const;
