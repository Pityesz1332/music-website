// HKDF `info` — a fixed domain-separation label for the derived key, not
// secret and not sent anywhere. Kept distinct from the WebAuthn PRF salt
// below: that one gates *what secret the authenticator returns*, this one
// only labels what we derive *from* that secret.
const HKDF_INFO = new TextEncoder().encode("music-website-feed-key-v1");

const AES_IV_BYTES = 12;

export interface SealedSecret {
    iv: string;
    ciphertext: string;
}

/**
 * The salt evaluated by the WebAuthn PRF extension (`prf.eval.first`). Bound
 * to the current hostname so the same credential evaluated from a different
 * origin can never reproduce this vault's key material.
 */
export async function derivePrfEvalSalt(): Promise<Uint8Array> {
    const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(`${window.location.hostname}:music-website-feed-key-v1`),
    );
    return new Uint8Array(digest);
}

export function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
    const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    let binary = "";
    for (const byte of view) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
    const bytes = new Uint8Array(new ArrayBuffer(binary.length));
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

export async function deriveVaultKey(prfOutput: ArrayBuffer): Promise<CryptoKey> {
    const base = await crypto.subtle.importKey("raw", prfOutput, "HKDF", false, ["deriveKey"]);

    return crypto.subtle.deriveKey(
        {
            name: "HKDF",
            hash: "SHA-256",
            salt: new Uint8Array(0),
            info: HKDF_INFO,
        },
        base,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"],
    );
}

export async function sealSecret(key: CryptoKey, plaintext: string): Promise<SealedSecret> {
    const iv = crypto.getRandomValues(new Uint8Array(AES_IV_BYTES));
    const encoded = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);

    return { iv: toBase64Url(iv), ciphertext: toBase64Url(ciphertext) };
}

export async function openSecret(key: CryptoKey, sealed: SealedSecret): Promise<string> {
    const plaintext = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: fromBase64Url(sealed.iv) },
        key,
        fromBase64Url(sealed.ciphertext),
    );

    return new TextDecoder().decode(plaintext);
}
