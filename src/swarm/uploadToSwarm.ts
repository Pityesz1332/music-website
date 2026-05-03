// AI-generated script for functionality testing. Not for production.

/**
 * One-time dev utility: populates a local bee-dev node with tracks
 * and logs the resulting hashes for songs.json.
 */

import { Bee } from "@ethersphere/bee-js";
import fs from "fs";
import path from "path";

const BEE_URL = "http://localhost:1633";

// List of files to be uploaded.
// src: path relative to the project root.
// songId: ID from songs.json (used for logging purposes only).
const SONGS = [
    {
        songId: "1",
        title: "DJ Enez Favorites 1",
        src: "public/songs/Dj-Enez-Favorites-1.mp3",
    },
    {
        songId: "2",
        title: "DJ Enez Favorites 2",
        src: "public/songs/Dj-Enez-Favorites-2.mp3",
    },
];

async function uploadAll() {
    const bee = new Bee(BEE_URL);

    // checking node status
    console.log("🔍 Checking Bee node...");
    try {
        const connected = await bee.isConnected();
        if (!connected) throw new Error("Node not connected");
        console.log("✅ Bee node available:", BEE_URL);
    } catch {
        console.error("❌ Bee node not available:", BEE_URL);
        console.error("   Start: bee dev");
        process.exit(1);
    }

    // Fetch postage stamp
    console.log("\n📦 Searching for Stamp...");
    let batchId: string;
    try {
        const stamps = await bee.getPostageBatches();
        if (!stamps.length) throw new Error("No available stamp");
        batchId = stamps[0].batchID.toHex();
        console.log("✅ Stamp ID:", batchId);
    } catch (err) {
        console.error("❌ Error getting stamp:", err);
        process.exit(1);
    }

    // uploads
    console.log("\n🚀 Starting upload...\n");
    const results: { songId: string; title: string; hash: string }[] = [];

    for (const song of SONGS) {
        const filePath = path.resolve(process.cwd(), song.src);

        // checking for existing files
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  File not found: ${filePath}`);
            continue;
        }

        console.log(`📤 Upload: ${song.title}`);
        console.log(`   File: ${filePath}`);

        try {
            const fileData = fs.readFileSync(filePath);
            const fileSizeMB = (fileData.length / 1024 / 1024).toFixed(2);
            console.log(`   Size: ${fileSizeMB} MB`);

            const result = await bee.uploadData(batchId as any, fileData);
            const hash = result.reference.toString();

            console.log(`   ✅ Hash: ${hash}\n`);
            results.push({ songId: song.songId, title: song.title, hash });
        } catch (err) {
            console.error(`   ❌ Upload failed: ${err}\n`);
        }
    }

    // Summary – copy and paste this content into songs.json.
    if (results.length === 0) {
        console.error("❌ One upload failed.");
        process.exit(1);
    }

    console.log("═══════════════════════════════════════════════════");
    console.log("✅ DONE");
    console.log("═══════════════════════════════════════════════════\n");

    results.forEach(({ songId, title, hash }) => {
        console.log(`Song ID ${songId} – ${title}`);
        console.log(`  "swarmHash": "${hash}"\n`);
    });

    // automaticly updates songs.json
    try {
        const jsonPath = path.resolve(process.cwd(), "src/data/songs.json");
        const raw = fs.readFileSync(jsonPath, "utf-8");
        let songs = JSON.parse(raw);

        results.forEach(({ songId, hash }) => {
            songs = songs.map((s: any) =>
                s.id === songId ? { ...s, swarmHash: hash } : s
            );
        });

        fs.writeFileSync(jsonPath, JSON.stringify(songs, null, 4));
        console.log("📝 songs.json updated.");
    } catch (err) {
        console.warn("⚠️  songs.json update failed. Paste it manually");
        console.warn("   Error:", err);
    }
}

uploadAll();