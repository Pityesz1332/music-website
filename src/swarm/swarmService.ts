import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";
import type { Song } from "@interfaces/music";
import type { PostageBatchInfo } from "@interfaces/swarm";
import { resolveUploadBatch, explainNoUsableBatch, hasSpareCapacity } from "./batchSelection";
import { getPinnedBatchId } from "./batchPreference";
import { getWriteUrl } from "./writeConfig";

const READ_URL =
    import.meta.env.VITE_SWARM_READ_URL ??
    import.meta.env.VITE_BEE_NODE_URL ??
    "http://localhost:1633";

const readBee = new Bee(READ_URL);

export const FEED_OWNER_ADDRESS = (import.meta.env.VITE_FEED_OWNER_ADDRESS as string | undefined) ?? "";

// FEED CONFIG
const FEED_TOPIC = Topic.fromString("music-webpage-dj-enez");

let cachedWriteBee: { url: string; bee: Bee } | null = null;

function getWriteBee(): Bee {
    const url = getWriteUrl();
    if (!url) {
        throw new Error("Configure your Bee node's write URL before uploading or publishing.");
    }
    if (cachedWriteBee?.url !== url) {
        cachedWriteBee = { url, bee: new Bee(url) };
    }
    return cachedWriteBee.bee;
}

async function getValidBatchId(): Promise<string> {
    const batches = await fetchPostageBatches();
    const { batch: chosen, pinnedIgnored } = resolveUploadBatch(batches, getPinnedBatchId());

    if (!chosen) throw new Error(explainNoUsableBatch(batches));

    if (pinnedIgnored) {
        console.warn(
            `[Swarm] The pinned batch is expired, unusable or missing; falling back to ${chosen.batchId}.`,
        );
    }

    if (!hasSpareCapacity(chosen)) {
        console.warn(
            `[Swarm] Batch ${chosen.batchId} is at full capacity; Bee may evict older chunks to make room.`,
        );
    }

    return chosen.batchId;
}

export async function fetchPostageBatches(): Promise<PostageBatchInfo[]> {
    const stamps = await getWriteBee().getPostageBatches();

    return stamps.map((stamp) => ({
        batchId: stamp.batchID.toString(),
        label: stamp.label ?? "",
        usable: stamp.usable,
        immutable: stamp.immutableFlag,
        depth: stamp.depth,
        bucketDepth: stamp.bucketDepth,
        utilization: stamp.utilization,
        usage: stamp.usage,
        ttlSeconds: stamp.duration ? stamp.duration.toSeconds() : null,
        amount: stamp.amount?.toString() ?? "0",
    }));
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
    const result = await getWriteBee().uploadFile(batchID as any, file);
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
    const result = await getWriteBee().uploadFile(batchID as any, file);
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

    const writer = getWriteBee().makeFeedWriter(FEED_TOPIC, privateKey);
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
