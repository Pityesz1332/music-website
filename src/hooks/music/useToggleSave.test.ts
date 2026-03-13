import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useToggleSave } from "./useToggleSave";
import { useNotification, NotificationType } from "../../context/NotificationContext";
import { useMusic } from "../../context/MusicContext";
import { TOGGLE_SAVE_STRINGS } from "../../i18n/feedback/toggle-save";
import type { Song } from "../../types/music";

vi.mock("../../context/NotificationContext", () => ({
  useNotification: vi.fn(),
  NotificationType: {
    SUCCESS: "success",
    ERROR: "error",
  },
}));

vi.mock("../../context/MusicContext", () => ({
  useMusic: vi.fn(),
}));

describe("useToggleSave", () => {
  const mockNotify = vi.fn();
  const mockSaveSong = vi.fn();
  const mockRemoveSavedSong = vi.fn();
  
  const mockSong: Song = {
    id: "123",
    title: "",
    artist: "",
    genre: "",
    duration: "",
    cover: "",
    src: "",
    defaultBgVideo: "",
    playingBgVideo: ""
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNotification).mockReturnValue({ notify: mockNotify } as any);
  });

  it("should save the song and notify when it is not already saved", () => {
    vi.mocked(useMusic).mockReturnValue({
      savedSongs: [],
      saveSong: mockSaveSong,
      removeSavedSong: mockRemoveSavedSong,
    } as any);

    const { result } = renderHook(() => useToggleSave());

    act(() => {
      result.current.toggleSave(mockSong);
    });

    expect(mockSaveSong).toHaveBeenCalledWith(mockSong);
    expect(mockNotify).toHaveBeenCalledWith(
      TOGGLE_SAVE_STRINGS.MESSAGES.SAVE,
      NotificationType.SUCCESS
    );
    expect(mockRemoveSavedSong).not.toHaveBeenCalled();
  });

  it("should remove the song and notify when it is already saved", () => {
    vi.mocked(useMusic).mockReturnValue({
      savedSongs: [mockSong],
      saveSong: mockSaveSong,
      removeSavedSong: mockRemoveSavedSong,
    } as any);

    const { result } = renderHook(() => useToggleSave());

    act(() => {
      result.current.toggleSave(mockSong);
    });

    expect(mockRemoveSavedSong).toHaveBeenCalledWith(mockSong.id);
    expect(mockNotify).toHaveBeenCalledWith(
      TOGGLE_SAVE_STRINGS.MESSAGES.DELETE,
      NotificationType.SUCCESS
    );
    expect(mockSaveSong).not.toHaveBeenCalled();
  });
});