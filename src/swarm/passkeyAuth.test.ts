import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    enrollPasskey,
    createPasskeyVaultKey,
    sealVault,
    unlockVault,
    hasEnrolledPasskey,
    clearEnrolledPasskey,
    isPasskeySupported,
} from "./passkeyAuth";
import { deriveVaultKey, sealSecret, toBase64Url } from "./vaultCrypto";

const FEED_KEY_HEX = "4646464646464646464646464646464646464646464646464646464646464646";
const WRITE_URL = "http://localhost:1633";
const VAULT_KEY = "swarmAdminFeedVault";
const LEGACY_KEY = "swarmAdminPasskeyId";

const CREDENTIAL_ID = new Uint8Array(16).fill(3);

const create = vi.fn();
const get = vi.fn();

function authenticator({
    secret = 9,
    prfEnabled = true as boolean | undefined,
    prfAtCreate = false,
} = {}) {
    create.mockResolvedValue({
        rawId: CREDENTIAL_ID.buffer.slice(0),
        getClientExtensionResults: () => ({
            prf: prfAtCreate
                ? { enabled: prfEnabled, results: { first: new Uint8Array(32).fill(secret).buffer } }
                : { enabled: prfEnabled },
        }),
    });
    get.mockResolvedValue({
        getClientExtensionResults: () => ({
            prf: { results: { first: new Uint8Array(32).fill(secret).buffer } },
        }),
    });
}

const enroll = (signal?: AbortSignal) => enrollPasskey("Admin", FEED_KEY_HEX, WRITE_URL, signal);

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
    it("seals the feed key and write URL so neither touches storage in the clear", async () => {
        authenticator();
        await enroll();

        const stored = localStorage.getItem(VAULT_KEY) ?? "";
        expect(stored).not.toContain(FEED_KEY_HEX);
        expect(stored).not.toContain(WRITE_URL);
        expect(JSON.parse(stored)).toMatchObject({ v: 2 });
        expect(hasEnrolledPasskey()).toBe(true);
    });

    it("requires user verification and asks for a discoverable credential", async () => {
        authenticator();
        await enroll();

        const options = create.mock.calls[0][0].publicKey;
        expect(options.authenticatorSelection).toMatchObject({
            requireResidentKey: true,
            residentKey: "required",
            userVerification: "required",
        });
        expect(options.extensions).toHaveProperty("prf");
    });

    it("binds registration to this browsing origin's rp.id", async () => {
        authenticator();
        await enroll();

        const options = create.mock.calls[0][0].publicKey;
        expect(options.rp).toMatchObject({ id: window.location.hostname });
    });

    it("evaluates the PRF salt bound to this hostname, not a fixed constant", async () => {
        authenticator();
        await enroll();

        const evalSalt = create.mock.calls[0][0].publicKey.extensions.prf.eval.first as Uint8Array;
        const expected = new Uint8Array(
            await crypto.subtle.digest(
                "SHA-256",
                new TextEncoder().encode(`${window.location.hostname}:music-website-feed-key-v1`),
            ),
        );
        expect(Array.from(evalSalt)).toEqual(Array.from(expected));
    });

    it("does not need a second prompt when the authenticator returns PRF results at creation time", async () => {
        authenticator({ prfAtCreate: true });
        await enroll();

        expect(get).not.toHaveBeenCalled();
    });

    it("falls back to one extra assertion when creation didn't evaluate PRF", async () => {
        authenticator({ prfAtCreate: false });
        await enroll();

        expect(get).toHaveBeenCalledTimes(1);
    });

    it("stores nothing when the authenticator has no PRF support", async () => {
        authenticator({ prfEnabled: false });

        await expect(enroll()).rejects.toThrow(/PRF support/);
        expect(localStorage.getItem(VAULT_KEY)).toBeNull();
        expect(hasEnrolledPasskey()).toBe(false);
    });

    it("clears the pre-PRF credential record it replaces", async () => {
        localStorage.setItem(LEGACY_KEY, "old-bare-credential-id");
        authenticator();

        await enroll();
        expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
    });
});

describe("unlockVault", () => {
    it("returns the sealed feed key and write URL when the enrolled authenticator answers", async () => {
        authenticator();
        await enroll();

        await expect(unlockVault()).resolves.toEqual({
            feedKeyHex: FEED_KEY_HEX,
            writeUrl: WRITE_URL,
        });
    });

    it("prompts only for the enrolled credential, with verification required", async () => {
        authenticator();
        await enroll();
        get.mockClear();

        await unlockVault();

        const options = get.mock.calls[0][0].publicKey;
        expect(options.userVerification).toBe("required");
        expect(Array.from(new Uint8Array(options.allowCredentials[0].id))).toEqual(
            Array.from(CREDENTIAL_ID),
        );
    });

    it("throws when this device holds no sealed vault", async () => {
        await expect(unlockVault()).rejects.toThrow(/No passkey/);
        expect(get).not.toHaveBeenCalled();
    });

    it("does not unseal for a different authenticator's PRF secret", async () => {
        authenticator({ secret: 9 });
        await enroll();

        authenticator({ secret: 200 });
        await expect(unlockVault()).rejects.toThrow(/Could not unlock/);
    });

    it("throws when the authenticator returns no PRF output", async () => {
        authenticator();
        await enroll();

        get.mockResolvedValue({ getClientExtensionResults: () => ({}) });
        await expect(unlockVault()).rejects.toThrow(/cannot unlock/);
    });

    it("throws when the prompt is dismissed", async () => {
        authenticator();
        await enroll();

        get.mockResolvedValue(null);
        await expect(unlockVault()).rejects.toThrow(/dismissed/);
    });

    it("ignores an unreadable vault record instead of throwing on render", async () => {
        localStorage.setItem(VAULT_KEY, "{ not json");
        expect(hasEnrolledPasskey()).toBe(false);
        await expect(unlockVault()).rejects.toThrow(/No passkey/);
    });

    it("treats a pre-PRF credential record as not enrolled", () => {
        localStorage.setItem(LEGACY_KEY, "old-bare-credential-id");
        expect(hasEnrolledPasskey()).toBe(false);
    });
});

describe("createPasskeyVaultKey / sealVault (two-step enrollment)", () => {
    it("runs the ceremony without writing anything to storage", async () => {
        authenticator();

        const { credentialId, key } = await createPasskeyVaultKey("Admin");

        expect(credentialId).toBe(toBase64Url(CREDENTIAL_ID));
        expect(key).toBeDefined();
        expect(localStorage.getItem(VAULT_KEY)).toBeNull();
    });

    it("sealVault alone persists a vault that unlockVault can open", async () => {
        authenticator();
        const { credentialId, key } = await createPasskeyVaultKey("Admin");

        await sealVault(credentialId, key, { feedKeyHex: FEED_KEY_HEX, writeUrl: WRITE_URL });

        await expect(unlockVault()).resolves.toEqual({
            feedKeyHex: FEED_KEY_HEX,
            writeUrl: WRITE_URL,
        });
    });

});

describe("WebAuthn error mapping", () => {
    it("maps a denied/cancelled registration prompt to a friendly message", async () => {
        create.mockRejectedValue(new DOMException("denied", "NotAllowedError"));

        await expect(enroll()).rejects.toThrow(/cancelled or denied/);
    });

    it("maps an in-flight abort (Cancel button) to a friendly message and writes nothing", async () => {
        authenticator();
        const controller = new AbortController();
        create.mockImplementation(() => {
            controller.abort();
            return Promise.reject(new DOMException("aborted", "AbortError"));
        });

        await expect(enroll(controller.signal)).rejects.toThrow(/request was cancelled/);
        expect(localStorage.getItem(VAULT_KEY)).toBeNull();
    });

    it("passes the AbortSignal through to the registration call", async () => {
        authenticator();
        const controller = new AbortController();

        await enroll(controller.signal);

        expect(create.mock.calls[0][0].signal).toBe(controller.signal);
    });

    it("maps a denied/cancelled unlock prompt to a friendly message", async () => {
        authenticator();
        await enroll();
        get.mockRejectedValue(new DOMException("denied", "NotAllowedError"));

        await expect(unlockVault()).rejects.toThrow(/cancelled or denied/);
    });

    it("passes the AbortSignal through to the unlock call", async () => {
        authenticator();
        await enroll();
        get.mockClear();
        const controller = new AbortController();

        await unlockVault(controller.signal);

        expect(get.mock.calls[0][0].signal).toBe(controller.signal);
    });
});

describe("clearEnrolledPasskey", () => {
    it("forgets the sealed vault on this device", async () => {
        authenticator();
        await enroll();

        clearEnrolledPasskey();

        expect(hasEnrolledPasskey()).toBe(false);
        expect(localStorage.getItem(VAULT_KEY)).toBeNull();
    });
});

describe("vault versioning", () => {
    async function writeVault(version: number, plaintext: string) {
        const key = await deriveVaultKey(new Uint8Array(32).fill(9).buffer);
        const sealed = await sealSecret(key, plaintext);
        localStorage.setItem(VAULT_KEY, JSON.stringify({
            v: version,
            credentialId: toBase64Url(CREDENTIAL_ID),
            ...sealed,
        }));
    }

    it("writes new records as v2", async () => {
        authenticator();
        await enroll();

        expect(JSON.parse(localStorage.getItem(VAULT_KEY)!).v).toBe(2);
    });

    it("still unlocks a v1 vault, which sealed the bare key with no write URL", async () => {
        authenticator();
        const legacyKey = "a3f29b7c4e1d8056fa2b9c3d7e105f4a8b6c2d9e3f107a5b8c4d6e2f9a1b3c5d";
        await writeVault(1, legacyKey);

        await expect(unlockVault()).resolves.toEqual({ feedKeyHex: legacyKey, writeUrl: "" });
    });

    it("does not blame the passkey when a v2 payload is corrupt", async () => {
        authenticator();
        await writeVault(2, "not json at all");

        await expect(unlockVault()).rejects.toThrow(/unreadable/);
    });

    it("rejects a v2 payload that decrypts but carries no feed key", async () => {
        authenticator();
        await writeVault(2, JSON.stringify({ writeUrl: WRITE_URL }));

        await expect(unlockVault()).rejects.toThrow(/unreadable/);
    });

    it("ignores a record with an unknown future version", () => {
        localStorage.setItem(VAULT_KEY, JSON.stringify({
            v: 99, credentialId: "x", iv: "y", ciphertext: "z",
        }));

        expect(hasEnrolledPasskey()).toBe(false);
    });
});
