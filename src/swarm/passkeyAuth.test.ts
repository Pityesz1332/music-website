import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    enrollPasskey,
    unlockFeedKey,
    hasEnrolledPasskey,
    clearEnrolledPasskey,
    isPasskeySupported,
} from "./passkeyAuth";

const FEED_KEY_HEX = "4646464646464646464646464646464646464646464646464646464646464646";
const VAULT_KEY = "swarmAdminFeedVault";
const LEGACY_KEY = "swarmAdminPasskeyId";

const CREDENTIAL_ID = new Uint8Array(16).fill(3);

const create = vi.fn();
const get = vi.fn();

function authenticator({ secret = 9, prfEnabled = true as boolean | undefined } = {}) {
    create.mockResolvedValue({
        rawId: CREDENTIAL_ID.buffer.slice(0),
        getClientExtensionResults: () => ({ prf: { enabled: prfEnabled } }),
    });
    get.mockResolvedValue({
        getClientExtensionResults: () => ({
            prf: { results: { first: new Uint8Array(32).fill(secret).buffer } },
        }),
    });
}

beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    Object.defineProperty(window, "isSecureContext", { value: true, configurable: true });
    Object.defineProperty(window, "PublicKeyCredential", { value: function () {}, configurable: true });
    Object.defineProperty(navigator, "credentials", { value: { create, get }, configurable: true });
});

describe("isPasskeySupported", () => {
    it("is false outside a secure context", () => {
        Object.defineProperty(window, "isSecureContext", { value: false, configurable: true });
        expect(isPasskeySupported()).toBe(false);
    });

    it("is true with WebAuthn over a secure context", () => {
        expect(isPasskeySupported()).toBe(true);
    });
});

describe("enrollPasskey", () => {
    it("seals the feed key so it never touches storage in the clear", async () => {
        authenticator();
        await enrollPasskey("Admin", FEED_KEY_HEX);

        const stored = localStorage.getItem(VAULT_KEY) ?? "";
        expect(stored).not.toContain(FEED_KEY_HEX);
        expect(JSON.parse(stored)).toMatchObject({ v: 1 });
        expect(hasEnrolledPasskey()).toBe(true);
    });

    it("requires user verification and asks for a discoverable credential", async () => {
        authenticator();
        await enrollPasskey("Admin", FEED_KEY_HEX);

        const options = create.mock.calls[0][0].publicKey;
        expect(options.authenticatorSelection).toMatchObject({
            residentKey: "required",
            userVerification: "required",
        });
        expect(options.extensions).toHaveProperty("prf");
    });

    it("stores nothing when the authenticator has no PRF support", async () => {
        authenticator({ prfEnabled: false });

        await expect(enrollPasskey("Admin", FEED_KEY_HEX)).rejects.toThrow(/PRF support/);
        expect(localStorage.getItem(VAULT_KEY)).toBeNull();
        expect(hasEnrolledPasskey()).toBe(false);
    });

    it("clears the pre-PRF credential record it replaces", async () => {
        localStorage.setItem(LEGACY_KEY, "old-bare-credential-id");
        authenticator();

        await enrollPasskey("Admin", FEED_KEY_HEX);
        expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
    });
});

describe("unlockFeedKey", () => {
    it("returns the sealed key when the enrolled authenticator answers", async () => {
        authenticator();
        await enrollPasskey("Admin", FEED_KEY_HEX);

        await expect(unlockFeedKey()).resolves.toBe(FEED_KEY_HEX);
    });

    it("prompts only for the enrolled credential, with verification required", async () => {
        authenticator();
        await enrollPasskey("Admin", FEED_KEY_HEX);
        get.mockClear();

        await unlockFeedKey();

        const options = get.mock.calls[0][0].publicKey;
        expect(options.userVerification).toBe("required");
        expect(Array.from(new Uint8Array(options.allowCredentials[0].id))).toEqual(
            Array.from(CREDENTIAL_ID),
        );
    });

    it("throws when this device holds no sealed key", async () => {
        await expect(unlockFeedKey()).rejects.toThrow(/No passkey/);
        expect(get).not.toHaveBeenCalled();
    });

    it("does not unseal for a different authenticator's PRF secret", async () => {
        authenticator({ secret: 9 });
        await enrollPasskey("Admin", FEED_KEY_HEX);

        authenticator({ secret: 200 });
        await expect(unlockFeedKey()).rejects.toThrow(/Could not unlock/);
    });

    it("throws when the authenticator returns no PRF output", async () => {
        authenticator();
        await enrollPasskey("Admin", FEED_KEY_HEX);

        get.mockResolvedValue({ getClientExtensionResults: () => ({}) });
        await expect(unlockFeedKey()).rejects.toThrow(/cannot unlock/);
    });

    it("throws when the prompt is dismissed", async () => {
        authenticator();
        await enrollPasskey("Admin", FEED_KEY_HEX);

        get.mockResolvedValue(null);
        await expect(unlockFeedKey()).rejects.toThrow(/dismissed/);
    });

    it("ignores an unreadable vault record instead of throwing on render", async () => {
        localStorage.setItem(VAULT_KEY, "{ not json");
        expect(hasEnrolledPasskey()).toBe(false);
        await expect(unlockFeedKey()).rejects.toThrow(/No passkey/);
    });

    it("treats a pre-PRF credential record as not enrolled", () => {
        localStorage.setItem(LEGACY_KEY, "old-bare-credential-id");
        expect(hasEnrolledPasskey()).toBe(false);
    });
});

describe("clearEnrolledPasskey", () => {
    it("forgets the sealed key on this device", async () => {
        authenticator();
        await enrollPasskey("Admin", FEED_KEY_HEX);

        clearEnrolledPasskey();

        expect(hasEnrolledPasskey()).toBe(false);
        expect(localStorage.getItem(VAULT_KEY)).toBeNull();
    });
});
