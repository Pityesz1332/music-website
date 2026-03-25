// jelenleg csak mock
// backend-nél a generateChallenge() és verifyAssertion() függvényeket kell lecserélni API hívásra

export interface PasskeyUser {
    id: string;
    username: string;
    displayName: string;
}

// MOCK: backendnél ez egy POST /auth/passkey/challenge hívás lesz
export async function generateRegistrationChallenge(): Promise<PublicKeyCredentialCreationOptions> {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = crypto.getRandomValues(new Uint8Array(16));

    return {
        challenge,
        rp: {
            name: "SoundChain",
            id: window.location.hostname
        },
        user: {
            id: userId,
            name: "user@soundchain.app",
            displayName: "SoundChain User"
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

// MOCK: backendnél ez egy POST /auth/passkey/login/challenge hívás lesz
export async function generateAuthChallenge(): Promise<PublicKeyCredentialRequestOptions> {
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    return {
        challenge,
        rpId: window.location.hostname,
        userVerification: "required",
        timeout: 60000
    };
}

// MOCK: backendnél POST /auth/passkey/register + JWT/session visszakapás
export async function registerPasskey(): Promise<PasskeyUser> {
    const options = await generateRegistrationChallenge();
    const credentials = await navigator.credentials.create({ publicKey: options });

    if (!credentials) throw new Error("Passkey registration error");

    const mockUser: PasskeyUser = {
        id: btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(8)))),
        username: "user@soundchain.app",
        displayName: "SoundChain User"
    };

    return mockUser;
}

// MOCK: backendnél POST /auth/passkey/login + session indítás
export async function authPasskey(): Promise<PasskeyUser> {
    const options = await generateAuthChallenge();
    const assertion = await navigator.credentials.get({ publicKey: options });

    if (!assertion) throw new Error("Passkey auth error");

    // MOCK válasz - majd a szerver ellenőriz később
    const stored = localStorage.getItem("passkeyUser");
    if (!stored) throw new Error("No registered passkey on this device");

    return JSON.parse(stored) as PasskeyUser;
}

export function isWebAuthnSupported(): boolean {
    return (
        typeof window !== "undefined" &&
        !!window.PublicKeyCredential &&
        typeof navigator.credentials?.create === "function"
    );
}