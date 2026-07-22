import { PrivateKey } from "@ethersphere/bee-js";

let feedKey: PrivateKey | null = null;

export function setFeedKey(hexKey: string): void {
    const trimmed = hexKey.trim();
    if (!trimmed) throw new Error("Feed key is empty");
    // Throws if the hex is not a valid private key.
    feedKey = new PrivateKey(trimmed);
}

/** The current in-memory feed key, or null if none has been entered. */
export function getFeedKey(): PrivateKey | null {
    return feedKey;
}

/** The public address derived from the current feed key, or null. */
export function getFeedKeyAddress(): string | null {
    return feedKey ? feedKey.publicKey().address().toString() : null;
}

/** True once a feed key has been entered this session. */
export function hasFeedKey(): boolean {
    return feedKey !== null;
}

/** Normalize an Ethereum address for comparison */
function normalizeAddress(address: string): string {
    return address.trim().toLowerCase().replace(/^0x/, "");
}

export function feedKeyMatchesOwner(ownerAddress: string): boolean {
    const keyAddress = getFeedKeyAddress();
    if (!keyAddress || !ownerAddress) return false;
    return normalizeAddress(keyAddress) === normalizeAddress(ownerAddress);
}

/** Wipe the key from memory (called on logout). */
export function clearFeedKey(): void {
    feedKey = null;
}
