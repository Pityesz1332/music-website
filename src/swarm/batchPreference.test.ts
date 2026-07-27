import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    getPinnedBatchId,
    setPinnedBatchId,
    clearPinnedBatch,
    subscribeToPinnedBatch,
} from "./batchPreference";

const STORAGE_KEY = "swarmAdminPinnedBatch";
const BATCH_ID = "63b30081e399c4ecbdd610530c5509979b7a7c02689fa13712d9d4d8a8ef1efa";

beforeEach(() => {
    localStorage.clear();
});

describe("pinned batch storage", () => {
    it("starts unpinned", () => {
        expect(getPinnedBatchId()).toBeNull();
    });

    it("stores and returns the pinned id", () => {
        setPinnedBatchId(BATCH_ID);
        expect(getPinnedBatchId()).toBe(BATCH_ID);
    });

    it("survives a reload, unlike the in-memory feed key and write URL", () => {
        setPinnedBatchId(BATCH_ID);
        expect(localStorage.getItem(STORAGE_KEY)).toBe(BATCH_ID);
    });

    it("trims surrounding whitespace", () => {
        setPinnedBatchId(`  ${BATCH_ID}  `);
        expect(getPinnedBatchId()).toBe(BATCH_ID);
    });

    it("rejects an empty id", () => {
        expect(() => setPinnedBatchId("   ")).toThrow(/empty/);
        expect(getPinnedBatchId()).toBeNull();
    });

    it("clearing returns choice to automatic selection", () => {
        setPinnedBatchId(BATCH_ID);
        clearPinnedBatch();

        expect(getPinnedBatchId()).toBeNull();
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
});

describe("subscribeToPinnedBatch", () => {
    it("notifies on pin and unpin, and stops after unsubscribe", () => {
        const listener = vi.fn();
        const unsubscribe = subscribeToPinnedBatch(listener);

        setPinnedBatchId(BATCH_ID);
        expect(listener).toHaveBeenCalledTimes(1);

        clearPinnedBatch();
        expect(listener).toHaveBeenCalledTimes(2);

        unsubscribe();
        setPinnedBatchId(BATCH_ID);
        expect(listener).toHaveBeenCalledTimes(2);
    });
});
