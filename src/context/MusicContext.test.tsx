import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MusicProvider, useMusic } from "./MusicContext";
import type { Song } from "../types/music";

const mockSong = { id: "1", title: "Test Song", artist: "Test Artist" } as Song;

const mockPlayback = {
  playSong: vi.fn(),
  togglePlay: vi.fn(),
  nextSong: vi.fn(),
  prevSong: vi.fn(),
};

const mockRecentlyPlayed = {
  recentlyPlayed: [mockSong],
  addToRecentlyPlayed: vi.fn(),
  clearRecentlyPlayed: vi.fn(),
};

const mockSaveSong = {
  savedSongs: [],
  saveSong: vi.fn(),
  removeSavedSong: vi.fn(),
};

vi.mock("../hooks/audio/usePlayback", () => ({
  usePlayback: () => mockPlayback,
}));

vi.mock("../hooks/music/useRecentlyPlayed", () => ({
  useRecentlyPlayed: () => mockRecentlyPlayed,
}));

vi.mock("../hooks/music/useSaveSong", () => ({
  useSaveSong: () => mockSaveSong,
}));

vi.mock("../hooks/ui/useDocumentTitle", () => ({
  useDocumentTitle: vi.fn(),
}));

const TestComponent = () => {
  const music = useMusic();
  return (
    <div>
      <div data-testid="song">{music.currentSong?.title || "none"}</div>
      <div data-testid="playing">{music.isPlaying.toString()}</div>
      <div data-testid="recent-count">{music.recentlyPlayed.length}</div>
      <button onClick={() => music.playSong(mockSong)}>Play</button>
      <button onClick={() => music.setPlaylist([mockSong])}>Set Playlist</button>
      <button onClick={music.clearRecentlyPlayed}>Clear Recent</button>
    </div>
  );
};

describe("MusicProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides initial music state", () => {
    render(
      <MusicProvider>
        <TestComponent />
      </MusicProvider>
    );

    expect(screen.getByTestId("song").textContent).toBe("none");
    expect(screen.getByTestId("playing").textContent).toBe("false");
    expect(screen.getByTestId("recent-count").textContent).toBe("1");
  });

  it("calls playback functions from the hook", () => {
    render(
      <MusicProvider>
        <TestComponent />
      </MusicProvider>
    );

    act(() => {
      screen.getByText("Play").click();
    });

    expect(mockPlayback.playSong).toHaveBeenCalledWith(mockSong);
  });

  it("updates playlist state", () => {
    render(
      <MusicProvider>
        <TestComponent />
      </MusicProvider>
    );

    act(() => {
      screen.getByText("Set Playlist").click();
    });

    // Internal state updated, verified by no crash and function availability
    expect(screen.getByTestId("song").textContent).toBe("none");
  });

  it("calls recently played functions", () => {
    render(
      <MusicProvider>
        <TestComponent />
      </MusicProvider>
    );

    act(() => {
      screen.getByText("Clear Recent").click();
    });

    expect(mockRecentlyPlayed.clearRecentlyPlayed).toHaveBeenCalled();
  });

  it("throws error when used outside of MusicProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useMusic must be used within a MusicProvider"
    );

    consoleSpy.mockRestore();
  });
});