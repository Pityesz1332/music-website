// TESZT
// ez a fájl kezeli a Swarm-mal kapcsolatos interakciót.
// a frontend komponensek (pl. UploadSong.tsx) csak ezt hívják meg.
import { Bee, Reference, PostageBatch, Data } from "@ethersphere/bee-js";

export interface SongMetadata {
    title: string;
    artist: string;
    duration?: number;
    albumArtHash?: string;
    genre?: string;
}

export interface SwarmSong {
    reference: string;
    metadata: SongMetadata;
}

// csatlakozás a Bee node-hoz (Bee SDK inicializálása)
const BEE_URL = "http://localhost:1633";
const bee = new Bee(BEE_URL);

export const swarmService = {
    async checkConnection(): Promise<boolean> {
        try {
            await bee.checkConnection();
            return true;
        } catch (error) {
            console.error("Bee node not available:", error);
            return false;
        }
    },
    
    // getAudioFile(hash): 
    // letölti a chunkokat a Swarm-ról a megadott referencia alapján.
    // blob-bá alakítja az adatot, amit a Playbar.tsx már le tud játszani.
    async getAudioFile(hash: string): Promise<string> {
        try {
            const fileData = await bee.downloadFile(hash);
            const bytes = fileData.data.toUint8Array();
            const blob = new Blob([bytes as any], { type: 'audio/*' });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error("Error during download:", error);
            throw error;
        }
    },
    
    // uploadAudioFile(file, metadata):
    // beállítja a Postage Batch-et (a feltöltéshez szükséges bélyeget).
    // feltölti a fájlt és a hozzá tartozó JSON metaadatokat.
    // visszaadja a Swarm referenciát (Hash).
    async uploadAudioFile(
        file: File,
        metadata: SongMetadata,
        batchId: string
    ): Promise<Reference> {
        try {
            const fileResult = await bee.uploadFile(batchId, file, file.name, {
                contentType: file.type,
            });

            const metaResult = await bee.uploadData(batchId, JSON.stringify({
                ...metadata,
                audioReference: fileResult.reference
            }));

            return metaResult.reference;
        } catch (error) {
            console.error("Upload error", error);
            throw error;
        }
    },

    // listSongs():
    // ha nincs backend, egy feed-ből vagy egy fix hash-ről olvassa be a legutóbbi listát.
    async listSongs(topic: string = "playlist-01"): Promise<SwarmSong[]> {
        try {
            console.warn("listSongs: Default implementation needed.");
            return [];
        } catch (error) {
            console.error("Error listing songs:", error);
            return [];
        }
    }
};
