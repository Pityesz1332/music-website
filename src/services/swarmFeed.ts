import { Bee, PrivateKey, Topic } from "@ethersphere/bee-js";
import type { Song } from "../types/music";
import {
    SWARM_GATEWAY,
    SWARM_BEE_API,
    SWARM_POSTAGE_BATCH,
    SWARM_FEED_OWNER,
    SWARM_FEED_TOPIC,
} from "../utils/config";

// A Swarm feed is a mutable pointer belonging to a given (owner, topic) pair.
// The full catalog lives on Swarm as JSON, and the feed always points to the
// latest catalog reference — so no backend or redeploy is needed for a song
// uploaded by an admin to show up for every visitor.

function getTopic(): Topic {
    return Topic.fromString(SWARM_FEED_TOPIC);
}

function normalizeAddress(value: string): string {
    return value.trim().toLowerCase().replace(/^0x/, "");
}

// Whether the address derived from the given private key matches the configured feed-owner address.
// (The admin UI uses this to validate the entered key before publishing anything.)
export function feedKeyMatchesOwner(privateKeyHex: string): boolean {
    try {
        const derived = normalizeAddress(new PrivateKey(privateKeyHex.trim()).publicKey().address().toHex());
        const expected = normalizeAddress(SWARM_FEED_OWNER);
        return !expected || derived === expected;
    } catch {
        return false;
    }
}

// Public read via the gateway: resolves the feed's latest reference,
// downloads and parses the catalog as JSON. Returns null on any error,
// so the caller can fall back to the built-in seed (first run / offline case).
export async function readCatalogFromFeed(): Promise<Song[] | null> {
    if (!SWARM_FEED_OWNER) return null;

    try {
        const bee = new Bee(SWARM_GATEWAY);
        const reader = bee.makeFeedReader(getTopic(), SWARM_FEED_OWNER);
        const { reference } = await reader.downloadReference();
        const bytes = await bee.downloadData(reference);
        const parsed = bytes.toJSON();
        return Array.isArray(parsed) ? (parsed as Song[]) : null;
    } catch (error) {
        console.warn("Could not read song catalog from Swarm feed:", error);
        return null;
    }
}

// Admin publishing via your own Bee node:
//   1) uploads the full catalog to Swarm -> content reference
//   2) points the feed to that reference, signed with the feed-owner private key
// The private key only lives at runtime, in memory (see the admin panel) — it's
// never in the bundle and is never written to disk.
export async function publishCatalogToFeed(catalog: Song[], privateKeyHex: string): Promise<void> {
    if (!SWARM_BEE_API) {
        throw new Error("No Bee node configured (VITE_SWARM_BEE_API). Publishing is only available in the admin-local build.");
    }
    if (!SWARM_POSTAGE_BATCH) {
        throw new Error("No Swarm postage batch configured (VITE_SWARM_POSTAGE_BATCH). Publishing is disabled.");
    }
    if (!feedKeyMatchesOwner(privateKeyHex)) {
        throw new Error("The provided feed key does not match VITE_SWARM_FEED_OWNER.");
    }

    const key = new PrivateKey(privateKeyHex.trim());
    const bee = new Bee(SWARM_BEE_API);

    const { reference } = await bee.uploadData(SWARM_POSTAGE_BATCH, JSON.stringify(catalog));
    const writer = bee.makeFeedWriter(getTopic(), key);
    await writer.uploadReference(SWARM_POSTAGE_BATCH, reference);
}
