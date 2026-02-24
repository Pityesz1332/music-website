import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useSaveSong } from "./useSaveSong";
import type { Song } from "../../types/music";

describe("useSaveSong", () => {
  const mockSong: Song = {
    id: "1",
    title: "Test Song",
    artist: "Test Artist",
    genre: "Mix",
    duration: "10",
    cover: "cover.jpg",
    src: "test.mp3",
    defaultBgVideo: "",
    playingBgVideo: ""
  };

  it("should initialize with an empty array", () => {
    const { result } = renderHook(() => useSaveSong());
    expect(result.current.savedSongs).toEqual([]);
  });

  it("should add a song to the saved list", () => {
    const { result } = renderHook(() => useSaveSong());

    act(() => {
      result.current.saveSong(mockSong);
    });

    expect(result.current.savedSongs).toHaveLength(1);
    expect(result.current.savedSongs[0]).toEqual(mockSong);
  });

  it("should not add the same song twice", () => {
    const { result } = renderHook(() => useSaveSong());

    act(() => {
      result.current.saveSong(mockSong);
    });
    
    act(() => {
      result.current.saveSong(mockSong);
    });

    expect(result.current.savedSongs).toHaveLength(1);
  });

  it("should remove a song by id", () => {
    const { result } = renderHook(() => useSaveSong());

    act(() => {
      result.current.saveSong(mockSong);
    });

    expect(result.current.savedSongs).toHaveLength(1);

    act(() => {
      result.current.removeSavedSong("1");
    });

    expect(result.current.savedSongs).toHaveLength(0);
  });

  it("should do nothing when trying to remove a non-existent id", () => {
    const { result } = renderHook(() => useSaveSong());

    act(() => {
      result.current.saveSong(mockSong);
    });

    act(() => {
      result.current.removeSavedSong("non-existent-id");
    });

    expect(result.current.savedSongs).toHaveLength(1);
  });
});