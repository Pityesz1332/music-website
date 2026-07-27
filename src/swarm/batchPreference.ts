const PINNED_BATCH_KEY = "swarmAdminPinnedBatch";

const listeners = new Set<() => void>();

function notify(): void {
    for (const listener of listeners) listener();
}

export function subscribeToPinnedBatch(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function getPinnedBatchId(): string | null {
    try {
        return localStorage.getItem(PINNED_BATCH_KEY);
    } catch {
        return null;
    }
}

export function setPinnedBatchId(batchId: string): void {
    const trimmed = batchId.trim();
    if (!trimmed) throw new Error("Batch id is empty");

    localStorage.setItem(PINNED_BATCH_KEY, trimmed);
    notify();
}

export function clearPinnedBatch(): void {
    localStorage.removeItem(PINNED_BATCH_KEY);
    notify();
}
