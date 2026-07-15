import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLocation } from "react-router-dom";
import { useFilteringSongs } from "./useFilteringSongs";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(),
}));

vi.mock("../../data/songs.json", () => ({
  default: [
    { id: "1", title: "Base Song", genre: "Mix1" },
    { id: "2", title: "Another One", genre: "Mix2" },
  ],
}));

describe("useFilteringSongs", () => {
  beforeEach(() => {
    vi.mocked(useLocation).mockReturnValue({ search: "" } as any);
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("should load and merge songs from JSON and localStorage", async () => {
    const localSong = [{ id: "3", title: "Local Song", genre: "Mix3" }];
    window.localStorage.setItem("admin_songs", JSON.stringify(localSong));

    const { result } = renderHook(() => useFilteringSongs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.songs).toHaveLength(3);
    expect(result.current.genres).toEqual(["All", "Mix3", "Mix1", "Mix2"]);
  });

  it("should filter out duplicate IDs when merging", async () => {
    const duplicateSong = [{ id: "1", title: "Duplicate", genre: "Mix1" }];
    window.localStorage.setItem("admin_songs", JSON.stringify(duplicateSong));

    const { result } = renderHook(() => useFilteringSongs());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.songs).toHaveLength(2);
  });

  it("should filter songs by selected genre", async () => {
    const { result } = renderHook(() => useFilteringSongs());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleGenreChange("Mix1");
    });

    expect(result.current.selectedGenre).toBe("Mix1");
    expect(result.current.filteredSongs).toHaveLength(1);
    expect(result.current.filteredSongs[0].genre).toBe("Mix1");
  });

  it("should filter songs by search query from URL", async () => {
    vi.mocked(useLocation).mockReturnValue({ search: "?search=base" } as any);
    
    const { result } = renderHook(() => useFilteringSongs());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.searchQuery).toBe("base");
    expect(result.current.filteredSongs).toHaveLength(1);
    expect(result.current.filteredSongs[0].title).toBe("Base Song");
  });

  it("should handle pagination correctly", async () => {
    const { result } = renderHook(() => useFilteringSongs(1));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.totalPages).toBe(2);
    expect(result.current.currentSongs).toHaveLength(1);
    expect(result.current.currentSongs[0].id).toBe("1");

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentSongs[0].id).toBe("2");
  });

  it("should reset to page 1 when genre or search changes", async () => {
    const { result } = renderHook(() => useFilteringSongs(1));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setCurrentPage(2);
    });
    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.handleGenreChange("Mix2");
    });

    expect(result.current.currentPage).toBe(1);
  });

  it("should handle loading errors", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
      throw new Error("Storage full");
    });

    const { result } = renderHook(() => useFilteringSongs());

    await waitFor(() => {
      expect(result.current.error).toBe("Failed to load songs");
      expect(result.current.loading).toBe(false);
    });
  });

  it("should retry loading when retry is called", async () => {
    const { result } = renderHook(() => useFilteringSongs());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.retry();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});