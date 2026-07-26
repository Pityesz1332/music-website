import { PrivateKey } from "@ethersphere/bee-js";

let feedKey: PrivateKey | null = null;

const listeners = new Set<() => void>();

function notify(): void {
    for (const listener of listeners) listener();
}

export function subscribeToFeedKey(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function setFeedKey(hexKey: string): void {
    const trimmed = hexKey.trim();
    if (!trimmed) throw new Error("Feed key is empty");
    feedKey = new PrivateKey(trimmed);
    notify();
}

export function getFeedKey(): PrivateKey | null {
    return feedKey;
}

export function getFeedKeyHex(): string | null {
    return feedKey ? feedKey.toHex() : null;
}

export function getFeedKeyAddress(): string | null {
    return feedKey ? feedKey.publicKey().address().toString() : null;
}

export function hasFeedKey(): boolean {
    return feedKey !== null;
}

function normalizeAddress(address: string): string {
    return address.trim().toLowerCase().replace(/^0x/, "");
}

export function feedKeyMatchesOwner(ownerAddress: string): boolean {
    const keyAddress = getFeedKeyAddress();
    if (!keyAddress || !ownerAddress) return false;
    return normalizeAddress(keyAddress) === normalizeAddress(ownerAddress);
}

export function clearFeedKey(): void {
    feedKey = null;
    notify();
}
