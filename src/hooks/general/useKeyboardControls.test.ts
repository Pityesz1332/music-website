import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useKeyboardControls } from "./useKeyboardControls";

describe("useKeyboardControls", () => {
  const mockAudio = {
    currentTime: 10,
    duration: 100,
  } as unknown as HTMLAudioElement;

  const defaultProps = {
    audioRef: { current: mockAudio } as React.RefObject<HTMLAudioElement>,
    isPlaying: false,
    volume: 0.5,
    updateVolume: vi.fn(),
    handlePlay: vi.fn(),
    songExist: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fireKeyDown = (code: string, target: HTMLElement = document.body) => {
    const event = new KeyboardEvent("keydown", { code, bubbles: true });
    Object.defineProperty(event, "target", { value: target, enumerable: true });
    window.dispatchEvent(event);
    return event;
  };

  it("should call handlePlay when Space is pressed", () => {
    renderHook(() => useKeyboardControls(defaultProps));
    fireKeyDown("Space");
    expect(defaultProps.handlePlay).toHaveBeenCalledTimes(1);
  });

  it("should increase volume when ArrowUp is pressed", () => {
    renderHook(() => useKeyboardControls({ ...defaultProps, volume: 0.5 }));
    fireKeyDown("ArrowUp");
    expect(defaultProps.updateVolume).toHaveBeenCalledWith(0.6);
  });

  it("should decrease volume when ArrowDown is pressed", () => {
    renderHook(() => useKeyboardControls({ ...defaultProps, volume: 0.5 }));
    fireKeyDown("ArrowDown");
    expect(defaultProps.updateVolume).toHaveBeenCalledWith(0.4);
  });

  it("should seek backward when ArrowLeft is pressed", () => {
    renderHook(() => useKeyboardControls(defaultProps));
    fireKeyDown("ArrowLeft");
    expect(mockAudio.currentTime).toBe(5);
  });

  it("should seek forward when ArrowRight is pressed", () => {
    renderHook(() => useKeyboardControls(defaultProps));
    fireKeyDown("ArrowRight");
    expect(mockAudio.currentTime).toBe(10);
  });

  it("should do nothing if songExist is false", () => {
    renderHook(() => useKeyboardControls({ ...defaultProps, songExist: false }));
    fireKeyDown("Space");
    expect(defaultProps.handlePlay).not.toHaveBeenCalled();
  });

  it("should ignore keydown events if user is typing in an input", () => {
    renderHook(() => useKeyboardControls(defaultProps));
    const input = document.createElement("input");
    fireKeyDown("Space", input);
    expect(defaultProps.handlePlay).not.toHaveBeenCalled();
  });

  it("should ignore keydown events if user is typing in a textarea", () => {
    renderHook(() => useKeyboardControls(defaultProps));
    const textarea = document.createElement("textarea");
    fireKeyDown("Space", textarea);
    expect(defaultProps.handlePlay).not.toHaveBeenCalled();
  });

  it("should cleanup event listener on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useKeyboardControls(defaultProps));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  it("should cap volume at 1.0", () => {
    renderHook(() => useKeyboardControls({ ...defaultProps, volume: 0.95 }));
    fireKeyDown("ArrowUp");
    expect(defaultProps.updateVolume).toHaveBeenCalledWith(1);
  });

  it("should floor volume at 0.0", () => {
    renderHook(() => useKeyboardControls({ ...defaultProps, volume: 0.05 }));
    fireKeyDown("ArrowDown");
    expect(defaultProps.updateVolume).toHaveBeenCalledWith(0);
  });
});