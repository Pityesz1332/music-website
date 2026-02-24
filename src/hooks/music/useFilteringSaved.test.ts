import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLocation } from "react-router-dom";
import { useFilteringSaved } from "./useFilteringSaved";
import type { Song } from "../../types/music";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(),
}));

describe("useFilteringSaved", () => {
  const mockSongs: Song[] = Array.from({ length: 40 }, (_, i) => ({
    id: i.toString(),
    title: `Song ${i + 1}`,
    artist: "",
    genre: "",
    duration: "",
    cover: "",
    src: "",
    defaultBgVideo: "",
    playingBgVideo: ""
  }));

  beforeEach(() => {
    vi.mocked(useLocation).mockReturnValue({ search: "" } as any);
  });

  it("should initialize with default values and first page of songs", () => {
    const { result } = renderHook(() => useFilteringSaved(mockSongs));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.itemsPerPage).toBe(15);
    expect(result.current.currentSongs).toHaveLength(15);
    expect(result.current.totalPages).toBe(3);
  });

  it("should filter songs based on search query in URL", () => {
    vi.mocked(useLocation).mockReturnValue({ search: "?search=Song 1" } as any);
    
    const { result } = renderHook(() => useFilteringSaved(mockSongs));

    expect(result.current.searchQuery).toBe("song 1");
    expect(result.current.filteredSongs.every(s => s.title.toLowerCase().includes("song 1"))).toBe(true);
  });

  it("should reset to page 1 when search query changes", () => {
    const { result, rerender } = renderHook(() => useFilteringSaved(mockSongs));

    act(() => {
      result.current.nextPage();
    });
    expect(result.current.currentPage).toBe(2);

    vi.mocked(useLocation).mockReturnValue({ search: "?search=new" } as any);
    rerender();

    expect(result.current.currentPage).toBe(1);
  });

  it("should handle pagination correctly", () => {
    const { result } = renderHook(() => useFilteringSaved(mockSongs));

    act(() => {
      result.current.nextPage();
    });
    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentSongs[0].title).toBe("Song 16");

    act(() => {
      result.current.prevPage();
    });
    expect(result.current.currentPage).toBe(1);
  });

  it("should not go beyond total pages or below page 1", () => {
    const { result } = renderHook(() => useFilteringSaved(mockSongs));

    act(() => {
      result.current.prevPage();
    });
    expect(result.current.currentPage).toBe(1);

    act(() => { result.current.nextPage(); });
    act(() => { result.current.nextPage(); });
    expect(result.current.currentPage).toBe(3);

    act(() => { result.current.nextPage(); });
    expect(result.current.currentPage).toBe(3);
  });

  it("should calculate startIndex and slice songs correctly", () => {
    const { result } = renderHook(() => useFilteringSaved(mockSongs));
    
    expect(result.current.currentSongs[0].id).toBe("0");
    expect(result.current.currentSongs[14].id).toBe("14");

    act(() => {
      result.current.setCurrentPage(3);
    });

    expect(result.current.currentSongs).toHaveLength(10);
    expect(result.current.currentSongs[0].id).toBe("30");
  });
});