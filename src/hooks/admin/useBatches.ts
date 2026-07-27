import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import type { PostageBatchInfo } from "@interfaces/swarm";
import { fetchPostageBatches } from "../../swarm/swarmService";
import { hasWriteUrl, subscribeToWriteUrl } from "../../swarm/writeConfig";
import { resolveUploadBatch } from "../../swarm/batchSelection";
import {
    getPinnedBatchId,
    setPinnedBatchId,
    clearPinnedBatch,
    subscribeToPinnedBatch,
} from "../../swarm/batchPreference";

export const useBatches = () => {
    const [batches, setBatches] = useState<PostageBatchInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const writeUrlSet = useSyncExternalStore(subscribeToWriteUrl, hasWriteUrl, () => false);
    const pinnedBatchId = useSyncExternalStore(subscribeToPinnedBatch, getPinnedBatchId, () => null);

    const load = useCallback(async () => {
        if (!writeUrlSet) {
            setBatches([]);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            setBatches(await fetchPostageBatches());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not reach the Bee node");
            setBatches([]);
        } finally {
            setLoading(false);
        }
    }, [writeUrlSet]);

    useEffect(() => {
        load();
    }, [load]);

    const { batch: activeBatch, pinnedIgnored } = resolveUploadBatch(batches, pinnedBatchId);

    return {
        batches,
        loading,
        error,
        writeUrlSet,
        refresh: load,
        activeBatchId: activeBatch?.batchId ?? null,
        pinnedBatchId,
        pinnedIgnored,
        pinBatch: setPinnedBatchId,
        unpinBatch: clearPinnedBatch,
    };
};
