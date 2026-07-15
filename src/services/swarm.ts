import { SWARM_GATEWAY, SWARM_BEE_API, SWARM_POSTAGE_BATCH } from "../utils/config";

// A Swarm reference appears as 32 or 64 bytes of hex,
// so 64 or 128 hex characters (optionally with a 0x prefix).
const SWARM_REF_REGEX = /^(0x)?[0-9a-fA-F]{64}([0-9a-fA-F]{64})?$/;

// checks whether the given value is a Swarm reference (not a /local path or http URL)
export function isSwarmRef(value: string): boolean {
    if (!value) return false;
    return SWARM_REF_REGEX.test(value.trim());
}

// builds an accessible URL from a reference via the gateway
export function swarmUrl(ref: string): string {
    const clean = ref.trim().replace(/^0x/, "");
    return `${SWARM_GATEWAY}/bzz/${clean}/`;
}

// backwards-compatible resolver. Only lets trusted sources through, so an
// (in principle admin-controlled, but filtered out of caution) catalog can't slip
// an arbitrary external URL into an asset src:
// - Swarm reference -> we return the gateway URL
// - same-origin path (/covers/…, /songs/…) and data: URIs pass through unchanged
// - everything else (e.g. an arbitrary http(s) host) is dropped
export function resolveAssetUrl(value: string | null | undefined): string {
    if (!value) return "";
    const trimmed = value.trim();
    if (isSwarmRef(trimmed)) return swarmUrl(trimmed);
    if (trimmed.startsWith("/") || trimmed.startsWith("data:")) return trimmed;
    return "";
}

// downloads the given asset (Swarm ref or same-origin path) to the user's device.
// goes through a blob because the download attribute doesn't force a download
// for cross-origin (gateway) URLs.
export async function downloadAsset(value: string, filename: string): Promise<void> {
    const url = resolveAssetUrl(value);
    if (!url) throw new Error("No downloadable source for this track.");

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
}

// uploads a file to your own Bee node with a postage batch.
// we use XMLHttpRequest so we can report actual upload progress.
// (doesn't go through apiFetch: that forces application/json and gives no progress.)
export function uploadFile(file: File, onProgress?: (pct: number) => void): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!SWARM_POSTAGE_BATCH) {
            reject(new Error("No Swarm postage batch configured (VITE_SWARM_POSTAGE_BATCH). Upload is disabled."));
            return;
        }

        const xhr = new XMLHttpRequest();
        const url = `${SWARM_BEE_API}/bzz?name=${encodeURIComponent(file.name)}`;

        xhr.open("POST", url, true);
        xhr.setRequestHeader("swarm-postage-batch-id", SWARM_POSTAGE_BATCH);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

        xhr.upload.onprogress = (e) => {
            if (onProgress && e.lengthComputable) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (data?.reference) {
                        resolve(data.reference as string);
                    } else {
                        reject(new Error("Swarm upload succeeded but no reference was returned"));
                    }
                } catch {
                    reject(new Error("Invalid response from Bee node"));
                }
            } else {
                reject(new Error(`Swarm upload failed: ${xhr.status} ${xhr.statusText}`));
            }
        };

        xhr.onerror = () => reject(new Error("Network error while uploading to Bee node (is CORS enabled?)"));
        xhr.ontimeout = () => reject(new Error("Swarm upload timed out"));

        xhr.send(file);
    });
}
