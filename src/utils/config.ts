// Central config, read from Vite env vars (see .env.example).
// All values are optional at build time — the app degrades to a read-only
// build when the admin-local write credentials are absent.

const env = import.meta.env;

// Public Swarm read gateway (visitors fetch assets + catalog through this).
export const SWARM_GATEWAY: string =
    env.VITE_SWARM_GATEWAY ?? "https://gateway.ethswarm.org";

// Shared song-catalog feed identity (public, safe to ship).
export const SWARM_FEED_OWNER: string = env.VITE_SWARM_FEED_OWNER ?? "";
export const SWARM_FEED_TOPIC: string =
    env.VITE_SWARM_FEED_TOPIC ?? "dj-enez-song-catalog";

// Optional static fallback catalog reference.
export const SWARM_SONGS_REF: string = env.VITE_SWARM_SONGS_REF ?? "";

// Wallet address(es) allowed to sign in as admin (comma-separated, lowercased).
export const ADMIN_ADDRESSES: string[] = (env.VITE_ADMIN_ADDRESSES ?? "")
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean);

// Admin-local write credentials — empty in the public deployment.
export const SWARM_BEE_API: string = env.VITE_SWARM_BEE_API ?? "";
export const SWARM_POSTAGE_BATCH: string = env.VITE_SWARM_POSTAGE_BATCH ?? "";
