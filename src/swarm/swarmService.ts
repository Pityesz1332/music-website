import { Bee } from "@ethersphere/bee-js";

// NODE CONFIG
const BEE_NODE_URL = import.meta.env.VITE_BEE_NODE_URL ?? "http://localhost:1633";
const bee = new Bee(BEE_NODE_URL);

export function resolveSwarmAudio(hash: string) {
    if (!hash) return "";
    return `${BEE_NODE_URL}/bzz/${hash}`;
}

// Audio fájl upload from admin page
export async function uploadAudio(file: File, onProgress?: (percent: number) => void): Promise<string> {
    // fetching stamp
    const stamps = await bee.getPostageBatches();
    if (!stamps.length) throw new Error("No available stamp");
    const batchId = stamps[0].batchID.toHex();

    // FAKE PROGRESS! - 10% -> 100%
    onProgress?.(10);
    const result = await bee.uploadFile(batchId as any, file);
    console.log("Swarm hash:", result.reference.toString());
    onProgress?.(100);

    return result.reference.toString();
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