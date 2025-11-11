    // Dummy data (20, tesztelés miatt)
export const songsData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Song Title ${i + 1}`,
    artist: ["Aether", "Nova", "Echo", "Luna", "Pulse"][i % 5],
    genre: ["Pop", "Rock", "Electronic", "Hip-Hop", "Ambient"][i % 5],
    image: `/dummy${(i % 3) + 1}.jpg`,
    description: "A mesmerizing track that blends ethereal melodies with modern beats.",
    audio: `/audio${(i % 3) + 1}.mp3`,
    duration: `${3 + (i % 3)}:${(30 + i) % 60}`
    }));