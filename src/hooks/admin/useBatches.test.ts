import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useBatches } from "./useBatches";
import { setWriteUrl, clearWriteUrl } from "../../swarm/writeConfig";
import { clearPinnedBatch } from "../../swarm/batchPreference";
import type { PostageBatchInfo } from "@interfaces/swarm";

const mockFetch = vi.fn();
vi.mock("../../swarm/swarmService", () => ({
    fetchPostageBatches: () => mockFetch(),
}));

const batch: PostageBatchInfo = {
    batchId: "63b30081e399c4ecbdd610530c5509979b7a7c02689fa13712d9d4d8a8ef1efa",
    label: "test-batch",
    usable: true,
    immutable: false,
    depth: 18,
    bucketDepth: 16,
    utilization: 4,
    usage: 1,
    ttlSeconds: 792240,
    amount: "16355485440",
};

beforeEach(() => {
    clearWriteUrl();
    clearPinnedBatch();
    localStorage.clear();
    vi.clearAllMocks();
    mockFetch.mockResolvedValue([batch]);
});

describe("useBatches", () => {
    it("does not query the node before a write URL is configured", async () => {
        const { result } = renderHook(() => useBatches());

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(mockFetch).not.toHaveBeenCalled();
        expect(result.current.writeUrlSet).toBe(false);
        expect(result.current.batches).toEqual([]);
    });

    it("loads batches once a write URL is set", async () => {
        setWriteUrl("http://localhost:1633");
        const { result } = renderHook(() => useBatches());

        await waitFor(() => expect(result.current.batches).toHaveLength(1));
        expect(result.current.batches[0].label).toBe("test-batch");
        expect(result.current.error).toBeNull();
    });

    it("loads automatically when the write URL is set after mount", async () => {
        const { result } = renderHook(() => useBatches());
        await waitFor(() => expect(result.current.writeUrlSet).toBe(false));

        await act(async () => {
            setWriteUrl("http://localhost:1633");
        });

        await waitFor(() => expect(result.current.batches).toHaveLength(1));
    });

    it("surfaces a node error and clears stale batches", async () => {
        setWriteUrl("http://localhost:1633");
        const { result } = renderHook(() => useBatches());
        await waitFor(() => expect(result.current.batches).toHaveLength(1));

        mockFetch.mockRejectedValue(new Error("fetch failed"));
        await act(async () => {
            await result.current.refresh();
        });

        expect(result.current.error).toBe("fetch failed");
        expect(result.current.batches).toEqual([]);
        expect(result.current.loading).toBe(false);
    });

    it("refresh re-queries the node", async () => {
        setWriteUrl("http://localhost:1633");
        const { result } = renderHook(() => useBatches());
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

        await act(async () => {
            await result.current.refresh();
        });

        expect(mockFetch).toHaveBeenCalledTimes(2);
    });
});

describe("useBatches pinning", () => {
    const second: PostageBatchInfo = { ...batch, batchId: "second-batch", usage: 0.1 };

    it("auto-selects the emptiest batch when nothing is pinned", async () => {
        mockFetch.mockResolvedValue([batch, second]);
        setWriteUrl("http://localhost:1633");
        const { result } = renderHook(() => useBatches());

        await waitFor(() => expect(result.current.batches).toHaveLength(2));
        expect(result.current.activeBatchId).toBe("second-batch");
        expect(result.current.pinnedBatchId).toBeNull();
    });

    it("makes the pinned batch active, overriding the ranking", async () => {
        mockFetch.mockResolvedValue([batch, second]);
        setWriteUrl("http://localhost:1633");
        const { result } = renderHook(() => useBatches());
        await waitFor(() => expect(result.current.batches).toHaveLength(2));

        await act(async () => {
            result.current.pinBatch(batch.batchId);
        });

        expect(result.current.pinnedBatchId).toBe(batch.batchId);
        expect(result.current.activeBatchId).toBe(batch.batchId);
        expect(result.current.pinnedIgnored).toBe(false);
    });

    it("unpinning hands selection back to the ranking", async () => {
        mockFetch.mockResolvedValue([batch, second]);
        setWriteUrl("http://localhost:1633");
        const { result } = renderHook(() => useBatches());
        await waitFor(() => expect(result.current.batches).toHaveLength(2));

        await act(async () => {
            result.current.pinBatch(batch.batchId);
        });
        await act(async () => {
            result.current.unpinBatch();
        });

        expect(result.current.pinnedBatchId).toBeNull();
        expect(result.current.activeBatchId).toBe("second-batch");
    });

    it("flags a pin that can no longer be honoured and falls back", async () => {
        mockFetch.mockResolvedValue([{ ...batch, usable: false }, second]);
        setWriteUrl("http://localhost:1633");
        const { result } = renderHook(() => useBatches());
        await waitFor(() => expect(result.current.batches).toHaveLength(2));

        await act(async () => {
            result.current.pinBatch(batch.batchId);
        });

        expect(result.current.pinnedIgnored).toBe(true);
        expect(result.current.activeBatchId).toBe("second-batch");
    });
});
