import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";
import type { Song } from "@interfaces/music";

const READ_URL =
    import.meta.env.VITE_SWARM_READ_URL ??
    import.meta.env.VITE_BEE_NODE_URL ??
    "http://localhost:1633";
const WRITE_URL =
    import.meta.env.VITE_SWARM_WRITE_URL ??
    import.meta.env.VITE_BEE_NODE_URL ??
    "http://localhost:1633";

const readBee = new Bee(READ_URL);
const writeBee = new Bee(WRITE_URL);

export const FEED_OWNER_ADDRESS = (import.meta.env.VITE_FEED_OWNER_ADDRESS as string | undefined) ?? "";

// FEED CONFIG
const FEED_TOPIC = Topic.fromString("music-webpage-dj-enez");

async function getValidBatchId(): Promise<string> {
    const stamps = await writeBee.getPostageBatches();
    if (!stamps.length) throw new Error("No available stamp");
    return stamps[0].batchID.toString();
}

export function resolveSwarmUrl(hash: string): string {
    if (!hash) return "";
    return `${READ_URL}/bzz/${hash}/`;
}

export const resolveSwarmAudio = resolveSwarmUrl;
export const resolveSwarmCover = resolveSwarmUrl;

export async function uploadFileToSwarm(file: File, onProgress?: (percent: number) => void): Promise<string> {
    const batchID = await getValidBatchId();

    onProgress?.(10);
    const result = await writeBee.uploadFile(batchID as any, file);
    console.log(`[Swarm] Upload successful: ${file.name} | Hash:`, result.reference.toString());
    onProgress?.(100);

    return result.reference.toString();
}

export const uploadAudio = uploadFileToSwarm;
export const uploadCover = uploadFileToSwarm;

export async function downloadAudio(hash: string, filename: string): Promise<void> {
    if (!hash) throw new Error("No Swarm hash provided");
    const url = resolveSwarmAudio(hash);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch file from Swarm");

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(objectUrl);
}

export async function uploadSongMetadata(songs: Song[]): Promise<string> {
    const batchID = await getValidBatchId();
    const json = JSON.stringify(songs);
    const blob = new Blob([json], { type: "application/json" });
    const file = new File([blob], "songs.json");
    const result = await writeBee.uploadFile(batchID as any, file);
    console.log(`[Swarm] Metadata uploaded | Hash:`, result.reference.toString());
    return result.reference.toString()
}

export async function fetchSongMetadata(hash: string): Promise<Song[]> {
    const result = await readBee.downloadFile(hash);
    const text = result.data.toUtf8();
    return JSON.parse(text) as Song[];
}

export async function fetchLatestSongsHash(ownerAddress: string): Promise<string | null> {
    try {
        const reader = readBee.makeFeedReader(FEED_TOPIC, ownerAddress);
        const latest = await reader.downloadReference();
        return latest.reference.toString();
    } catch {
        // Feed not found yet (never published) — treat as empty catalog.
        return null;
    }
}

export async function publishSongsToFeed(songs: Song[], privateKey: PrivateKey): Promise<string> {
    const batchID = await getValidBatchId();
    const metadataHash = await uploadSongMetadata(songs);

    const writer = writeBee.makeFeedWriter(FEED_TOPIC, privateKey);
    await writer.uploadReference(batchID as any, metadataHash as any);

    console.log(`[Feed] Published songs metadata hash: ${metadataHash}`);
    return metadataHash;
}

// Node check
export async function checkSwarmNode(): Promise<boolean> {
    try {
        await readBee.isConnected();
        return true;
    } catch {
        return false;
    }
}
