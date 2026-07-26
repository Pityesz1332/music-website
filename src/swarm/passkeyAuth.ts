import { deriveVaultKey, openSecret, sealSecret, toBase64Url, fromBase64Url, PRF_SALT } from "./vaultCrypto";
import type { SealedSecret } from "./vaultCrypto";

const VAULT_KEY = "swarmAdminFeedVault";
const LEGACY_KEY = "swarmAdminPasskeyId";
const RP_NAME = "Music Website Admin";

interface VaultRecord extends SealedSecret {
    v: 1;
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
        if (parsed?.v !== 1 || !parsed.credentialId || !parsed.iv || !parsed.ciphertext) return null;
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

async function evaluatePrf(credentialId: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer> {
    const assertion = (await navigator.credentials.get({
        publicKey: {
            challenge: randomChallenge(),
            userVerification: "required",
            allowCredentials: [{ id: credentialId, type: "public-key" }],
            extensions: {
                prf: { eval: { first: PRF_SALT } },
            } as AuthenticationExtensionsClientInputs,
        },
    })) as PublicKeyCredential | null;

    if (!assertion) throw new Error("Passkey prompt was dismissed.");

    const prf = (assertion.getClientExtensionResults() as PrfOutputs).prf;
    if (!prf?.results?.first) {
        throw new Error("This passkey cannot unlock the feed key on this device.");
    }

    return prf.results.first;
}

export async function enrollPasskey(label: string, feedKeyHex: string): Promise<void> {
    if (!isPasskeySupported()) {
        throw new Error("This browser cannot use passkeys over a secure connection.");
    }

    const credential = (await navigator.credentials.create({
        publicKey: {
            challenge: randomChallenge(),
            rp: { name: RP_NAME },
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
                residentKey: "required",
                userVerification: "required",
            },
            extensions: { prf: {} } as AuthenticationExtensionsClientInputs,
        },
    })) as PublicKeyCredential | null;

    if (!credential) throw new Error("Passkey creation was dismissed.");

    if ((credential.getClientExtensionResults() as PrfOutputs).prf?.enabled === false) {
        throw new Error(
            "This authenticator cannot store an encryption secret (no PRF support). " +
            "Remove the passkey that was just created from your device settings and keep using the feed key.",
        );
    }

    const prfOutput = await evaluatePrf(new Uint8Array(credential.rawId));
    const vaultKey = await deriveVaultKey(prfOutput);
    const sealed = await sealSecret(vaultKey, feedKeyHex);

    const record: VaultRecord = {
        v: 1,
        credentialId: toBase64Url(credential.rawId),
        ...sealed,
    };

    localStorage.setItem(VAULT_KEY, JSON.stringify(record));
    localStorage.removeItem(LEGACY_KEY);
}

export async function unlockFeedKey(): Promise<string> {
    const record = readVault();
    if (!record) throw new Error("No passkey has been set up on this device.");

    const prfOutput = await evaluatePrf(fromBase64Url(record.credentialId));
    const vaultKey = await deriveVaultKey(prfOutput);

    try {
        return await openSecret(vaultKey, record);
    } catch {
        throw new Error("Could not unlock the feed key with this passkey.");
    }
}
