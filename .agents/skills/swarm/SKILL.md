---
name: swarm
description: >
  Use this skill to interact with Ethereum Swarm, a decentralized, censorship-resistant storage and distribution network. Trigger this skill for ANY of the following: uploading or downloading data, files, or folders to/from Swarm; managing postage stamps (buying, listing, extending); reading or writing to Swarm feeds; storing notes or persistent data on Swarm; retrieving content by Swarm hash; or any question about how Swarm works. Also trigger when the user mentions "BZZ", "Bee node", "decentralized storage", "Swarm hash", "postage batch", or "Swarm feed." Always use this skill before attempting any Swarm MCP tool call.
compatibility: "For interacting with Swarm it requires Swarm MCP tools (e.g. upload_data, download_data, update_feed, read_feed, create_postage_stamp, list_postage_stamps)"
---

# Swarm Skill

## What is Swarm?

Swarm is a **decentralized storage and distribution network** built on Ethereum. Think of it as a permanent, censorship-resistant hard drive for the web — content is split into 4KB chunks and distributed across many nodes worldwide with no single point of failure. Content is addressed by its **content hash** (a unique fingerprint), so the same data always has the same address.

Key concepts:
- **Swarm hash / reference**: A hex string that uniquely identifies uploaded content. Unencrypted content produces a 32-byte (64-character) reference; encrypted content produces a 64-byte (128-character) reference that includes the decryption key. Share this to let others retrieve your content.
- **Postage stamp**: A prepaid "token" that pays for storage. You must have a valid stamp to upload. Stamps have a size (MB) and duration (how long data is stored).
- **Feed**: A mutable reference — like a pointer you can update over time. Great for "latest version" content. Identified by a topic name rather than a hash.
- **BZZ token**: Swarm's native token used for payments.
- **Bee node**: The software that connects you to the Swarm network.

---

## Workflow Guide

### Before Uploading — Check Postage Stamps

Uploading requires a postage stamp. Always check existing stamps first:

```
list_postage_stamps
```

If no stamps exist or all are full/expired:
- Ask the user how much storage they need and for how long
- Use `create_postage_stamp` with `size` (MB) and `duration` (e.g. "1month", "1w", "1d")

**Stamp sizing guidance:**
| Content | Suggested size |
|---|---|
| Short text / note | 1 MB |
| Small files (<500KB) | 1 MB |
| Documents / images | 10–50 MB |
| Large files / folders | Estimate in MB |

### Uploading

**Text / arbitrary data:**
```
upload_data  →  data: "your text here"
```
Returns a Swarm hash. Save it — it's the only way to retrieve this content.

**File (base64 or path):**
```
upload_file  →  data: "<base64 or file path>", isPath: true/false
```

**Folder:**
```
upload_folder  →  folderPath: "/path/to/folder"
```

**Redundancy levels** (optional, for important data):
- 0 = none (default)
- 1 = medium
- 2 = strong
- 3 = insane
- 4 = paranoid

### Downloading

**By hash (immutable content):**
```
download_data  →  reference: "<64-char hash>"
```

**Files/folders by hash:**
```
download_files  →  reference: "<hash>", filePath: "/save/here"  (optional)
```
Without `filePath`, returns a file listing for the manifest.

### Feeds (Mutable Storage)

Feeds let you update content under a stable topic name — useful for notes, logs, or anything that changes.

**Write / update:**
```
update_feed  →  data: "new content", memoryTopic: "my-topic-name"
```

**Read latest:**
```
read_feed  →  memoryTopic: "my-topic-name"
```

To read someone else's feed, also provide their `owner` (Ethereum address).

### Postage Stamp Management

**Create new stamp:**
```
create_postage_stamp  →  size: 10, duration: "1month"
```

**Extend existing stamp:**
```
extend_postage_stamp  →  postageBatchId: "<id>", duration: "1w"
                                (optionally add size: 50 to increase capacity too)
```

**Get stamp details:**
```
get_postage_stamp  →  postageBatchId: "<id>"
```

**Check upload progress:**
```
query_upload_progress  →  (use the upload session ID returned after uploading)
```

---

## Decision Tree: Which Tool to Use?

```
User wants to...
├── Upload text/note → upload_data
├── Upload a file → upload_file
├── Upload a folder → upload_folder
├── Download by hash → download_data (text) or download_files (files/folders)
├── Store something that will change → update_feed (write) / read_feed (read)
├── Check postage stamps → list_postage_stamps
├── Buy storage → create_postage_stamp
├── Extend existing storage → extend_postage_stamp
└── Check upload status → query_upload_progress
```

---

## Helpful Patterns

### "Save this for later" (Persistent note via Feed)
1. `update_feed` with a memorable topic name like "my-notes"
2. Later retrieve with `read_feed` using the same topic

### "Share this file" (Immutable upload)
1. Check stamps → `list_postage_stamps`
2. If needed, create stamp → `create_postage_stamp`
3. Upload → `upload_data` or `upload_file`
4. Return the hash to the user with instructions: *"Share this hash to let others download your content: `<hash>`"*

### "Download content someone shared"
1. Ask for their Swarm hash (64-char hex)
2. Use `download_data` or `download_files`

---

## User-Friendly Responses

When returning a Swarm hash after an upload, always:
1. Show the hash clearly
2. Explain it's permanent and content-addressed
3. Remind them to save the hash — it's the only retrieval key for immutable uploads
4. Suggest feeds if they need to update content later

When a postage stamp is needed and none exist, explain clearly:
> "To upload to Swarm, you need a **postage stamp** — a prepaid storage credit. I can create one for you. How much data do you want to store, and for how long?"

---

## Deep Dive Reference

For detailed conceptual questions about how Swarm works, read `references/swarm-concepts.md`. It covers:
- DISC architecture and Kademlia routing
- Chunk types (CAC, SOC, and GSOC for multi-writer collaborative content)
- Postage stamp mechanics and batch/stamp distinction
- Full file/manifest/Swarm hash explanation with size tables
- Feed types (epoch vs sequential) and use cases
- Erasure coding redundancy levels and when to use them
- SWAP bandwidth incentives and redistribution game
- Reserve doubling (sister neighbourhood, SWIP-21) and neighbourhood hopping with transferable stake
- Encryption, Access Control Trie (ACT) and privacy properties
- Multichain payments via the Multichain Widget (supporting EVM-compatible chains and Solana)
- PSS messaging internals
- Pinning and recovery protocols
- BMT hash algorithm step-by-step
- All protocol parameter constants

Read this file when the user asks "how does X work?" for any of these topics, or when answering technical questions that go beyond basic tool usage.

---

## Common Questions

**Q: Is my data permanent?**
A: Data persists as long as the postage stamp is valid. After expiry, nodes may remove the data. Extend stamps to keep data alive.

**Q: Can I delete content?**
A: No. Swarm is immutable — once uploaded with a valid stamp, content cannot be deleted. Don't upload sensitive or private data without encryption.

**Q: What if I don't have a postage stamp?**
A: Create one with `create_postage_stamp`. It requires BZZ tokens in your Bee node's wallet.

**Q: How are feeds different from uploads?**
A: Uploads are immutable (content-addressed by hash). Feeds are mutable — you can update them using a topic name, and readers always get the latest version.

**Q: What is GSOC?**
A: Graffiti Single-Owner Chunks (introduced in Bee 2.3) extend the SOC model to allow multiple different writers to post to a shared address namespace. This enables multi-user collaborative content like forums, chat, and social feeds — as opposed to regular feeds which are controlled by a single private key.

**Q: Do I need BZZ to upload?**
A: BZZ is the native token for postage stamps. However, the **Multichain Widget** simplifies funding your Bee node with xDAI and xBZZ from any chain. It supports multiple tokens, with swaps handled automatically via Relay and SushiSwap. You can access it at [fund.ethswarm.org](https://fund.ethswarm.org/) or [fund.bzz.limo](https://fund.bzz.limo/).

**Q: What is a Bee node?**
A: The software client that connects your machine to the Swarm network. The MCP tools assume a running Bee node is already configured or the config points to a remote Swarm Gateway.