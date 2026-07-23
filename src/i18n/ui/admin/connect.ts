export const ADMIN_CONNECT_STRINGS = {
    TITLE: "Admin Login",
    DESCRIPTION: "Sign in with your passkey, or unlock with your feed publisher key.",
    BUTTONS: {
        PASSKEY: "Sign in with passkey",
        PASSKEY_WAITING: "Waiting for passkey…",
        RAW_KEY: "Unlock with feed key",
        RAW_KEY_WAITING: "Unlocking…",
        HOME: "Go to the homepage",
    },
    RAW_KEY: {
        PLACEHOLDER: "Feed publisher private key (hex)",
        INVALID: "Invalid private key. Expected a 32-byte hex value.",
    },
    DIVIDER: "or",
} as const;
