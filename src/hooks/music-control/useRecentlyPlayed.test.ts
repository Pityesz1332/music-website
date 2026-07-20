import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRecentlyPlayed } from "./useRecentlyPlayed";
import type { Song } from "../../types/music";

const STORAGE_KEY = "recentlyPlayed";

describe("useRecentlyPlayed", () => {
  const mockSong1 = { id: "1", title: "Song 1" } as Song;
  const mockSong2 = { id: "2", title: "Song 2" } as Song;
  const mockSongs = Array.from({ length: 6 }, (_, i) => ({ id: `${i}`, title: `Song ${i}` } as Song));

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize with an empty array if localStorage is empty", () => {
    const { result } = renderHook(() => useRecentlyPlayed());
    expect(result.current.recentlyPlayed).toEqual([]);
  });

  it("should initialize with data from localStorage", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([mockSong1]));
    const { result } = renderHook(() => useRecentlyPlayed());
    expect(result.current.recentlyPlayed).toEqual([mockSong1]);
  });

  it("should add a song to the beginning of the list", () => {
    const { result } = renderHook(() => useRecentlyPlayed());

    act(() => {
      result.current.addToRecentlyPlayed(mockSong1);
    });
    act(() => {
      result.current.addToRecentlyPlayed(mockSong2);
    });

    expect(result.current.recentlyPlayed[0]).toEqual(mockSong2);
    expect(result.current.recentlyPlayed).toHaveLength(2);
  });

  it("should move existing song to the front if added again", () => {
    const { result } = renderHook(() => useRecentlyPlayed());

    act(() => {
      result.current.addToRecentlyPlayed(mockSong1);
      result.current.addToRecentlyPlayed(mockSong2);
    });
    
    act(() => {
      result.current.addToRecentlyPlayed(mockSong1);
    });

    expect(result.current.recentlyPlayed[0].id).toBe("1");
    expect(result.current.recentlyPlayed).toHaveLength(2);
  });

  it("should not exceed the maximum number of items (5)", () => {
    const { result } = renderHook(() => useRecentlyPlayed());

    act(() => {
      mockSongs.forEach(song => result.current.addToRecentlyPlayed(song));
    });

    expect(result.current.recentlyPlayed).toHaveLength(5);
    expect(result.current.recentlyPlayed.find(s => s.id === "0")).toBeUndefined();
  });

  it("should clear the recently played list", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([mockSong1]));
    const { result } = renderHook(() => useRecentlyPlayed());

    act(() => {
      result.current.clearRecentlyPlayed();
    });

    expect(result.current.recentlyPlayed).toEqual([]);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("[]");
  });

  it("should handle localStorage parsing errors gracefully", () => {
    window.localStorage.setItem(STORAGE_KEY, "invalid-json");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    const { result } = renderHook(() => useRecentlyPlayed());

    expect(result.current.recentlyPlayed).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should sync to localStorage when the list changes", () => {
    const { result } = renderHook(() => useRecentlyPlayed());

    act(() => {
      result.current.addToRecentlyPlayed(mockSong1);
    });

    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    expect(saved).toEqual([mockSong1]);
  });
});