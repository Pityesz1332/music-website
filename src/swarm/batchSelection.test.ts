import { describe, it, expect } from "vitest";
import type { PostageBatchInfo } from "@interfaces/swarm";
import {
    selectUploadBatch,
    resolveUploadBatch,
    eligibleBatches,
    explainNoUsableBatch,
    isExpired,
    hasSpareCapacity,
} from "./batchSelection";

const DAY = 86400;

function batch(overrides: Partial<PostageBatchInfo> = {}): PostageBatchInfo {
    return {
        batchId: "a".repeat(64),
        label: "batch",
        usable: true,
        immutable: false,
        depth: 20,
        bucketDepth: 16,
        utilization: 1,
        usage: 0.1,
        ttlSeconds: 30 * DAY,
        amount: "1000",
        ...overrides,
    };
}

describe("isExpired", () => {
    it("treats a zero or negative TTL as expired", () => {
        expect(isExpired(batch({ ttlSeconds: 0 }))).toBe(true);
        expect(isExpired(batch({ ttlSeconds: -5 }))).toBe(true);
    });

    it("does not treat an unreported TTL as expired", () => {
        expect(isExpired(batch({ ttlSeconds: null }))).toBe(false);
    });
});

describe("hasSpareCapacity", () => {
    it("is false only at or above full", () => {
        expect(hasSpareCapacity(batch({ usage: 0.99 }))).toBe(true);
        expect(hasSpareCapacity(batch({ usage: 1 }))).toBe(false);
    });
});

describe("eligibleBatches", () => {
    it("drops unusable and expired batches", () => {
        const good = batch({ batchId: "good" });
        const result = eligibleBatches([
            good,
            batch({ batchId: "unusable", usable: false }),
            batch({ batchId: "expired", ttlSeconds: 0 }),
        ]);

        expect(result.map((b) => b.batchId)).toEqual(["good"]);
    });

    it("keeps a full batch, since a mutable one still accepts uploads", () => {
        expect(eligibleBatches([batch({ usage: 1 })])).toHaveLength(1);
    });
});

describe("selectUploadBatch", () => {
    it("returns null when there is nothing to choose from", () => {
        expect(selectUploadBatch([])).toBeNull();
    });

    it("never picks an unusable batch, even as the only option", () => {
        expect(selectUploadBatch([batch({ usable: false })])).toBeNull();
    });

    it("never picks an expired batch, even as the only option", () => {
        expect(selectUploadBatch([batch({ ttlSeconds: 0 })])).toBeNull();
    });

    it("prefers a batch with room over a full one", () => {
        const chosen = selectUploadBatch([
            batch({ batchId: "full", usage: 1, ttlSeconds: 90 * DAY }),
            batch({ batchId: "roomy", usage: 0.5, ttlSeconds: 10 * DAY }),
        ]);

        expect(chosen?.batchId).toBe("roomy");
    });

    it("prefers the emptiest when several have room", () => {
        const chosen = selectUploadBatch([
            batch({ batchId: "half", usage: 0.5 }),
            batch({ batchId: "empty", usage: 0.01 }),
            batch({ batchId: "most", usage: 0.9 }),
        ]);

        expect(chosen?.batchId).toBe("empty");
    });

    it("breaks ties on equal usage by longest TTL", () => {
        const chosen = selectUploadBatch([
            batch({ batchId: "short", usage: 0.2, ttlSeconds: 2 * DAY }),
            batch({ batchId: "long", usage: 0.2, ttlSeconds: 60 * DAY }),
        ]);

        expect(chosen?.batchId).toBe("long");
    });

    it("ranks a measured TTL above an unreported one on a tie", () => {
        const chosen = selectUploadBatch([
            batch({ batchId: "unknown", usage: 0.2, ttlSeconds: null }),
            batch({ batchId: "known", usage: 0.2, ttlSeconds: 5 * DAY }),
        ]);

        expect(chosen?.batchId).toBe("known");
    });

    it("falls back to a full batch when it is the only eligible one", () => {
        const chosen = selectUploadBatch([
            batch({ batchId: "full", usage: 1 }),
            batch({ batchId: "expired", usage: 0, ttlSeconds: 0 }),
        ]);

        expect(chosen?.batchId).toBe("full");
    });

    it("does not mutate the caller's array", () => {
        const input = [
            batch({ batchId: "b", usage: 0.9 }),
            batch({ batchId: "a", usage: 0.1 }),
        ];
        const order = input.map((b) => b.batchId);

        selectUploadBatch(input);

        expect(input.map((b) => b.batchId)).toEqual(order);
    });

    it("picks the real node's single batch despite it being full", () => {
        const live = batch({ batchId: "63b30081", usage: 1, ttlSeconds: 792240 });
        expect(selectUploadBatch([live])?.batchId).toBe("63b30081");
    });
});

describe("resolveUploadBatch", () => {
    const roomy = batch({ batchId: "roomy", usage: 0.1 });
    const other = batch({ batchId: "other", usage: 0.2 });

    it("falls back to automatic ranking when nothing is pinned", () => {
        const result = resolveUploadBatch([other, roomy], null);

        expect(result.batch?.batchId).toBe("roomy");
        expect(result.pinnedIgnored).toBe(false);
    });

    it("honours the pin even when another batch ranks higher", () => {
        const result = resolveUploadBatch([roomy, other], "other");

        expect(result.batch?.batchId).toBe("other");
        expect(result.pinnedIgnored).toBe(false);
    });

    it("honours a pinned full batch, since the admin chose it deliberately", () => {
        const full = batch({ batchId: "full", usage: 1 });
        const result = resolveUploadBatch([roomy, full], "full");

        expect(result.batch?.batchId).toBe("full");
        expect(result.pinnedIgnored).toBe(false);
    });

    it("falls back and flags it when the pinned batch has expired", () => {
        const expired = batch({ batchId: "expired", ttlSeconds: 0 });
        const result = resolveUploadBatch([roomy, expired], "expired");

        expect(result.batch?.batchId).toBe("roomy");
        expect(result.pinnedIgnored).toBe(true);
    });

    it("falls back and flags it when the pinned batch is unusable", () => {
        const unusable = batch({ batchId: "unusable", usable: false });
        const result = resolveUploadBatch([roomy, unusable], "unusable");

        expect(result.batch?.batchId).toBe("roomy");
        expect(result.pinnedIgnored).toBe(true);
    });

    it("falls back and flags it when the pinned batch is gone from the node", () => {
        const result = resolveUploadBatch([roomy], "no-longer-here");

        expect(result.batch?.batchId).toBe("roomy");
        expect(result.pinnedIgnored).toBe(true);
    });

    it("reports no batch at all when the pin is stale and nothing else qualifies", () => {
        const result = resolveUploadBatch([batch({ batchId: "dead", usable: false })], "dead");

        expect(result.batch).toBeNull();
        expect(result.pinnedIgnored).toBe(true);
    });
});

describe("explainNoUsableBatch", () => {
    it("tells the admin to buy one when the node has none", () => {
        expect(explainNoUsableBatch([])).toMatch(/no postage batches/i);
    });

    it("names expiry when everything has expired", () => {
        const msg = explainNoUsableBatch([batch({ ttlSeconds: 0 }), batch({ ttlSeconds: -1 })]);
        expect(msg).toMatch(/expired/i);
    });

    it("names unusability when everything is unusable", () => {
        const msg = explainNoUsableBatch([batch({ usable: false }), batch({ usable: false })]);
        expect(msg).toMatch(/unusable/i);
    });

    it("counts both causes in a mixed failure", () => {
        const msg = explainNoUsableBatch([
            batch({ ttlSeconds: 0 }),
            batch({ usable: false }),
        ]);
        expect(msg).toMatch(/1 expired/);
        expect(msg).toMatch(/1 unusable/);
    });
});
