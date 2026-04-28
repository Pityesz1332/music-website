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
    if (blobCache.has(hash)) {
        return blobCache.get(hash)!;
    }

    // letöltés a bee node-ról
    const data = await bee.downloadData(hash);

    // Uint8Array -> Blob -> Object URL
    const blob = new Blob([data.toUint8Array() as unknown as Uint8Array<ArrayBuffer>], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    blobCache.set(hash, url);
    return url;
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