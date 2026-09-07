export const ADMIN_CONNECT_STRINGS = {
    TITLE: "Admin Login",
    DESCRIPTION: "Unlock with your passkey, or sign in by pasting your feed publisher key.",
    BUTTONS: {
        PASSKEY: "Unlock with passkey",
        PASSKEY_WAITING: "Waiting for passkey…",
        RAW_KEY: "Unlock with feed key",
        RAW_KEY_WAITING: "Unlocking…",
        CANCEL: "Cancel",
        HOME: "Go to the homepage",
    },
    RAW_KEY: {
        PLACEHOLDER: "Feed publisher private key (hex)",
        INVALID: "Invalid private key. Expected a 32-byte hex value.",
    },
    DIVIDER: "or",
} as const;
