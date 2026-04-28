// EZT A TELJES KÓDOT AI ÍRTA, MERT CSAK 
// TESZTELNI AKARTAM A MŰKÖDÉST.

/**
 * Egyszeri dev script: feltölti a zenéket a lokális bee-dev node-ra,
 * és kiírja a hash-eket amit a songs.json-ba kell másolni.
 *
 * Használat:
 *   npx tsx src/swarm/uploadToSwarm.ts
 */

import { Bee } from "@ethersphere/bee-js";
import fs from "fs";
import path from "path";

const BEE_URL = "http://localhost:1633";

// a feltöltendő fájlok listája
// src: a projekt gyökeréhez képest relatív path
// songId: a songs.json-ban lévő id (csak a loghoz)
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

    // node elérhetőség ellenőrzése
    console.log("🔍 Bee node ellenőrzése...");
    try {
        const connected = await bee.isConnected();
        if (!connected) throw new Error("Node not connected");
        console.log("✅ Bee node elérhető:", BEE_URL);
    } catch {
        console.error("❌ Bee node nem elérhető:", BEE_URL);
        console.error("   Indítsd el: bee-dev start");
        process.exit(1);
    }

    // stamp lekérése – dev node-on automatikusan létezik egy
    console.log("\n📦 Stamp lekérése...");
    let batchId: string;
    try {
        const stamps = await bee.getAllPostageBatch();
        if (!stamps.length) throw new Error("Nincs elérhető stamp");
        batchId = stamps[0].batchID.toHex();
        console.log("✅ Stamp ID:", batchId);
    } catch (err) {
        console.error("❌ Stamp lekérés sikertelen:", err);
        process.exit(1);
    }

    // feltöltések
    console.log("\n🚀 Feltöltés megkezdése...\n");
    const results: { songId: string; title: string; hash: string }[] = [];

    for (const song of SONGS) {
        const filePath = path.resolve(process.cwd(), song.src);

        // fájl létezés ellenőrzése
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  Fájl nem található, kihagyva: ${filePath}`);
            continue;
        }

        console.log(`📤 Feltöltés: ${song.title}`);
        console.log(`   Fájl: ${filePath}`);

        try {
            const fileData = fs.readFileSync(filePath);
            const fileSizeMB = (fileData.length / 1024 / 1024).toFixed(2);
            console.log(`   Méret: ${fileSizeMB} MB`);

            const result = await bee.uploadData(batchId as any, fileData);
            const hash = result.reference.toString();

            console.log(`   ✅ Hash: ${hash}\n`);
            results.push({ songId: song.songId, title: song.title, hash });
        } catch (err) {
            console.error(`   ❌ Feltöltés sikertelen: ${err}\n`);
        }
    }

    // összefoglaló – ezt kell a songs.json-ba másolni
    if (results.length === 0) {
        console.error("❌ Egy feltöltés sem sikerült.");
        process.exit(1);
    }

    console.log("═══════════════════════════════════════════════════");
    console.log("✅ KÉSZ – másold be a songs.json swarmHash mezőibe:");
    console.log("═══════════════════════════════════════════════════\n");

    results.forEach(({ songId, title, hash }) => {
        console.log(`Song ID ${songId} – ${title}`);
        console.log(`  "swarmHash": "${hash}"\n`);
    });

    // opcionális: automatikusan frissíti a songs.json-t
    // ha nem akarod, kommenteld ki ezt a blokkot
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
        console.log("📝 songs.json automatikusan frissítve.");
    } catch (err) {
        console.warn("⚠️  songs.json automatikus frissítés sikertelen – másold be kézzel.");
        console.warn("   Hiba:", err);
    }
}

uploadAll();