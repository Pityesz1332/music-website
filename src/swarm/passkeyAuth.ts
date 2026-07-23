/**
 * Passkey as a pure access gate for /admin.
 *
 * It proves "this device, this biometric" and nothing more -- it carries no
 * secret. The Swarm feed publisher key that actually enables publishing is
 * still entered separately (see swarm/feedKey.ts) and is never derived from
 * or stored by the passkey.
 */

const STORAGE_KEY = "swarmAdminPasskeyId";
const RP_NAME = "Music Website Admin";

function randomBytes(length: number): Uint8Array<ArrayBuffer> {
    return crypto.getRandomValues(new Uint8Array(new ArrayBuffer(length)));
}

function toBase64Url(bytes: ArrayBuffer): string {
    const view = new Uint8Array(bytes);
    let binary = "";
    for (const byte of view) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
    const bytes = new Uint8Array(new ArrayBuffer(binary.length));
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

export function isPasskeySupported(): boolean {
    return (
        typeof window !== "undefined" &&
        !!window.PublicKeyCredential &&
        !!window.isSecureContext
    );
}

export function hasEnrolledPasskey(): boolean {
    return !!localStorage.getItem(STORAGE_KEY);
}

export function clearEnrolledPasskey(): void {
    localStorage.removeItem(STORAGE_KEY);
}

/** Register a new passkey as an admin-login credential for this device. */
export async function enrollPasskey(label: string): Promise<void> {
    if (!isPasskeySupported()) {
        throw new Error("This browser cannot use passkeys over a secure connection.");
    }

    const credential = (await navigator.credentials.create({
        publicKey: {
            challenge: randomBytes(32),
            rp: { name: RP_NAME },
            user: {
                id: randomBytes(16),
                name: label,
                displayName: label,
            },
            // ES256, then RS256 for authenticators that lack it.
            pubKeyCredParams: [
                { type: "public-key", alg: -7 },
                { type: "public-key", alg: -257 },
            ],
            authenticatorSelection: {
                residentKey: "required",
                userVerification: "required",
            },
        },
    })) as PublicKeyCredential | null;

    if (!credential) throw new Error("Passkey creation was dismissed.");

    localStorage.setItem(STORAGE_KEY, toBase64Url(credential.rawId));
}

/** Prompt for the enrolled passkey. Resolves only if the matching authenticator responds. */
export async function verifyPasskey(): Promise<void> {
    const credentialId = localStorage.getItem(STORAGE_KEY);
    if (!credentialId) throw new Error("No passkey has been set up on this device.");

    const assertion = await navigator.credentials.get({
        publicKey: {
            challenge: randomBytes(32),
            userVerification: "required",
            allowCredentials: [{ id: fromBase64Url(credentialId), type: "public-key" }],
        },
    });

    if (!assertion) throw new Error("Passkey sign-in was dismissed.");
}
