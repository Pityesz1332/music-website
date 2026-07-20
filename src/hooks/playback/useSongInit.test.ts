import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSongInit } from "./useSongInit";
import songsData from "../../data/songs.json";
import { useLocation } from "react-router-dom";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn()
}));

describe("useSongInit", () => {
  let setPlaylistMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    setPlaylistMock = vi.fn();
  });

  it("uses playlist from router state if provided", () => {
    (useLocation as any).mockReturnValue({
      state: { playlist: [{ id: "1", title: "Test" }] }
    });

    renderHook(() =>
      useSongInit({
        playlist: [],
        setPlaylist: setPlaylistMock
      })
    );

    expect(setPlaylistMock).toHaveBeenCalledWith([
      { id: "1", title: "Test" }
    ]);
  });

  it("uses default songsData if playlist empty and no state", () => {
    (useLocation as any).mockReturnValue({
      state: {}
    });

    renderHook(() =>
      useSongInit({
        playlist: [],
        setPlaylist: setPlaylistMock
      })
    );

    expect(setPlaylistMock).toHaveBeenCalledWith(
      songsData as any
    );
  });

  it("does nothing if playlist already exists", () => {
    (useLocation as any).mockReturnValue({
      state: {}
    });

    renderHook(() =>
      useSongInit({
        playlist: [{ id: "1", title: "Existing" }] as any,
        setPlaylist: setPlaylistMock
      })
    );

    expect(setPlaylistMock).not.toHaveBeenCalled();
  });
});