export const ADMIN_BATCHES_STRINGS = {
    TITLE: "Storage Batches",
    SUBTITLE:
        "Postage batches of your Bee node.",
    ACTIONS: {
        REFRESH: "Refresh",
        REFRESHING: "Refreshing…",
        PIN: "Use this batch",
        UNPIN: "Choose automatically",
    },
    STATUS: {
        LOADING: "Reading batches from your Bee node…",
        NO_WRITE_URL:
            "Set your Bee node's write URL on the Songs/Mixes page to see your batches.",
        EMPTY: "This node has no postage batches. You cannot upload or publish until one is purchased.",
    },
    CARD: {
        UNLABELLED: "(no label)",
        BATCH_ID: "Batch ID",
        TIME_LEFT: "Time remaining",
        TIME_UNKNOWN: "Not reported by this node",
        CAPACITY: "Capacity used",
        DEPTH: "Depth",
        UTILIZATION: "Utilization",
        AMOUNT: "Amount (per chunk)",
        TTL_SCALE: "shown against a 30-day scale",
    },
    BADGES: {
        USABLE: "Usable",
        UNUSABLE: "Not usable",
        IMMUTABLE: "Immutable",
        MUTABLE: "Mutable",
        ACTIVE: "Used for uploads",
        PINNED: "Chosen by you",
    },
    ACTIVE_NOTE: "New uploads and feed publishes are stamped with this batch.",
    AUTO_NOTE: "Chosen automatically. Pick a batch yourself to override this.",
    PINNED_IGNORED:
        "Your chosen batch is expired, unusable or no longer on this node, so uploads fall back to the batch below.",
    NO_ACTIVE:
        "No batch currently qualifies for uploads, so uploading and publishing will fail until one does.",
    WARNINGS: {
        EXPIRING: "This batch expires soon. Top it up, or data it stamped may be lost.",
        EXPIRED: "This batch has expired. Data it stamped can be garbage collected at any time.",
        FULL: "This batch is at full capacity. Further uploads may be rejected — purchase a larger batch (higher depth) or a new one.",
        UNUSABLE: "Bee reports this batch as not usable for uploads.",
    },
} as const;
