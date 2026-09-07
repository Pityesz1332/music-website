# Admin Login, Passkey & Swarm Upload — How It Actually Works

A walkthrough of the admin authentication and publishing flow as implemented on the `mvp-deploy` branch.

---

## 1. The core idea: there is no login, there is a key

There is no backend, no session token, no user table, no `/api/login`. The app is a static SPA that talks
directly to Swarm. So "being an admin" is defined by exactly one thing:

> **Admin = the browser tab currently holds the feed publisher private key in memory.**

That is literally the check — [AdminContext.tsx:27](src/context/AdminContext.tsx#L27):

```ts
const isAdmin = useSyncExternalStore(subscribeToFeedKey, hasFeedKey, () => false);
```

`hasFeedKey()` returns `feedKey !== null` from a module-level variable in
[feedKey.ts](src/swarm/feedKey.ts). [AdminRoute.tsx](src/routes/AdminRoute.tsx) redirects to
`/admin/connect` whenever that is false.

This matters for understanding everything else: **the passkey is not an identity check.** Nothing verifies
"who" you are. The passkey is a local decryption mechanism that hands the key back to you without you
having to retype it. Authority comes from the key itself, which Swarm verifies cryptographically when you
write to the feed.

Two secrets are held per session, both in memory only:

| Secret | Module | Purpose |
|---|---|---|
| Feed publisher private key | [feedKey.ts](src/swarm/feedKey.ts) | Signs feed updates; defines the catalog owner |
| Bee node write URL | [writeConfig.ts](src/swarm/writeConfig.ts) | The writable node uploads go through |

The write URL is deliberately *not* an env var. `VITE_SWARM_READ_URL` (a public gateway) is baked into the
bundle for reading; the write node address is entered at runtime so a public deployment never leaks the
operator's node to visitors.

---

## 2. First-time setup (bootstrapping)

No passkey exists yet, so `canUsePasskey` is false and
[AdminConnect.tsx](src/pages/admin/admin-connect/AdminConnect.tsx) renders only the raw-key form.

1. **Paste the feed publisher private key** (hex) at `/admin/connect`.
2. `signInWithRawKey` → `applyFeedKey` ([AdminContext.tsx:31-37](src/context/AdminContext.tsx#L31-L37)):
   - `setFeedKey(hex)` builds a bee-js `PrivateKey`.
   - It derives the key's address and compares it to `VITE_FEED_OWNER_ADDRESS`.
   - **Mismatch → the key is immediately cleared and an error is thrown.** This catches the nasty failure
     mode where you publish with the wrong key and readers silently see nothing.
3. `isAdmin` flips, the effect in [useAdminAuth.ts:18-24](src/hooks/admin/useAdminAuth.ts#L18-L24)
   navigates to `/admin`.
4. On the dashboard, [FeedKeyPanel](src/components/admin/feed-key/FeedKeyPanel.tsx) is used to set the
   **Bee write URL** (validated as `http:`/`https:`).
5. Once *both* key and URL are loaded (`canEnrollPasskey`), the "Set up a passkey" button appears.

### What enrollment actually does

[`enrollPasskey`](src/swarm/passkeyAuth.ts#L80-L128) — this is a WebAuthn **PRF** flow, not a login flow:

```
navigator.credentials.create({
    residentKey: "required",
    userVerification: "required",
    extensions: { prf: {} }          // ask the authenticator for a PRF
})
        │
        ├─ prf.enabled === false → abort with a "remove this passkey" message
        │
        ▼
evaluatePrf(rawId)                    // second prompt: credentials.get() with prf.eval.first = PRF_SALT
        │
        ▼  32 bytes of authenticator-derived secret
deriveVaultKey()  →  HKDF-SHA256(info = PRF_SALT)  →  AES-GCM 256-bit CryptoKey  (non-extractable)
        │
        ▼
sealSecret(key, JSON.stringify({ feedKeyHex, writeUrl }))   // AES-GCM, random 12-byte IV
        │
        ▼
localStorage["swarmAdminFeedVault"] = { v: 2, credentialId, iv, ciphertext }
```

The PRF output never leaves the browser, the AES key is non-extractable, and **only ciphertext touches
disk**. The private key itself is never persisted in plaintext anywhere.

Note the double prompt: `create()` does not reliably return PRF results, so enrollment immediately performs
an assertion to obtain them. The user sees Touch ID twice during setup — that is intentional, not a bug.

---

## 3. Returning session (the normal path)

`canUsePasskey = isPasskeySupported() && hasEnrolledPasskey()` — secure context + `PublicKeyCredential` +
a stored vault record. The passkey button now shows on `/admin/connect`.

[`unlockVault`](src/swarm/passkeyAuth.ts#L130-L157):

1. Read the vault record from localStorage.
2. `credentials.get()` with `allowCredentials: [storedId]`, `userVerification: "required"`, and the same
   `prf.eval.first = PRF_SALT`.
3. Same HKDF derivation → same AES key → `openSecret` decrypts the payload.
4. Returns `{ feedKeyHex, writeUrl }`. (Legacy `v: 1` records held a bare key hex and return `writeUrl: ""`.)
5. `AdminContext` applies the key (with the same owner-address check) and restores the write URL — so one
   Touch ID gets you a fully upload-ready session.

Failure modes are distinguished and surfaced as toasts via
[useAdminAuth](src/hooks/admin/useAdminAuth.ts#L26-L33): prompt dismissed, authenticator without PRF
support, decryption failure, unreadable vault.

### Session lifetime

- Both secrets live in **module-level variables**. A refresh, a new tab, or closing the browser ends the
  session. There is no expiry timer and no idle timeout — there doesn't need to be.
- "Log out" = `disconnectAdmin()` ([useAdminNavbar](src/hooks/admin/useAdminNavbar.ts)) which clears the
  key and the URL. The encrypted vault **survives** logout — that's the whole point of it.
- `clearEnrolledPasskey()` in the FeedKeyPanel deletes the vault (the WebAuthn credential itself stays in
  the OS and must be removed from device settings separately).

---

## 4. The upload flow

### 4a. Picking the file — [useUploadSong.ts](src/hooks/admin/useUploadSong.ts)

- Audio is validated by `file.type.startsWith("audio/")`.
- Duration is read by loading the file into a detached `Audio` element and waiting for `loadedmetadata`.
- The title is auto-filled from the filename (extension stripped).
- Cover art is optional, validated by `image/` prefix.

### 4b. Choosing a postage batch — [batchSelection.ts](src/swarm/batchSelection.ts)

Every write first resolves a batch via `getValidBatchId()`
([swarmService.ts:33-52](src/swarm/swarmService.ts#L33-L52)):

1. `fetchPostageBatches()` queries the **write** node.
2. `resolveUploadBatch(batches, getPinnedBatchId())` — a pinned batch (localStorage, set from Manage
   Batches) wins if it is still eligible; otherwise it falls back and logs a warning.
3. Eligibility = `usable && !expired`. Ranking = has spare capacity → lower usage → longer TTL.
4. No candidate → `explainNoUsableBatch()` produces a human message ("every batch has expired", "buy one
   before uploading", …) rather than a raw Bee error.
5. Full-capacity batch → warn and proceed (Bee may evict older chunks).

### 4c. Upload and publish

```
handleUpload()
  ├─ uploadAudio(file)          → bee.uploadFile(batch, file)  → audioHash     [progress 0→50]
  ├─ uploadCover(cover)         → bee.uploadFile(batch, cover) → coverHash     [progress 50→100]
  └─ onSave({...form, audioHash, coverHash})
         │
         ▼  useSongManager.saveNewSong()
     duplicate check: any existing song whose swarmHash/src === audioHash → throw
     assign id = max(existing ids) + 1, build the Song record (src, swarmHash, cover, bg videos)
         │
         ▼  publishToSwarm(updatedSongs)
     publishSongsToFeed(songs, feedKey):
         1. resolve a batch again
         2. serialize the ENTIRE catalog to songs.json, upload it → metadataHash
         3. makeFeedWriter(topic "music-webpage-dj-enez", feedKey)
              .uploadReference(batch, metadataHash)      ← the only signed operation
```

The feed is a single mutable pointer owned by the feed key's address. Publishing = uploading a new
`songs.json` and repointing the feed at it.

### 4d. How readers see it — [useSongsFromSwarm.ts](src/hooks/swarm/useSongsFromSwarm.ts)

```
fetchLatestSongsHash(VITE_FEED_OWNER_ADDRESS)   // read gateway, makeFeedReader → downloadReference
        ↓  (null = never published → empty catalog, not an error)
fetchSongMetadata(hash)  →  JSON.parse  →  Song[]
        ↓
public views filter out `hidden`; admin passes includeHidden: true
```

Readers need no key and no write node — just the public gateway and the owner address, both baked into the
bundle.

### 4e. Deletion

There is none. `hideSong` sets `hidden: true` and republishes; the chunks stay on Swarm. This is honest —
immutable storage cannot support real deletion — and it is reversible via `unhideSong`.

---

## 5. Is this good enough for an MVP?

**Yes.** The security architecture is genuinely well-chosen for a keyless, serverless dapp, and the
decisions that are hardest to change later are the ones that were made correctly.

### What's right

- **No secret in the bundle, no secret at rest in plaintext, no backend to breach.** The three classic
  ways this kind of project leaks a key are all closed off.
- **The crypto is textbook-correct**: WebAuthn PRF → HKDF → AES-GCM with a random IV and a non-extractable
  key. Not homemade.
- **`userVerification: "required"`** — the passkey needs biometrics/PIN, not just possession.
- **The write node URL is runtime-only.** Visitors to the public site never learn where the operator's Bee
  node is.
- **The owner-address check** prevents the silent "published with the wrong key" disaster.
- **Batch selection has real fallback logic and diagnosable error messages** — the part most projects get
  lazy about.
- **In-memory-only session** is the conservative default; a refresh costs one Touch ID.

### What to be aware of

1. **The passkey is device-local convenience, not identity or a second factor.** The raw-key paste form is
   always available and is the actual root credential. Anyone with your unlocked device and browser profile
   is admin. Fine for one operator; it does not scale to a team.
2. **No recovery path.** Clearing site data or losing the device means the vault is gone. The feed private
   key must be backed up outside the browser — it is the only real credential, and losing it means losing
   control of the catalog permanently.
3. **Full-catalog rewrite on every edit.** Adding or hiding one song re-serializes and re-uploads all of
   `songs.json`. Fine at tens or low hundreds of songs; it is O(n) bandwidth per edit and it is
   last-write-wins with no compare-and-set, so two tabs editing concurrently will silently clobber each
   other. Also, once `hasLocalEdits` is set, `useSongManager` stops re-syncing from the feed, so a long
   admin session publishes from a base that may be stale.
4. **Publish is not atomic.** If the `songs.json` upload succeeds but the feed write fails, you get an
   orphaned hash and a catalog that appears unchanged. Harmless, but the error message won't say which
   half failed.
5. **A full batch is a silent data-loss risk.** `hasSpareCapacity` warns to the console and uploads anyway;
   Bee may then evict older chunks — i.e. previously uploaded songs.
6. **XSS on the admin route is game over**, and there is no CSP in [index.html](index.html) (which also
   loads Google Fonts from a third-party origin). Pasting a private key into a web form is inherently the
   weakest link in the design. Acceptable for a single-operator MVP; worth hardening before wider use.
7. **Rough edges in the upload path**: `alert()` for validation, `song: any`, `uploadFile(batchID as any)`,
   progress that jumps 10 → 100 rather than tracking real bytes, no size limit, no cancel. `getAudioDuration`
   has no `onerror` handler, so a corrupt audio file leaves the promise pending forever and the form
   appears frozen.
8. **Minor UX bug**: `AdminContext` sets `error` but never clears it, and `useAdminAuth` toasts on the
   `[error]` dependency. The same failure twice in a row sets an identical string, React bails out, and no
   second toast fires.

### Suggested order of work

**Before letting anyone else use it:** back up the feed key offline (#2), add a CSP and self-host the font
(#6), fix the hung-promise on `getAudioDuration` and the repeated-error toast (#7, #8).

**Before the catalog grows:** turn the full-catalog republish into something incremental or at least
re-read the feed before publishing (#3), and hard-block uploads to a full batch instead of warning (#5).

Nothing on that list is architectural. The foundation is sound; what remains is polish and operational
safety.
