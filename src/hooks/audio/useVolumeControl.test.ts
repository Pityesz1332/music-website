import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useVolumeControl } from "./useVolumeControl";

describe("useVolumeControl", () => {
  let audioMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    audioMock = {
      volume: 1
    };
  });

  const render = () =>
    renderHook(() =>
      useVolumeControl({ current: audioMock })
    );

  it("initial volume is 1", () => {
    const { result } = render();
    expect(result.current.volume).toBe(1);
  });

  it("updateVolume clamps between 0 and 1 and updates audio", () => {
    const { result } = render();

    act(() => {
      result.current.updateVolume(2);
    });

    expect(result.current.volume).toBe(1);
    expect(audioMock.volume).toBe(1);

    act(() => {
      result.current.updateVolume(-1);
    });

    expect(result.current.volume).toBe(0);
    expect(audioMock.volume).toBe(0);
  });

  it("handleVolumeChanger updates volume from input", () => {
    const { result } = render();

    const event = {
      target: { value: "0.5" }
    } as any;

    act(() => {
      result.current.handleVolumeChanger(event);
    });

    expect(result.current.volume).toBe(0.5);
    expect(audioMock.volume).toBe(0.5);
  });

  it("adjustVolume decreases volume", () => {
    const { result } = render();

    act(() => {
      result.current.adjustVolume(1);
    });

    expect(result.current.volume).toBeLessThan(1);
  });

  it("drag start sets dragging and updates volume", () => {
    const { result } = render();

    const event = {
      currentTarget: {
        getBoundingClientRect: () => ({
          left: 0,
          width: 200
        })
      },
      clientX: 100
    } as any;

    act(() => {
      result.current.handleVolumeDragStart(event);
    });

    expect(result.current.isDragging).toBe(true);
    expect(result.current.volume).toBe(0.5);
  });

  it("drag end stops dragging", () => {
    const { result } = render();

    act(() => {
      result.current.handleVolumeDragEnd();
    });

    expect(result.current.isDragging).toBe(false);
  });

  it("adds and removes global mouse listeners when dragging", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { result } = render();

    act(() => {
      result.current.handleVolumeDragStart({
        currentTarget: {
          getBoundingClientRect: () => ({
            left: 0,
            width: 200
          })
        },
        clientX: 100
      } as any);
    });

    expect(addSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );

    act(() => {
      result.current.handleVolumeDragEnd();
    });

    expect(removeSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );
  });
});