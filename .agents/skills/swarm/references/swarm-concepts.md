# Swarm Concepts Reference

*Distilled from the Swarm whitepaper (v1.0, June 2021), formal specification (August 2025), and Bee release notes through v2.7 (2025).*

---

## Table of Contents
1. [What is Swarm?](#what-is-swarm)
2. [Architecture Overview](#architecture-overview)
3. [DISC: The Storage Layer](#disc-the-storage-layer)
4. [Chunks](#chunks)
5. [Postage Stamps](#postage-stamps)
6. [Files, Manifests & the Swarm Hash](#files-manifests--the-swarm-hash)
7. [Feeds (Mutable Storage)](#feeds-mutable-storage)
8. [Erasure Coding](#erasure-coding)
9. [Incentives: SWAP & BZZ](#incentives-swap--bzz)
10. [Privacy & Encryption](#privacy--encryption)
11. [Access Control Trie (ACT)](#access-control-trie-act)
12. [Messaging: PSS](#messaging-pss)
13. [Pinning & Recovery](#pinning--recovery)
14. [Multichain Payments](#multichain-payments)
15. [Technical Internals](#technical-internals)

---

## What is Swarm?

Swarm is a **peer-to-peer network** of nodes that collectively provide a decentralised storage and communication service. Its mission is to provide scalable base-layer infrastructure for the decentralised internet — an economically self-sustaining system powered by the BZZ token on the Ethereum blockchain.

Key properties:
- **Privacy-preserving** upload and download (permissionless)
- **Censorship-resistant** — no single party can block or alter published content
- **Auto-scaling** — distribution scales automatically with demand
- **Integrity-protected** — content is verified via cryptographic hashes
- **Eventually forgetting** — unpaid-for content is pruned over time

---

## Architecture Overview

Swarm has a layered design:

```
4. Application layer (dApps, websites)
3. High-level API  (files, feeds, messaging)       ← Swarm
2. Overlay network (DISC - immutable chunk store)  ← core
1. Underlay p2p network (libp2p transport)
```

---

## DISC: The Storage Layer

**DISC** = *Distributed Immutable Store of Chunks*

Swarm nodes build and maintain a **Kademlia** overlay network. Every node has a Swarm address (derived from its Ethereum account). Nodes connect to:
- A **fully connected neighbourhood** — nodes closest to them (proximity order d, minimum 4 nodes)
- Additional peers in each shallower proximity bucket

**Routing**: Messages are forwarded hop-by-hop, each hop getting closer to the destination. Maximum hops = O(log N) where N is total nodes.

**Storage assignment**: Each chunk is stored by nodes whose address is "close" to the chunk's address (using XOR distance / proximity order). This is deterministic — no routing table needed to find where a chunk lives.

**Synchronisation**: 
- **push-sync** — new chunks are pushed to their correct neighbourhood
- **pull-sync** — nodes continuously sync to ensure all neighbourhood chunks are redundantly stored
- **retrieval** — any node can request a chunk by address; it's routed to the neighbourhood

---

## Chunks

The **canonical unit of storage** in Swarm is a **chunk**: at most **4 kilobytes** of data with a 32-byte address.

### Content-Addressed Chunks (CAC)
- Address = **BMT hash** of (span + payload)
- **BMT** = Binary Merkle Tree hash using Keccak256
- Pad content to 4KB with zeros before hashing (padding is not stored, only used for the hash)
- Integrity: recomputing the hash verifies the data hasn't changed
- Immutable: same data always has the same address

### Single-Owner Chunks (SOC)
- Address = hash(owner_account + identifier)
- Contains: identifier + ECDSA signature + content chunk
- Owner attests via signature that specific data maps to the identifier
- Foundation of **feeds** (mutable storage)
- Each owner "owns" a part of Swarm's address space

### Graffiti Single-Owner Chunks (GSOC)
- Extension of SOC that allows **multiple different writers** to contribute to a single chunk address
- The identifier is chosen such that many parties can independently post to the same address namespace
- Foundation for **multi-user collaborative content**: forums, chat, social feeds, polls
- Unlike regular SOCs (where only one private-key holder can write), GSOCs unlock concurrent writes from any participant
- Each writer posts their own signed SOC; readers collect and merge all contributions from the shared address space

---

## Postage Stamps

Postage stamps are the **payment mechanism** for storage. Without a valid stamp, chunks will eventually be evicted.

### How They Work
1. Publisher buys a **postage batch** for BZZ tokens (on-chain smart contract)
2. Batch entitles owner to issue stamps — one stamp per chunk stored
3. Stamps are attached to chunks; they signal how much the publisher values persisting that content
4. Nodes use stamp value to prioritize which chunks to keep vs evict
5. Stamp value **decays over time** (like storage rent being deducted)
6. When value drops to zero → chunk is evicted from reserve → moved to cache → eventually deleted

### Stamp Validity Conditions (formal spec)
A stamp is valid if:
- `batchID` exists on the blockchain
- Batch balance > 0
- Signature authenticates the owner
- Stamp index is within batch size limits
- Stamp is aligned to the node's neighbourhood

### Batch vs Stamp
- **Batch** = the on-chain purchase (has a balance, a size, an owner)
- **Stamp** = individual proof attached to each chunk, derived from the batch

### Reserve vs Cache
- **Reserve**: fixed-size storage for neighbourhood chunks protected by valid stamps
- **Cache**: chunks evicted from reserve or too far from node address; pruned by LRU (least recently used)

---

## Files, Manifests & the Swarm Hash

### Large Files (Swarm Hash Tree)
Files larger than 4KB are split into chunks. The chunks form a **balanced Merkle tree**:
- Leaf nodes = data chunks
- Intermediate nodes = chunks of up to 128 references (hashes) to children
- Root = single chunk whose hash is the **Swarm hash** of the file

Properties:
- File address = Merkle root hash = content checksum (integrity verification built in)
- **Efficient random access**: seek to any offset in O(log N) chunk retrievals
- **Range queries** served efficiently

File sizes per tree level (unencrypted):
| Level | Max size |
|---|---|
| 0 (single chunk) | 4 KB |
| 1 | 512 KB |
| 2 | 67 MB |
| 3 | 8.5 GB |
| 4 | 1.1 TB |
| 5 | 140 TB |

### Manifests (Collections / Directories)
Manifests encode **string → reference** mappings. Uses:
- Directory trees (website hosting)
- Key-value stores
- Routing tables for dApps

Implemented as a **compacted Merkle trie** — only chunks along the lookup path need to be retrieved (O(log size) overhead).

### ENS (Domain Resolution)
Swarm supports human-readable names via Ethereum Name Service (ENS). A domain like `myapp.eth` can resolve to a Swarm reference. The ENS record can point to a **feed** so content can be updated without re-registering.

---

## Feeds (Mutable Storage)

Feeds provide the **illusion of mutable content** on top of Swarm's immutable store.

### How They Work
- A feed is a sequence of **Single-Owner Chunks** (SOCs)
- Identifier = hash(topic + index)
- Publisher updates a feed by writing new SOCs with incrementing indices
- Readers find the latest update by looking up the predictable SOC address

### Use Cases
- Mutable websites / dApps
- Version history of documents
- Sequential log / message channel
- "Latest news" style content

### Feed Types
- **Epoch feeds**: index = timestamp-based epoch (good for time-series)
- **Sequential feeds**: index = sequential counter (simple numbered updates)

### Reading External Feeds
To read someone else's feed, you need their Ethereum address (owner) and the topic name.

---

## Erasure Coding

Swarm supports **erasure coding** to increase data resilience beyond simple replication.

### How It Works
- File data is divided into **m data chunks** and **k parity chunks** (total = m + k = 128 per stripe)
- Any **m chunks** from the set are sufficient to reconstruct the original data
- Even if k chunks are lost or unavailable, the file remains fully recoverable
- Parity chunks are stored in the network alongside data chunks via the standard push-sync path

### Redundancy Levels
| Level | Name | Description |
|---|---|---|
| 0 | None | No redundancy (default) |
| 1 | Medium | Tolerates loss of a moderate number of chunks |
| 2 | Strong | Higher fault tolerance; more parity chunks generated |
| 3 | Insane | Very high redundancy; significant storage overhead |
| 4 | Paranoid | Maximum redundancy; highest storage cost |

### When to Use
- Use for content where long-term availability is critical
- Higher levels increase the number of chunks uploaded (and therefore stamp cost)
- Level 1–2 is appropriate for most production use cases; levels 3–4 for archival or mission-critical data

---

## Incentives: SWAP & BZZ

### BZZ Token
- Swarm's native token on Ethereum
- Used to: buy postage stamps, settle bandwidth debts, stake as a node operator

### SWAP (Swarm Accounting Protocol)
Peers track relative bandwidth contribution per connection:
1. Within bounds → service-for-service (no payment needed)
2. Debt exceeds threshold → pay via BZZ cheques (settled on-chain)
3. Nodes earn BZZ by routing requests closer to their destination
4. **Opportunistic caching**: nodes cache popular content to earn from repeat requests

### Redistribution Game (Storage Incentives)
Node operators are rewarded via a **commit-reveal game**:
1. Neighbourhood selected randomly each round
2. Nodes commit to a sample of their reserve
3. Nodes reveal; honest nodes with correct reserves can claim the pot
4. Rewards proportional to stake × storage depth
5. Random seed = XOR of all revealed nonces (secure, manipulation-resistant)

### Reserve Doubling / Sister Neighbourhood
- Nodes can opt to store chunks from a **"sister" neighbourhood** in addition to their own
- This effectively doubles the node's reserve size and storage responsibility
- In return, the node gets **double the chances** of being selected in the redistribution game
- The sister neighbourhood is deterministically derived from the node's own neighbourhood address
- This feature improves overall network redundancy while giving operators a path to higher earnings

### Neighbourhood Hopping & Stake Management
- Node operators can **move their stake to a different neighbourhood** without losing it (transferable stake)
- This allows operators to rebalance across underserved parts of the network
- Operators can also **withdraw their stake** if they choose to stop participating
- A minimum stake age (MIN_STAKE_AGE = 228 blocks, ~1.5 rounds) must elapse after stake updates before the stake is useable — preventing opportunistic manipulation

---

## Privacy & Encryption

### Chunk-Level Encryption
- Chunks can be padded to 4KB and encrypted with a symmetric key
- Encrypted chunks are **indistinguishable from random data**
- The encrypted reference = hash + decryption key (64 bytes vs 32 bytes unencrypted)
- Node operators cannot determine what content a chunk belongs to
- Encryption is end-to-end (done at the Bee API layer, not in the network)
- Public gateways cannot serve encrypted content (they don't have the key)

### Access Control (ACT)
Swarm supports fine-grained access control for encrypted content:
- **Password-based**: session key derived via scrypt from password + hint + salt
- **Public-key based**: session key via ECDH shared secret
- ACT manifest maps grantee public keys to access keys
- Revocation: remove key from ACT manifest

### Privacy Properties
- Requestor identity is hidden (forwarding is ambiguous — relaying looks the same as originating)
- Chunks have no context metadata
- Deniable storage: node operators have no knowledge of what they store

---

## Access Control Trie (ACT)

ACT provides **fine-grained, revocable access control** for encrypted content stored on Swarm.

### How It Works
1. Publisher encrypts content and uploads it to Swarm
2. An **ACT manifest** (a special Swarm manifest) maps grantee identifiers to encrypted session keys
3. Each grantee uses their private key to decrypt the session key, then uses it to decrypt the content
4. The ACT manifest itself is stored on Swarm and can be updated by the publisher

### Grant Types
- **Password-based access**: session key derived via scrypt from a password + salt + hint; share the password out-of-band
- **Public-key based access**: session key wrapped via ECDH shared secret; grantee uses their Ethereum private key to unwrap

### Revocation
- Remove a grantee's entry from the ACT manifest and re-encrypt with a new session key
- Old references using the revoked key stop working; existing grantees receive an updated reference

### Key Properties
- Publishers retain control without re-uploading the underlying content
- Access can be granted to many parties independently
- Works with ENS: point a domain to a feed that always serves the latest ACT-protected reference

---

## Messaging: PSS

**PSS** = *Postal Service on Swarm* — direct node-to-node messaging.

### How It Works
1. Message encrypted for recipient's public key
2. Wrapped in a **"Trojan chunk"** — a content-addressed chunk whose address falls in the recipient's neighbourhood
3. A nonce is mined so the chunk naturally routes to the recipient via push-sync
4. To third parties: the chunk looks like random encrypted data ("Trojan")
5. Recipient's node tries to decrypt all chunks arriving in its neighbourhood

### Properties
- **Asynchronous**: message is stored and delivered even if recipient is offline
- **Anonymous**: sender identity is hidden
- **Topics**: messages are tagged with a topic; apps subscribe to specific topics
- **Use cases**: anonymous messaging, push notifications, initial contact setup

---

## Pinning & Recovery

### Pinning
Nodes can **pin** specific content to ensure it's kept locally regardless of stamp expiry or cache eviction. Useful for publishers who want guaranteed availability.

### Reactive Recovery
When a chunk retrieval fails:
1. Requester sends a recovery request via PSS to known pinners
2. Pinner re-uploads the missing chunk
3. Requester retries and succeeds

### Proactive Recovery (Data Stewardship)
Pinners periodically check chunk availability and proactively re-upload missing chunks. Ensures long-term content health.

---

## Multichain Payments

Swarm's payment layer has expanded beyond BZZ-only to support uploads funded by other tokens.
- The **Multichain Widget** simplifies funding your Bee node with **xDAI and xBZZ**
- It supports **multiple chains and tokens** (including EVM-compatible chains and Solana), allowing you to pay with what you have
- Swaps are handled automatically via **Relay and SushiSwap**, making the bridging and conversion process seamless for the user
- You can access the widget at [fund.ethswarm.org](https://fund.ethswarm.org/) or [fund.bzz.limo](https://fund.bzz.limo/)

### Implications
- Users no longer need to acquire BZZ directly to upload content
- Lowers the onboarding barrier for publishers coming from other chains
- Postage stamp mechanics (batch/stamp/reserve) are unchanged — only the payment entry point is broadened

---

## Technical Internals

### Addresses
- **Overlay address**: hash(eth_address + network_id + nonce) — Swarm identity
- **Underlay address**: libp2p multiaddress — network location (IP/port)
- **BZZ address**: signed pairing of overlay + underlay (prevents impersonation)

### BMT Hash (Binary Merkle Tree)
1. Pad data to 4096 bytes with zeros
2. Split into 32-byte segments
3. Hash pairs of segments bottom-up using Keccak256
4. Prepend 8-byte span (little-endian uint64) to the root hash
5. Final hash = BMT chunk hash = content address

### Chunk Size Limits
- Segment: 32 bytes
- Chunk max payload: 4096 bytes (128 segments)
- Chunk reference: 32 bytes (unencrypted) or 64 bytes (encrypted, includes key)

### Parameter Constants
| Constant | Value | Description |
|---|---|---|
| BZZ_NETWORK_ID | 0 | Swarm network identifier |
| PHASE_LENGTH | 38 blocks | Commit phase of redistribution round |
| ROUND_LENGTH | 152 blocks | Full redistribution game round |
| NODE_RESERVE_DEPTH | 23 | log2 of required chunk count in reserve |
| MINIMUM_STAKE | 10 BZZ | Minimum stake to participate in redistribution |
| NHOOD_PEER_COUNT | 4 | Minimum peers to form a neighbourhood |