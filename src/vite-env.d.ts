/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SWARM_GATEWAY?: string;
    readonly VITE_SWARM_BEE_API?: string;
    readonly VITE_SWARM_POSTAGE_BATCH?: string;
    readonly VITE_SWARM_SONGS_REF?: string;
    readonly VITE_ADMIN_ADDRESSES?: string;
    readonly VITE_SWARM_FEED_OWNER?: string;
    readonly VITE_SWARM_FEED_TOPIC?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
