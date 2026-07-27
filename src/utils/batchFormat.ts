const HOUR = 3600;
const DAY = 86400;

export const TTL_SCALE_DAYS = 30;

export type TtlHealth = "unknown" | "expired" | "critical" | "warning" | "healthy";

export const TTL_CRITICAL_DAYS = 3;
export const TTL_WARNING_DAYS = 7;

export function ttlHealth(seconds: number | null): TtlHealth {
    if (seconds === null) return "unknown";
    if (seconds <= 0) return "expired";
    if (seconds < TTL_CRITICAL_DAYS * DAY) return "critical";
    if (seconds < TTL_WARNING_DAYS * DAY) return "warning";
    return "healthy";
}

export function ttlBarFraction(seconds: number | null): number {
    if (seconds === null || seconds <= 0) return 0;
    return Math.min(seconds / (TTL_SCALE_DAYS * DAY), 1);
}

export function formatTimeLeft(seconds: number | null): string | null {
    if (seconds === null) return null;
    if (seconds <= 0) return "Expired";

    const days = Math.floor(seconds / DAY);
    const hours = Math.floor((seconds % DAY) / HOUR);
    const minutes = Math.floor((seconds % HOUR) / 60);

    if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "< 1m";
}

export function usagePercent(usage: number): number {
    if (!Number.isFinite(usage) || usage <= 0) return 0;
    return Math.round(Math.min(usage, 1) * 100);
}

export function shortenBatchId(batchId: string): string {
    if (batchId.length <= 20) return batchId;
    return `${batchId.slice(0, 10)}…${batchId.slice(-8)}`;
}
