import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePlayback } from "./usePlayback";

describe("usePlayback", () => {
  const songA = { id: "1", title: "A" } as any;
  const songB = { id: "2", title: "B" } as any;
  const songC = { id: "3", title: "C" } as any;

  let setCurrentSong: any;
  let setIsPlaying: any;
  let addToRecentlyPlayed: any;

  const createPlayback = (overrides = {}) =>
    usePlayback({
      currentSong: songA,
      isPlaying: false,
      playlist: [songA, songB, songC],
      setCurrentSong,
      setIsPlaying,
      addToRecentlyPlayed,
      ...overrides,
    });

  beforeEach(() => {
    setCurrentSong = vi.fn();
    setIsPlaying = vi.fn();
    addToRecentlyPlayed = vi.fn();
  });

  it("playSong: new song sets current + recentlyPlayed + playing", () => {
    const playback = createPlayback();

    playback.playSong(songB);

    expect(setCurrentSong).toHaveBeenCalledWith(songB);
    expect(addToRecentlyPlayed).toHaveBeenCalledWith(songB);
    expect(setIsPlaying).toHaveBeenCalledWith(true);
  });

  it("playSong: same song does not reset current but sets playing", () => {
    const playback = createPlayback({ currentSong: songA });

    playback.playSong(songA);

    expect(setCurrentSong).not.toHaveBeenCalled();
    expect(addToRecentlyPlayed).not.toHaveBeenCalled();
    expect(setIsPlaying).toHaveBeenCalledWith(true);
  });

  it("togglePlay: toggles playing state", () => {
    const playback = createPlayback({ isPlaying: false });

    playback.togglePlay();
    expect(setIsPlaying).toHaveBeenCalledWith(true);
  });

  it("nextSong: moves to next track", () => {
    const playback = createPlayback({ currentSong: songA });

    playback.nextSong();

    expect(setCurrentSong).toHaveBeenCalledWith(songB);
    expect(setIsPlaying).toHaveBeenCalledWith(true);
  });

  it("nextSong: wraps to first track", () => {
    const playback = createPlayback({ currentSong: songC });

    playback.nextSong();

    expect(setCurrentSong).toHaveBeenCalledWith(songA);
  });

  it("prevSong: moves to previous track", () => {
    const playback = createPlayback({ currentSong: songB });

    playback.prevSong();

    expect(setCurrentSong).toHaveBeenCalledWith(songA);
  });

  it("prevSong: wraps to last track", () => {
    const playback = createPlayback({ currentSong: songA });

    playback.prevSong();

    expect(setCurrentSong).toHaveBeenCalledWith(songC);
  });

  it("does nothing if playlist empty", () => {
    const playback = usePlayback({
      currentSong: songA,
      isPlaying: false,
      playlist: [],
      setCurrentSong,
      setIsPlaying,
      addToRecentlyPlayed,
    });

    playback.nextSong();
    playback.prevSong();

    expect(setCurrentSong).not.toHaveBeenCalled();
  });

  it("does nothing if no currentSong", () => {
    const playback = usePlayback({
      currentSong: null,
      isPlaying: false,
      playlist: [songA, songB],
      setCurrentSong,
      setIsPlaying,
      addToRecentlyPlayed,
    });

    playback.nextSong();
    playback.prevSong();

    expect(setCurrentSong).not.toHaveBeenCalled();
  });
});