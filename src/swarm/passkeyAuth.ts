import { deriveVaultKey, derivePrfEvalSalt, openSecret, sealSecret, toBase64Url, fromBase64Url } from "./vaultCrypto";
import type { SealedSecret } from "./vaultCrypto";

const VAULT_KEY = "swarmAdminFeedVault";
const LEGACY_KEY = "swarmAdminPasskeyId";
const RP_NAME = "Music Website Admin";

export interface VaultPayload {
    feedKeyHex: string;
    writeUrl: string;
}

const VAULT_VERSION = 2;

interface VaultRecord extends SealedSecret {
    v: 1 | 2;
    credentialId: string;
}

interface PrfOutputs {
    prf?: { enabled?: boolean; results?: { first?: ArrayBuffer } };
}

function randomChallenge(): Uint8Array<ArrayBuffer> {
    return crypto.getRandomValues(new Uint8Array(new ArrayBuffer(32)));
}

function readVault(): VaultRecord | null {
    const raw = localStorage.getItem(VAULT_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as VaultRecord;
        const versionOk = parsed?.v === 1 || parsed?.v === 2;
        if (!versionOk || !parsed.credentialId || !parsed.iv || !parsed.ciphertext) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function isPasskeySupported(): boolean {
    return (
        typeof window !== "undefined" &&
        !!window.PublicKeyCredential &&
        !!window.isSecureContext
    );
}

export function hasEnrolledPasskey(): boolean {
    return readVault() !== null;
}

export function clearEnrolledPasskey(): void {
    localStorage.removeItem(VAULT_KEY);
    localStorage.removeItem(LEGACY_KEY);
}

/**
 * Maps a raw WebAuthn failure to a message an admin can act on, instead of
 * the browser's own (inconsistent, sometimes cryptic) `DOMException` text.
 */
function friendlyWebAuthnError(error: unknown): never {
    if (error instanceof DOMException) {
        switch (error.name) {
            case "NotAllowedError":
                throw new Error("Passkey prompt was cancelled or denied.");
            case "InvalidStateError":
                throw new Error("This passkey is already registered on this device.");
            case "NotSupportedError":
                throw new Error("This device does not support passkeys.");
            case "SecurityError":
                throw new Error("Passkeys require a secure (HTTPS) connection.");
            case "AbortError":
                throw new Error("Passkey request was cancelled.");
        }
        throw new Error(`Passkey error: ${error.message}`);
    }
    throw error instanceof Error ? error : new Error("Unknown passkey error.");
}

async function evaluatePrf(
    credentialId: Uint8Array<ArrayBuffer>,
    signal?: AbortSignal,
): Promise<ArrayBuffer> {
    const prfSalt = await derivePrfEvalSalt();

    let assertion: PublicKeyCredential | null | undefined;
    try {
        assertion = (await navigator.credentials.get({
            signal,
            publicKey: {
                challenge: randomChallenge(),
                userVerification: "required",
                allowCredentials: [{ id: credentialId, type: "public-key" }],
                extensions: {
                    prf: { eval: { first: prfSalt as BufferSource } },
                } as AuthenticationExtensionsClientInputs,
            },
        })) as PublicKeyCredential | null;
    } catch (error) {
        friendlyWebAuthnError(error);
    }

    if (!assertion) throw new Error("Passkey prompt was dismissed.");

    const prf = (assertion.getClientExtensionResults() as PrfOutputs).prf;
    if (!prf?.results?.first) {
        throw new Error("This passkey cannot unlock the feed key on this device.");
    }

    return prf.results.first;
}

/**
 * Run the WebAuthn registration ceremony and derive the vault key from its
 * PRF output. Ceremony only — nothing is sealed or persisted here, so a
 * cancel/retry racing this call has nothing to undo (see `sealVault`).
 */
export async function createPasskeyVaultKey(
    label: string,
    signal?: AbortSignal,
): Promise<{ credentialId: string; key: CryptoKey }> {
    if (!isPasskeySupported()) {
        throw new Error("This browser cannot use passkeys over a secure connection.");
    }

    const prfSalt = await derivePrfEvalSalt();

    let credential: PublicKeyCredential | null | undefined;
    try {
        credential = (await navigator.credentials.create({
            signal,
            publicKey: {
                challenge: randomChallenge(),
                rp: { name: RP_NAME, id: window.location.hostname },
                user: {
                    id: crypto.getRandomValues(new Uint8Array(new ArrayBuffer(16))),
                    name: label,
                    displayName: label,
                },
                pubKeyCredParams: [
                    { type: "public-key", alg: -7 },
                    { type: "public-key", alg: -257 },
                ],
                authenticatorSelection: {
                    requireResidentKey: true,
                    residentKey: "required",
                    userVerification: "required",
                },
                extensions: {
                    prf: { eval: { first: prfSalt as BufferSource } },
                } as AuthenticationExtensionsClientInputs,
            },
        })) as PublicKeyCredential | null;
    } catch (error) {
        friendlyWebAuthnError(error);
    }

    if (!credential) throw new Error("Passkey creation was dismissed.");

    const extensionResults = credential.getClientExtensionResults() as PrfOutputs;
    if (extensionResults.prf?.enabled === false) {
        throw new Error(
            "This authenticator cannot store an encryption secret (no PRF support). " +
            "Remove the passkey that was just created from your device settings and keep using the feed key.",
        );
    }

    const credentialId = toBase64Url(credential.rawId);
    // Some authenticators only evaluate PRF on a later assertion, not at
    // creation time — fall back to one extra authentication for those.
    const prfOutput =
        extensionResults.prf?.results?.first ??
        (await evaluatePrf(new Uint8Array(credential.rawId), signal));

    return { credentialId, key: await deriveVaultKey(prfOutput) };
}

/**
 * Seal `payload` under `key` and persist it as the enrolled vault. Split out
 * from `createPasskeyVaultKey` so a caller can gate this — the actual
 * "finalize" step — behind an attempt guard: the WebAuthn ceremony can't
 * always be aborted mid-flight, but nothing has been written to storage
 * until this resolves, so a cancel that lands between the two calls still
 * prevents the write.
 */
export async function sealVault(
    credentialId: string,
    key: CryptoKey,
    payload: VaultPayload,
): Promise<void> {
    const sealed = await sealSecret(key, JSON.stringify(payload));
    const record: VaultRecord = { v: VAULT_VERSION, credentialId, ...sealed };

    localStorage.setItem(VAULT_KEY, JSON.stringify(record));
    localStorage.removeItem(LEGACY_KEY);
}

/** Convenience wrapper for callers that don't need the two-step split above. */
export async function enrollPasskey(
    label: string,
    feedKeyHex: string,
    writeUrl: string,
    signal?: AbortSignal,
): Promise<void> {
    const { credentialId, key } = await createPasskeyVaultKey(label, signal);
    await sealVault(credentialId, key, { feedKeyHex, writeUrl });
}

export async function unlockVault(signal?: AbortSignal): Promise<VaultPayload> {
    const record = readVault();
    if (!record) throw new Error("No passkey has been set up on this device.");

    const prfOutput = await evaluatePrf(fromBase64Url(record.credentialId), signal);
    const vaultKey = await deriveVaultKey(prfOutput);

    let plaintext: string;
    try {
        plaintext = await openSecret(vaultKey, record);
    } catch {
        throw new Error("Could not unlock the feed key with this passkey.");
    }

    if (record.v === 1) {
        return { feedKeyHex: plaintext, writeUrl: "" };
    }

    try {
        const payload = JSON.parse(plaintext) as VaultPayload;
        if (typeof payload?.feedKeyHex !== "string" || !payload.feedKeyHex) {
            throw new Error("missing feed key");
        }
        return { feedKeyHex: payload.feedKeyHex, writeUrl: payload.writeUrl ?? "" };
    } catch {
        throw new Error("The stored vault is unreadable. Remove the passkey and set it up again.");
    }
}
