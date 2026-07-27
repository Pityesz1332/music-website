import type { PostageBatchInfo } from "@interfaces/swarm";

export function isExpired(batch: PostageBatchInfo): boolean {
    return batch.ttlSeconds !== null && batch.ttlSeconds <= 0;
}

export function hasSpareCapacity(batch: PostageBatchInfo): boolean {
    return batch.usage < 1;
}

export function eligibleBatches(batches: PostageBatchInfo[]): PostageBatchInfo[] {
    return batches.filter((batch) => batch.usable && !isExpired(batch));
}

function compareBatches(a: PostageBatchInfo, b: PostageBatchInfo): number {
    const spare = Number(hasSpareCapacity(b)) - Number(hasSpareCapacity(a));
    if (spare !== 0) return spare;

    if (a.usage !== b.usage) return a.usage - b.usage;

    return (b.ttlSeconds ?? -1) - (a.ttlSeconds ?? -1);
}

export function selectUploadBatch(batches: PostageBatchInfo[]): PostageBatchInfo | null {
    const eligible = eligibleBatches(batches);
    if (!eligible.length) return null;

    return [...eligible].sort(compareBatches)[0];
}

export interface BatchChoice {
    batch: PostageBatchInfo | null;
    pinnedIgnored: boolean;
}

export function resolveUploadBatch(
    batches: PostageBatchInfo[],
    pinnedBatchId: string | null,
): BatchChoice {
    if (pinnedBatchId) {
        const pinned = eligibleBatches(batches).find((b) => b.batchId === pinnedBatchId);
        if (pinned) return { batch: pinned, pinnedIgnored: false };

        return { batch: selectUploadBatch(batches), pinnedIgnored: true };
    }

    return { batch: selectUploadBatch(batches), pinnedIgnored: false };
}

export function explainNoUsableBatch(batches: PostageBatchInfo[]): string {
    if (!batches.length) {
        return "This Bee node has no postage batches. Buy one before uploading or publishing.";
    }

    const expired = batches.filter(isExpired).length;
    const unusable = batches.filter((b) => !b.usable).length;

    if (expired === batches.length) {
        return "Every postage batch on this node has expired. Top one up or buy a new one before uploading.";
    }
    if (unusable === batches.length) {
        return "Bee reports every postage batch on this node as unusable. Check the node before uploading.";
    }

    return `No usable postage batch is available (${expired} expired, ${unusable} unusable of ${batches.length}).`;
}
