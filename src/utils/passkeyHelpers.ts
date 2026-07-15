// Currently a mock implementation.
// For backend integration, replace generateChallenge() and verifyAssertion() 
// with actual API calls.

export interface PasskeyUser {
    id: string;
    username: string;
    displayName: string;
}

async function hashWalletAddress(walletAddress: string): Promise<Uint8Array> {
    const normalized = walletAddress.toLowerCase().trim();
    const encoded = new TextEncoder().encode(normalized);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    return new Uint8Array(hashBuffer);
}

function toBase64Url(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "-")
        .replace(/=+$/, "");
}

function toHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function derivePasskeyUser(walletAddress: string): Promise<PasskeyUser> {
    const hashBytes = await hashWalletAddress(walletAddress);
    const hexHash = toHex(hashBytes);

    return {
        id: toBase64Url(hashBytes),
        username: `sc_${hexHash.slice(0, 12)}`,
        displayName: `User ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    };
}

// MOCK: -> POST /auth/passkey/challenge
export async function generateRegistrationChallenge(walletAddress: string): Promise<PublicKeyCredentialCreationOptions> {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const user = await derivePasskeyUser(walletAddress);
    const userIdBytes = new TextEncoder().encode(user.id);

    return {
        challenge,
        rp: {
            name: "SoundChain",
            id: window.location.hostname
        },
        user: {
            id: userIdBytes,
            name: user.username,
            displayName: user.displayName
        },
        pubKeyCredParams: [
            { alg: -7, type: "public-key" },
            { alg: -257, type: "public-key" }
        ],
        authenticatorSelection: {
            userVerification: "required",
            residentKey: "required"
        },
        timeout: 60000,
        attestation: "none"
    };
}

// MOCK: -> POST /auth/passkey/login/challenge
export async function generateAuthChallenge(): Promise<PublicKeyCredentialRequestOptions> {
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    return {
        challenge,
        rpId: window.location.hostname,
        userVerification: "required",
        timeout: 60000
    };
}

// MOCK: -> POST /auth/passkey/register + JWT/session
export async function registerPasskey(walletAddress: string): Promise<PasskeyUser> {
    const options = await generateRegistrationChallenge(walletAddress);
    const credentials = await navigator.credentials.create({ publicKey: options });

    if (!credentials) throw new Error("Passkey registration error");

    const user = await derivePasskeyUser(walletAddress)
    return user;
}

// MOCK: -> POST /auth/passkey/login + session starting
export async function authPasskey(walletAddress: string): Promise<PasskeyUser> {
    if (!navigator.credentials) throw new Error("WebAuthn not supported in this environment");
    
    const options = await generateAuthChallenge();
    const assertion = await navigator.credentials.get({ publicKey: options });

    if (!assertion) throw new Error("Passkey auth error");

    // MOCK
    const stored = localStorage.getItem("passkeyUser");
    if (!stored) throw new Error("No registered passkey on this device");

    const storedUser = JSON.parse(stored) as PasskeyUser;
    const expectedUser = await derivePasskeyUser(walletAddress);

    if (storedUser.id !== expectedUser.id) {
        throw new Error("Passkey user mismatch");
    }

    return storedUser;
}

export function isWebAuthnSupported(): boolean {
    return (
        typeof window !== "undefined" &&
        !!window.PublicKeyCredential &&
        typeof navigator.credentials?.create === "function"
    );
}