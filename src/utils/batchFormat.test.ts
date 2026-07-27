import { describe, it, expect } from "vitest";
import {
    formatTimeLeft,
    ttlHealth,
    ttlBarFraction,
    usagePercent,
    shortenBatchId,
    TTL_SCALE_DAYS,
} from "./batchFormat";

const DAY = 86400;
const HOUR = 3600;

describe("ttlHealth", () => {
    it.each([
        [null, "unknown"],
        [0, "expired"],
        [-500, "expired"],
        [1 * DAY, "critical"],
        [3 * DAY - 1, "critical"],
        [3 * DAY, "warning"],
        [7 * DAY - 1, "warning"],
        [7 * DAY, "healthy"],
        [90 * DAY, "healthy"],
    ])("%s seconds -> %s", (seconds, expected) => {
        expect(ttlHealth(seconds as number | null)).toBe(expected);
    });
});

describe("ttlBarFraction", () => {
    it("is 0 for unknown and expired batches", () => {
        expect(ttlBarFraction(null)).toBe(0);
        expect(ttlBarFraction(0)).toBe(0);
        expect(ttlBarFraction(-10)).toBe(0);
    });

    it("is proportional within the scale window", () => {
        expect(ttlBarFraction(15 * DAY)).toBeCloseTo(0.5);
    });

    it("clamps at 1 beyond the scale window rather than overflowing the bar", () => {
        expect(ttlBarFraction(TTL_SCALE_DAYS * DAY)).toBe(1);
        expect(ttlBarFraction(365 * DAY)).toBe(1);
    });
});

describe("formatTimeLeft", () => {
    it.each([
        [null, null],
        [0, "Expired"],
        [-1, "Expired"],
        [30, "< 1m"],
        [5 * 60, "5m"],
        [2 * HOUR, "2h"],
        [2 * HOUR + 30 * 60, "2h 30m"],
        [3 * DAY, "3d"],
        [9 * DAY + 4 * HOUR, "9d 4h"],
    ])("%s seconds -> %s", (seconds, expected) => {
        expect(formatTimeLeft(seconds as number | null)).toBe(expected);
    });

    it("matches the live node's reported TTL shape", () => {
        expect(formatTimeLeft(792240)).toBe("9d 4h");
    });
});

describe("usagePercent", () => {
    it.each([
        [0, 0],
        [0.5, 50],
        [1, 100],
        [-0.2, 0],
        [NaN, 0],
    ])("%s -> %s%%", (usage, expected) => {
        expect(usagePercent(usage as number)).toBe(expected);
    });

    it("clamps above 1 so the bar cannot overflow", () => {
        expect(usagePercent(1.4)).toBe(100);
    });
});

describe("shortenBatchId", () => {
    it("shortens a real 64-char batch id", () => {
        const id = "63b30081e399c4ecbdd610530c5509979b7a7c02689fa13712d9d4d8a8ef1efa";
        const short = shortenBatchId(id);

        expect(short).toBe("63b30081e3…a8ef1efa");
        expect(short.length).toBeLessThan(id.length);
    });

    it("leaves short values alone", () => {
        expect(shortenBatchId("abc123")).toBe("abc123");
    });
});
