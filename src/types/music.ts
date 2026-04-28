export interface Song {
    id: string;
    title: string;
    artist: string;
    genre: string;
    src: string;
    swarmHash?: string;
    cover: string;
    duration: string;
    defaultBgVideo: string;
    playingBgVideo: string;
}