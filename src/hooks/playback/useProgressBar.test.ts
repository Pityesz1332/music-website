import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProgressBar } from "./useProgressBar";

describe("useProgressBar", () => {
  let audioMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    audioMock = {
      currentTime: 50,
      duration: 200
    };
  });

  const render = () =>
    renderHook(() => useProgressBar({ current: audioMock }));

  it("initial state is correct", () => {
    const { result } = render();

    expect(result.current.progress).toBe(0);
    expect(result.current.currentTime).toBe(0);
    expect(result.current.isSeeking).toBe(false);
    expect(result.current.hoverTime).toBeNull();
  });

  it("calculateTimeFromX works correctly", () => {
    const { result } = render();

    const target = {
      getBoundingClientRect: () => ({
        left: 0,
        width: 200
      })
    } as any;

    const { percent, time } = result.current.calculateTimeFromX(100, target);

    expect(percent).toBe(0.5);
    expect(time).toBe(100);
  });

  it("startSeek sets seeking and progress", () => {
    const { result } = render();

    const target = {
      getBoundingClientRect: () => ({
        left: 0,
        width: 200
      })
    } as any;

    const event = {
      clientX: 100,
      currentTarget: target
    } as any;

    act(() => {
      result.current.startSeek(event);
    });

    expect(result.current.isSeeking).toBe(true);
    expect(result.current.progress).toBe(50);
  });

  it("handleMouseMove updates hover state", () => {
    const { result } = render();

    const target = {
      getBoundingClientRect: () => ({
        left: 0,
        width: 200
      })
    } as any;

    const event = {
      clientX: 100,
      currentTarget: target
    } as any;

    act(() => {
      result.current.handleMouseMove(event);
    });

    expect(result.current.hoverTime).not.toBeNull();
    expect(result.current.hoverPos).toBeGreaterThan(0);
  });

  it("resetSong resets audio and state", () => {
    audioMock.currentTime = 100;

    const { result } = render();

    act(() => {
      result.current.resetSong();
    });

    expect(audioMock.currentTime).toBe(0);
    expect(result.current.progress).toBe(0);
    expect(result.current.currentTime).toBe(0);
  });

  it("mouse up sets seeking false and applies time", () => {
    const setTimeSpy = vi.spyOn(audioMock, "currentTime", "set");

    const { result } = render();

    act(() => {
      result.current.setIsSeeking(true);
    });

    // manually trigger the global mouseup logic
    act(() => {
      window.dispatchEvent(new MouseEvent("mouseup"));
    });

    expect(setTimeSpy).toHaveBeenCalled();
    expect(result.current.isSeeking).toBe(false);
  });

  it("adds and removes global mouse listeners when seeking", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { result } = render();

    act(() => {
      result.current.setIsSeeking(true);
    });

    expect(addSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );

    act(() => {
      result.current.setIsSeeking(false);
    });

    expect(removeSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );
  });
});