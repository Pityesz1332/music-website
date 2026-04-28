import { Bee } from "@ethersphere/bee-js";

// NODE KONFIGURÁCIÓ
const BEE_NODE_URL = import.meta.env.VITE_BEE_NODE_URL ?? "http://localhost:1633";
const bee = new Bee(BEE_NODE_URL);
// Blob URL cache
const blobCache = new Map<string, string>();

/**
 * @param hash - a Swarm referencia
 * @returns lejátszható blob URL
 */
export async function resolveSwarmAudio(hash: string): Promise<string> {
    // cache
    if (blobCache.has(hash)) return blobCache.get(hash)!;

    // letöltés a bee node-ról
    const data = await bee.downloadData(hash);
    // Uint8Array -> Blob -> Object URL
    const blob = new Blob([data.toUint8Array() as unknown as Uint8Array<ArrayBuffer>], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    blobCache.set(hash, url);
    return url;
}

// Audio fájl feltöltése az admin oldalról
export async function uploadAudio(file: File, onProgress?: (percent: number) => void): Promise<string> {
    // stamp lekérése
    const stamps = await bee.getPostageBatches();
    if (!stamps.length) throw new Error("No available stamp");
    const batchId = stamps[0].batchID.toHex();

    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // fake progress -> 10%, utána 100%
    onProgress?.(10);
    const result = await bee.uploadData(batchId as any, uint8);
    onProgress?.(100);

    return result.reference.toString();
}

// Cache-elt Blob URL-ek felszabadítása
export function revokeSwarmCache(): void {
    blobCache.forEach((url) => URL.revokeObjectURL(url));
    blobCache.clear();
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