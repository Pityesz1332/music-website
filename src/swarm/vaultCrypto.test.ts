import { describe, it, expect } from "vitest";
import {
    deriveVaultKey,
    sealSecret,
    openSecret,
    toBase64Url,
    fromBase64Url,
} from "./vaultCrypto";

const FEED_KEY_HEX = "4646464646464646464646464646464646464646464646464646464646464646";

function prfOutput(fill: number): ArrayBuffer {
    return new Uint8Array(32).fill(fill).buffer;
}

describe("base64url helpers", () => {
    it("round-trips arbitrary bytes", () => {
        const bytes = new Uint8Array([0, 1, 62, 63, 127, 128, 254, 255]);
        expect(Array.from(fromBase64Url(toBase64Url(bytes)))).toEqual(Array.from(bytes));
    });

    it("emits url-safe output with no padding", () => {
        const encoded = toBase64Url(new Uint8Array([251, 255, 254]));
        expect(encoded).not.toMatch(/[+/=]/);
    });
});

describe("vault sealing", () => {
    it("round-trips the feed key with the same PRF output", async () => {
        const key = await deriveVaultKey(prfOutput(7));
        const sealed = await sealSecret(key, FEED_KEY_HEX);

        expect(await openSecret(key, sealed)).toBe(FEED_KEY_HEX);
    });

    it("never stores the key in the clear", async () => {
        const key = await deriveVaultKey(prfOutput(7));
        const sealed = await sealSecret(key, FEED_KEY_HEX);

        expect(sealed.ciphertext).not.toContain(FEED_KEY_HEX);
        expect(fromBase64Url(sealed.ciphertext)).not.toEqual(new TextEncoder().encode(FEED_KEY_HEX));
    });

    it("uses a fresh IV per seal, so identical input differs on disk", async () => {
        const key = await deriveVaultKey(prfOutput(7));
        const first = await sealSecret(key, FEED_KEY_HEX);
        const second = await sealSecret(key, FEED_KEY_HEX);

        expect(first.iv).not.toBe(second.iv);
        expect(first.ciphertext).not.toBe(second.ciphertext);
    });

    it("cannot be opened with a different authenticator's PRF output", async () => {
        const sealed = await sealSecret(await deriveVaultKey(prfOutput(7)), FEED_KEY_HEX);
        const wrongKey = await deriveVaultKey(prfOutput(8));

        await expect(openSecret(wrongKey, sealed)).rejects.toThrow();
    });

    it("rejects tampered ciphertext rather than returning garbage", async () => {
        const key = await deriveVaultKey(prfOutput(7));
        const sealed = await sealSecret(key, FEED_KEY_HEX);

        const bytes = fromBase64Url(sealed.ciphertext);
        bytes[0] ^= 0xff;

        await expect(
            openSecret(key, { ...sealed, ciphertext: toBase64Url(bytes) }),
        ).rejects.toThrow();
    });

    it("derives the same vault key from the same PRF output", async () => {
        const sealed = await sealSecret(await deriveVaultKey(prfOutput(7)), FEED_KEY_HEX);
        const rederived = await deriveVaultKey(prfOutput(7));

        expect(await openSecret(rederived, sealed)).toBe(FEED_KEY_HEX);
    });
});
