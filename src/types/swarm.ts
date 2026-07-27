export interface PostageBatchInfo {
    batchId: string;
    label: string;
    usable: boolean;
    immutable: boolean;
    depth: number;
    bucketDepth: number;
    utilization: number;
    usage: number;
    ttlSeconds: number | null;
    amount: string;
}
