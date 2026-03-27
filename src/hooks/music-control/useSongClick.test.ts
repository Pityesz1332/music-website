import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNavigate } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import { useSongClick } from "./useSongClick";
import { getSongPath } from "../../routes/constants/MainRoutes";
import type { Song } from "../../types/music";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../../context/MusicContext", () => ({
  useMusic: vi.fn(),
}));

vi.mock("../../routes/constants/MainRoutes", () => ({
  getSongPath: vi.fn((id: string) => `/song/${id}`),
}));

describe("useSongClick", () => {
  const mockNavigate = vi.fn();
  const mockPlaySong = vi.fn();
  const mockSetPlaylist = vi.fn();
  
  const mockSong: Song = {
    id: "123",
    title: "",
    artist: "",
    genre: "",
    duration: "",
    cover: "",
    src: "",
    defaultBgVideo: "",
    playingBgVideo: "",
  };

  const mockPlaylist: Song[] = [mockSong];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useMusic).mockReturnValue({
      playSong: mockPlaySong,
      playlist: mockPlaylist,
      setPlaylist: mockSetPlaylist,
    } as any);
  });

  it("should handle standard song click correctly", () => {
    const { result } = renderHook(() => useSongClick());

    act(() => {
      result.current.handleSongClick(mockSong);
    });

    expect(mockPlaySong).toHaveBeenCalledWith(mockSong);
    expect(getSongPath).toHaveBeenCalledWith(mockSong.id);
    expect(mockNavigate).toHaveBeenCalledWith("/song/123", {
      state: { song: mockSong, playlist: mockPlaylist }
    });
  });

  it("should handle filtered song click correctly", () => {
    const { result } = renderHook(() => useSongClick());
    const newPlaylist = [mockSong, { ...mockSong, id: "456" }];

    act(() => {
      result.current.handleFilteredSongClick(mockSong, newPlaylist);
    });

    expect(mockSetPlaylist).toHaveBeenCalledWith(newPlaylist);
    expect(mockPlaySong).toHaveBeenCalledWith(mockSong);
    expect(mockNavigate).toHaveBeenCalledWith("/song/123", {
      state: { song: mockSong, playlist: newPlaylist }
    });
  });
});