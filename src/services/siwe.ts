import { createWalletClient, custom, recoverMessageAddress } from "viem";
import { ADMIN_ADDRESSES } from "../utils/config";

const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12h

export interface AdminSession {
    message: string;
    signature: string;
}

interface EthereumProvider {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

function getInjectedProvider(): EthereumProvider {
    const ethereum = (window as unknown as { ethereum?: EthereumProvider }).ethereum;
    if (!ethereum) {
        throw new Error("No wallet found. Install MetaMask or another injected wallet.");
    }
    return ethereum;
}

function buildMessage(address: string): string {
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + SESSION_DURATION_MS);
    return [
        "Sign in as admin for music-website",
        `Address: ${address}`,
        `Nonce: ${crypto.randomUUID()}`,
        `Issued At: ${issuedAt.toISOString()}`,
        `Expires At: ${expiresAt.toISOString()}`,
    ].join("\n");
}

// Asks the injected wallet to sign a fresh, time-boxed message proving control of
// the connected address. The signature itself is the credential — nothing here needs
// to be trusted on its own, everything is re-checked in verifyAdminSession.
export async function requestAdminSignature(): Promise<AdminSession> {
    const provider = getInjectedProvider();
    const client = createWalletClient({ transport: custom(provider) });
    const [address] = await client.requestAddresses();
    const message = buildMessage(address);
    const signature = await client.signMessage({ account: address, message });
    return { message, signature };
}

// Recovers the signer address straight from the signature (no stored/unsigned fields
// are trusted) and checks it's both unexpired and on the admin allowlist. Any tampering
// with the stored message changes the recovered address, so this can't be spoofed by
// editing localStorage.
export async function verifyAdminSession(session: AdminSession): Promise<string | null> {
    const expiresAtMatch = session.message.match(/Expires At: (.+)/);
    if (!expiresAtMatch) return null;

    const expiresAt = new Date(expiresAtMatch[1]).getTime();
    if (!expiresAt || Date.now() > expiresAt) return null;

    let recovered: string;
    try {
        recovered = await recoverMessageAddress({
            message: session.message,
            signature: session.signature as `0x${string}`,
        });
    } catch {
        return null;
    }

    return ADMIN_ADDRESSES.includes(recovered.toLowerCase()) ? recovered : null;
}
