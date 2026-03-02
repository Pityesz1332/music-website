import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePlaylistActions } from "./usePlaylistActions";
import { NotificationType } from "../../context/NotificationContext";
import { PLAYLIST_ACTIONS_STRINGS } from "../../constant-strings/hooks/playlistActions";
import type { Song } from "../../types/music";

describe("usePlaylistActions", () => {
  const mockSongs: Song[] = [
    {
        id: "1",
        title: "",
        artist: "",
        genre: "",
        duration: "",
        cover: "",
        src: "",
        defaultBgVideo: "",
        playingBgVideo: ""
    },
    {
        id: "2",
        title: "",
        artist: "",
        genre: "",
        duration: "",
        cover: "",
        src: "",
        defaultBgVideo: "",
        playingBgVideo: ""
    }
  ];

  const defaultProps = {
    playlist: mockSongs,
    setPlaylist: vi.fn(),
    currentSong: mockSongs[0],
    nextSong: vi.fn(),
    notify: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "confirm").mockImplementation(() => true);
  });

  it("should open context menu and prevent default browser behavior", () => {
    const { result } = renderHook(() => usePlaylistActions(defaultProps));
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200,
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.handleContextMenu(mockEvent, "1");
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(result.current.contextMenu).toEqual({ x: 100, y: 200, songId: "1" });
  });

  it("should enable and disable editing mode", () => {
    const { result } = renderHook(() => usePlaylistActions(defaultProps));

    act(() => {
      result.current.handleEdit("1");
    });
    expect(result.current.editingSongId).toBe("1");
    expect(result.current.contextMenu).toBeNull();

    const mockEvent = { stopPropagation: vi.fn() } as unknown as React.MouseEvent;
    act(() => {
      result.current.closeEditMode(mockEvent);
    });
    expect(result.current.editingSongId).toBeNull();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it("should move a song up in the playlist", () => {
    const { result } = renderHook(() => usePlaylistActions(defaultProps));
    const mockEvent = { stopPropagation: vi.fn() } as unknown as React.MouseEvent;

    act(() => {
      result.current.moveSong(mockEvent, "up", "2");
    });

    const expectedPlaylist = [mockSongs[1], mockSongs[0]];
    expect(defaultProps.setPlaylist).toHaveBeenCalledWith(expectedPlaylist);
  });

  it("should move a song down in the playlist", () => {
    const { result } = renderHook(() => usePlaylistActions(defaultProps));
    const mockEvent = { stopPropagation: vi.fn() } as unknown as React.MouseEvent;

    act(() => {
      result.current.moveSong(mockEvent, "down", "1");
    });

    const expectedPlaylist = [mockSongs[1], mockSongs[0]];
    expect(defaultProps.setPlaylist).toHaveBeenCalledWith(expectedPlaylist);
  });

  it("should not move song if it is at the boundary", () => {
    const { result } = renderHook(() => usePlaylistActions(defaultProps));
    const mockEvent = { stopPropagation: vi.fn() } as unknown as React.MouseEvent;

    act(() => {
      result.current.moveSong(mockEvent, "up", "1");
    });

    expect(defaultProps.setPlaylist).not.toHaveBeenCalled();
  });

  it("should delete a song and show notification on confirmation", () => {
    const { result } = renderHook(() => usePlaylistActions(defaultProps));

    act(() => {
      result.current.handleDelete("2");
    });

    expect(window.confirm).toHaveBeenCalled();
    expect(defaultProps.setPlaylist).toHaveBeenCalledWith([mockSongs[0]]);
    expect(defaultProps.notify).toHaveBeenCalledWith(
      PLAYLIST_ACTIONS_STRINGS.MESSAGE,
      NotificationType.SUCCESS
    );
  });

  it("should skip to next song if the currently playing song is deleted", () => {
    const { result } = renderHook(() => usePlaylistActions(defaultProps));

    act(() => {
      result.current.handleDelete("1");
    });

    expect(defaultProps.nextSong).toHaveBeenCalled();
  });

  it("should do nothing if delete confirmation is cancelled", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { result } = renderHook(() => usePlaylistActions(defaultProps));

    act(() => {
      result.current.handleDelete("1");
    });

    expect(defaultProps.setPlaylist).not.toHaveBeenCalled();
    expect(defaultProps.notify).not.toHaveBeenCalled();
  });

  it("should close context menu when clicking outside", () => {
    const { result } = renderHook(() => usePlaylistActions(defaultProps));

    const menuElement = document.createElement("div");
    document.body.appendChild(menuElement);

    act(() => {
      result.current.menuRef.current = menuElement;
      result.current.setContextMenu({ x: 0, y: 0, songId: "1" });
    });

    act(() => {
      document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(result.current.contextMenu).toBeNull();
  });
});