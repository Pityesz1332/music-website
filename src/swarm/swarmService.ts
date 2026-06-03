import { Bee } from "@ethersphere/bee-js";

// NODE CONFIG
const BEE_NODE_URL = import.meta.env.VITE_BEE_NODE_URL ?? "http://localhost:1633";
const bee = new Bee(BEE_NODE_URL);

async function getValidBatchId(): Promise<string> {
    const stamps = await bee.getPostageBatches();
    if (!stamps.length) throw new Error("No available stamp");
    return stamps[0].batchID.toHex();
}

export function resolveSwarmUrl(hash: string): string {
    if (!hash) return "";
    return `${BEE_NODE_URL}/bzz/${hash}/`;
}

export const resolveSwarmAudio = resolveSwarmUrl;
export const resolveSwarmCover = resolveSwarmUrl;

export async function uploadFileToSwarm(file: File, onProgress?: (percent: number) => void): Promise<string> {
    const batchID = await getValidBatchId();

    onProgress?.(10);
    const result = await bee.uploadFile(batchID as any, file);
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

// Node check
export async function checkSwarmNode(): Promise<boolean> {
    try {
        await bee.isConnected();
        return true;
    } catch {
        return false;
    }
}