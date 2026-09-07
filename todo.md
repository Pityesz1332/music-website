# Codebase Audit — Action List

Audit date: 2026-07-27 · Branch: `mvp-deploy`
**Target deployment: Swarm (bzz). Vercel is testing only.**

**Baseline health:** production build clean · ESLint clean · 0 type errors in production code · `.env` never committed · `dist/` not tracked · no `dangerouslySetInnerHTML`.

**Overall:** architecture is sound — the Swarm isolation, key custody, and crypto are done properly. Most of what follows is *migration rot* (leftovers from the pre-Swarm and pre-passkey eras), not design debt.

> **Why the ordering matters more than usual:** a Swarm upload is **immutable**. Every fix means a new hash, new postage, and updating the ENS/feed pointer — there is no hotfix. Ship the P0 items *before* the first real upload, not after.

---

## P0-SWARM — Blockers for a Swarm deployment

These do not matter on Vercel and were missed on the first pass. #1 ships a broken dapp.

### S1. The read gateway is baked into the bundle at build time 🔴 BLOCKER
`.env` currently has `VITE_SWARM_READ_URL=http://localhost:1633`, and `swarmService.ts:8` freezes it into the bundle at build. Upload that to Swarm and **every visitor's browser tries to fetch your catalog from their own localhost** — non-functional for anyone without a local Bee node. `resolveSwarmUrl` builds every audio and cover URL from it too, so nothing plays.

Even with a public gateway baked in, this hardcodes a **centralized dependency into a decentralized deployment**: that one gateway dies, the site loads but the music doesn't.

- [ ] Derive the read URL from the origin the app was *served from* (same-gateway) when running under `/bzz/`
- [ ] Fall back to a configured public gateway, then to `localhost:1633` for dev
- [ ] Verify a production build contains no `localhost` reference before uploading

### S2. Passkey admin login breaks across origins 🔴
`passkeyAuth.ts:88` sets `rp: { name: RP_NAME }` with **no `rp.id`**, so the WebAuthn RP ID defaults to the serving origin — and the vault lives in origin-scoped `localStorage`. Consequences:

- A passkey enrolled on Vercel **will not work** on any gateway (different origin, and the vault isn't there either)
- Every gateway domain is a separate origin → re-enrollment per gateway
- **On subdomain gateways (`<hash>.bzz.link`) every redeploy is a new origin** → admins re-enroll and users lose saved songs + history on *every release*

- [ ] Decide the canonical admin origin and set `rp.id` explicitly
- [ ] Strongly consider **splitting the admin app out of the Swarm bundle** (see S6) — it fixes this by keeping admin on a stable local origin
- [ ] Document that the raw-feed-key path is the recovery route when a passkey can't be used

### S3. Admin passkey requires a secure context 🟠
`isPasskeySupported()` requires `window.isSecureContext`. A plain-HTTP gateway disables admin login entirely (`localhost` is exempt).

- [ ] Confirm the admin origin is HTTPS or localhost
- [ ] Show a clear message instead of silently hiding the passkey option on insecure origins

### S4. 28 MB of static assets 🟠
`public/` is **28 MB** — `animation1.mp4` alone is **17 MB**, `home_video1.mp4` 7.3 MB, `waveform-to3.mp4` 2.8 MB. Invisible on a CDN; on Swarm it's postage cost **plus** gateway retrieval latency on every load. This dwarfs the 602 kB JS bundle in P1 #8.

- [ ] Compress/re-encode the videos (target ~1-2 MB each) or drop to poster images
- [ ] Consider uploading media as separate Swarm content referenced by hash, so the site bundle stays small and re-uploadable cheaply

### S5. Relative paths are written into the global feed 🟠
`useSongManager.ts:65-66` bakes `${import.meta.env.BASE_URL}assets/...` into **published song metadata**. That persists a build-specific, deployment-relative path into shared immutable data — songs published from a Vercel build carry that path into the feed forever, and every other deployment reads it back.

- [ ] Store a bare identifier (e.g. `"animation1"`) in the feed; resolve to a real URL at render time
- [ ] Check whether already-published songs need a migration pass

### S6. Consider not shipping the admin panel to Swarm 🟡
On Swarm the entire bundle is public and immutable, so all admin code is publicly readable. That is *not* a security hole — the real boundary is the feed private key — but shipping it costs bundle size and creates the origin churn in S2.

Splitting the public site (→ Swarm) from the admin app (→ run locally) would: fix the passkey origin problem, shrink the public bundle, and let you change admin tooling **without re-uploading the public site**.

- [ ] Evaluate as a build-target split before the first production upload

### S7. `vercel.json` is redundant and will be irrelevant 🟡
Its SPA rewrites already do nothing, because the app uses `HashRouter`. Harmless, but keep it clearly marked as test-only infrastructure.

- [ ] Leave in place for the Vercel test target; do not let it imply the production model

### S8. Unused secret baked into an immutable public artifact 🟡
`VITE_ADMIN_ADDRESS` is in `.env` but **referenced nowhere in `src/`**. On Vercel that's untidy; on Swarm it's permanently embedded in a public, immutable artifact.

- [ ] Remove it from `.env` / `.env.example`, or wire it up if it was meant to guard something
- [ ] Audit every `VITE_*` var before upload — assume all are public and permanent

---

## P0 — Correctness & safety nets

### 1. Restore TypeScript checking
`tsconfig.json:34` has `"ignoreDeprecations": "6.0"` — an invalid value. `tsc` aborts on the config before checking any file, so the type gate has been silently off.

- [ ] Remove or correct the `ignoreDeprecations` line
- [ ] Confirm: `npx tsc --noEmit` → 60 errors surface (all in test files; production code is clean)
- [ ] Fix or quarantine those 60 so the gate is green and stays meaningful

### 2. Stop swallowing Swarm load failures
`src/hooks/music-control/useFilteringSongs.ts:20` destructures `error: swarmError` and never uses it. `setError` only fires on the local JSON parse, so a dead gateway or unreachable feed renders an **empty catalog instead of an error** — the single most likely failure mode for this dapp. The retry UI at `Songs.tsx:45` is unreachable for the case it was built for.

- [ ] Surface `swarmError` through the hook's `error` return
- [ ] Verify `SongsStatus` / `ErrorState` + retry actually render when the gateway is down

### 3. Remove the `admin_songs` localStorage ghost
`src/hooks/music-control/useFilteringSongs.ts:36` reads `localStorage["admin_songs"]` — **nothing writes that key anymore** (pre-Swarm leftover). Not harmless:

```js
const allSongs = [...uploadedSongs, ...swarmSongs];   // local FIRST
const uniqueSongs = Array.from(new Map(allSongs.map(s => [s.id, s])).values());
```

`Map` keeps the **first** entry per id, so stale local copies **override the published feed** and **bypass the `hidden` filter** (which lives in `useSongsFromSwarm`). Users with old data see songs you've hidden or edited.

- [ ] Delete the merge; read the catalog from Swarm only
- [ ] Consider a one-time `localStorage.removeItem("admin_songs")` cleanup

### 4. Admin state diverges from the feed when publishing fails
`src/hooks/admin/useSongManager.ts` — `setSongs(updated)` runs *before* `publishToSwarm`, and `hasLocalEdits.current = true` permanently blocks resync from the feed. If publish fails, the admin UI shows the song as added/hidden while the feed does not have it, with **no rollback**. State stays wrong until a manual reload.

- [ ] Roll back local state when `publishToSwarm` throws, or don't apply it until publish succeeds
- [ ] Reset `hasLocalEdits` after a successful publish so the admin view resyncs (currently it never re-syncs for the rest of the session)

### 5. Song ID generation can permanently break the catalog
`useSongManager.ts:53` — `Math.max(...songs.map(s => Number(s.id)))`. One non-numeric id makes this `NaN`, so `String(NaN + 1)` → `"NaN"`, and **every subsequent song gets id `"NaN"`**. Also collides if two sessions publish concurrently, and spreads the whole array into `Math.max`.

- [ ] Switch to `crypto.randomUUID()` (ids are strings already — no migration needed)

### 6. `getAudioDuration` can hang the upload UI forever
`src/hooks/admin/useUploadSong.ts:29` — the Promise only resolves in `onloadedmetadata`. A corrupt or unsupported file never fires it, so `handleAudioChange` awaits forever with no error and no way out.

- [ ] Add an `onerror` handler and a timeout; reject/fall back to a manual duration entry

---

## P1 — Dead code & bundle weight

### 7. Three unreachable feature trees
`SAVED`, `MY_ACCOUNT`, and `ADMIN_USERS` are declared in `src/routes/constants/MainRoutes.ts` but have **no `<Route>`** in `EndpointRouter.tsx`.

- [ ] `src/pages/Profile/` — MyAccount, ProfileAvatar, HistoryModal, WalletSection, StatsDashboard
- [ ] `src/pages/admin/manage-users/` — ManageUsers, UserItem, EditUser (+ `hooks/admin/useUserManager.ts`, `data/usersData.ts`)
- [ ] `src/pages/saved-songs/Saved.tsx`
- [ ] `src/utils/api.ts` — zero consumers
- [ ] Two separate `PlaybackControls` components (`components/Playbar/` and `pages/song-page/`) — dedupe or document why both exist
- [ ] Decide per tree: **delete** (recoverable via git) or **route it**

### 8. wagmi + viem ship for a disabled feature
Eagerly loaded in `App.tsx` for wallet sign-in that the navbar itself calls *"coming soon"* (`i18n/ui/navbar.ts`). Main bundle is **602 kB / 186 kB gzip**, single chunk. On Swarm this is postage plus per-load gateway latency — though it is still an order of magnitude smaller than the 28 MB of video in S4, so **fix S4 first**.

- [ ] Drop `WagmiProvider`/`AuthContext` until wallet login is real, or lazy-load the wallet path
- [ ] Admin routes are already lazy (good); `bee-js` lands in the main chunk via `MusicContext` — consider splitting

---

## P2 — Test suite

### 9. The suite can't act as a safety net
**76 of 369 tests failing across 17 of 56 files.** Not flakes — they assert APIs that no longer exist: `useSongManager.deleteSong`, `useAdminAuth.handleChange`, `useNavbarSearch.setSearchTerm`, and an import of a deleted `data/songs.json`. They describe an app from two refactors ago, so the noise trains everyone to ignore red.

- [ ] Rewrite tests for the hooks that were refactored (`useSongManager`, `useAdminAuth`, `useNavbarSearch`, `AudioElement`, `TrackActions`)
- [ ] Delete tests for the dead trees removed in #7
- [ ] Target: green suite, then keep it green

---

## P3 — Polish

- [ ] **`console.log("loop alert")`** ships to production — `src/hooks/playback/usePlayback.ts:44`
- [ ] **Fake async** — `MusicContext.tsx:54` `await`s `resolveSwarmAudio`, which returns a plain template string. The `try/catch`, `isLoadingSwarm` spinner, and fallback are decorative; the catch can never fire. Either stream/blob-fetch properly or drop the ceremony.
- [ ] **Stale closure** — `MusicContext.tsx:62` `playSong` has `[]` deps but closes over `playbackPlay`, a fresh `const` binding each render. It permanently captures render 1, where `currentSong` was `null`, so the `currentSong?.id !== song.id` guard always passes and tracks get re-added to recently-played on replay.
- [ ] **`alert()` × 3** in `useUploadSong.ts` (lines 55, 65, 73) while `NotificationContext.notify` is used correctly in the *same file* at line 95 — unify on `notify`
- [ ] **`any` at the most critical boundary** — `saveNewSong(song: any)` (`useSongManager.ts:40`), `onSave: (song: any)` (`useUploadSong.ts:12`), `saveSong: (song: any)` (`TrackActions.tsx:22`). Give the upload payload a real type.
- [ ] **`as any` casts** in `swarmService.ts:83,116,143` around `batchID`/`metadataHash` — check whether bee-js branded types (`BatchId`, `Reference`) can be used properly
- [ ] **Orphaned Swarm chunks** — audio uploads before the feed publish; if publish fails, paid-for chunks are stranded. Low priority, but postage is already spent.
- [ ] **`src` and `swarmHash` both set to `audioHash`** (`useSongManager.ts:61-62`) — redundant, and the duplicate check `(s.swarmHash || s.src)` exists only because of that ambiguity. Pick one field.
- [ ] **`src/i18n/`** has no i18n library and one locale — they're plain string constants. Fine as organization; rename or add a real library so the name doesn't promise a system that isn't there.
- [ ] Remove stray `.swarm-watch-tmp.mjs` from the repo root (untracked, but clutter)

---

## P4 — README accuracy

`README.md` describes an app that doesn't exist yet. Worth fixing before anyone else reads it.

- [ ] "prioritizes ... **high test coverage**" → 76 tests failing
- [ ] "**Saved Songs** favorites management" → page unrouted
- [ ] "**Account Management**: avatar uploads, Wallet integration" → unrouted; wallet is "coming soon"
- [ ] "**User Management**: user data, roles, and permissions" → unrouted, fully dead
- [ ] "Full **CRUD** operations for tracks" → create + hide/unhide only; no update, no delete
- [ ] "**Internationalization (i18n)**: Multi-language support" → single locale, no i18n library

---

## Do not change — verified good

Recording these so they don't get "cleaned up" later:

- **`src/swarm/vaultCrypto.ts`** — WebAuthn PRF → HKDF-SHA256 → AES-GCM-256, random IV per seal, non-extractable keys. Correct.
- **`src/swarm/feedKey.ts`** — private key held in module memory only; never localStorage, never React state, so it can't leak via devtools or a persisted store. Cleared on disconnect.
- **Split read/write Bee** (`swarmService.ts` + `writeConfig.ts`) — write node supplied at runtime, never baked into the bundle. Right call for a dapp.
- **`useSyncExternalStore`** for feed key / write URL — correct primitive for external module state.
- **`feedKeyMatchesOwner` guard** — `AdminContext.tsx:33`.
- **`batchSelection.ts`** — clean pure functions, sensible pinned-batch fallback, genuinely helpful operator error messages.
- **Client-side `AdminRoute` is not a security hole** — it's a UX gate. The real boundary is possession of the feed private key, which is correct for a serverless dapp.

### Correct *specifically* for Swarm — do not "modernize"

- **`HashRouter`** (`App.tsx:1`) — required. Swarm serves a static manifest with no server-side rewrites; switching to `BrowserRouter` breaks every deep link on a gateway.
- **`base: './'`** (`vite.config.js`) — required. The app is served from `/bzz/<hash>/`, so absolute asset paths would 404.
- **Runtime-configured write URL** (`writeConfig.ts`) — keeps your Bee node out of a public, immutable bundle. Never move this to an env var.
