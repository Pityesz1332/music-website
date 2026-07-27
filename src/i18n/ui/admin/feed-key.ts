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
    WRITE_URL: {
        TITLE: "Bee Node (Write) URL",
        DESCRIPTION:
            "The writable Bee node this browser uploads to and publishes through. Entered here at runtime only — it is never built into the site, so a public deployment never ships this address to visitors.",
        PLACEHOLDER: "http://localhost:1633",
        BUTTONS: {
            SET: "Set URL",
            CLEAR: "Clear URL",
        },
        STATUS: {
            SET: "Write node configured for this session.",
            NOT_SET: "No write node configured — uploads and publishing are disabled.",
        },
        INVALID: "Enter a valid http:// or https:// URL.",
    },
    PASSKEY: {
        LABEL: "Music Website Admin",
        DESCRIPTION:
            "Add a passkey to store this feed key and Bee node URL encrypted on this device. Next time you can unlock both with Touch ID, Face ID or a security key instead of entering them again — this is the last time you need to type them here.",
        ENROLLED:
            "This device holds an encrypted copy of your feed key and Bee node URL, unlocked by your passkey. Removing it means entering them again next time.",
    },
} as const;
