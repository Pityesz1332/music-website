import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAudioSync } from "./useAudioSync";
import { useMusic } from "../../context/MusicContext";

vi.mock("../../context/MusicContext", () => ({
  useMusic: vi.fn(),
}));

describe("useAudioSync", () => {
  let audioMock: any;
  const resetSongMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    audioMock = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      load: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      paused: true,
    };
  });

  const render = () =>
    renderHook(() =>
      useAudioSync({ current: audioMock }, resetSongMock)
    );

  it("initial state: isLoading false", () => {
    (useMusic as any).mockReturnValue({
      isPlaying: false,
      currentSong: null,
      togglePlay: vi.fn(),
    });

    const { result } = render();

    expect(result.current.isLoading).toBe(false);
  });

  it("handlePlay: sets loading and calls togglePlay", () => {
    const togglePlayMock = vi.fn();

    (useMusic as any).mockReturnValue({
      isPlaying: false,
      currentSong: { src: "test.mp3" },
      togglePlay: togglePlayMock,
    });

    const { result } = render();

    act(() => {
      result.current.handlePlay();
    });

    expect(result.current.isLoading).toBe(true);
    expect(togglePlayMock).toHaveBeenCalledTimes(1);
  });

  it("handlePlay: does nothing if no currentSong", () => {
    const togglePlayMock = vi.fn();

    (useMusic as any).mockReturnValue({
      isPlaying: false,
      currentSong: null,
      togglePlay: togglePlayMock,
    });

    const { result } = render();

    act(() => {
      result.current.handlePlay();
    });

    expect(togglePlayMock).not.toHaveBeenCalled();
  });

  it("currentSong change: resets song, loads audio, registers listener", () => {
    (useMusic as any).mockReturnValue({
      isPlaying: true,
      currentSong: { src: "test.mp3" },
      togglePlay: vi.fn(),
    });

    render();

    expect(resetSongMock).toHaveBeenCalled();
    expect(audioMock.load).toHaveBeenCalled();
    expect(audioMock.addEventListener).toHaveBeenCalledWith(
      "canplay",
      expect.any(Function)
    );
  });

  it("cleanup removes event listener", () => {
    (useMusic as any).mockReturnValue({
      isPlaying: true,
      currentSong: { src: "test.mp3" },
      togglePlay: vi.fn(),
    });

    const { unmount } = render();
    unmount();

    expect(audioMock.removeEventListener).toHaveBeenCalledWith(
      "canplay",
      expect.any(Function)
    );
  });

  it("plays when isPlaying true and audio paused", () => {
    audioMock.paused = true;

    (useMusic as any).mockReturnValue({
      isPlaying: true,
      currentSong: { src: "test.mp3" },
      togglePlay: vi.fn(),
    });

    render();

    expect(audioMock.play).toHaveBeenCalled();
  });

  it("pauses when isPlaying false and audio not paused", () => {
    audioMock.paused = false;

    (useMusic as any).mockReturnValue({
      isPlaying: false,
      currentSong: { src: "test.mp3" },
      togglePlay: vi.fn(),
    });

    render();

    expect(audioMock.pause).toHaveBeenCalled();
  });
});