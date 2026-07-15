import { feedKeyMatchesOwner } from "./swarmFeed";

// The feed-owner private key lives ONLY in memory, for the lifetime of the page.
// It's never written to localStorage, sessionStorage, disk, or the bundle.
// After a reload the admin must re-enter it — this is intentional, so the key
// never persists anywhere.
let feedKey: string | null = null;

// Sets the key after verifying it belongs to the configured feed-owner address.
export function setFeedKey(key: string): void {
    const trimmed = key.trim();
    if (!feedKeyMatchesOwner(trimmed)) {
        throw new Error("Invalid feed key, or it does not match the configured feed owner address.");
    }
    feedKey = trimmed;
}

export function getFeedKey(): string | null {
    return feedKey;
}

export function clearFeedKey(): void {
    feedKey = null;
}

export function hasFeedKey(): boolean {
    return feedKey !== null;
}
