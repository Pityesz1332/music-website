import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePlaybarInteractions } from "./usePlaybarInteractions";

describe("usePlaybarInteractions", () => {
  let playbarMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    playbarMock = {
      current: {
        contains: vi.fn()
      }
    };
  });

  it("initial state: collapsed", () => {
    const { result } = renderHook(() =>
      usePlaybarInteractions(playbarMock)
    );

    expect(result.current.isManuallyCollapsed).toBe(true);
  });

  it("toggles collapse when tapping non-interactive area", () => {
    const { result } = renderHook(() =>
      usePlaybarInteractions(playbarMock)
    );

    const mockEvent = {
      target: {
        closest: vi.fn().mockReturnValue(null)
      }
    } as any;

    act(() => {
      result.current.handlePlaybarTap(mockEvent);
    });

    expect(result.current.isManuallyCollapsed).toBe(false);
  });

  it("does not toggle when clicking button", () => {
    const { result } = renderHook(() =>
      usePlaybarInteractions(playbarMock)
    );

    const mockEvent = {
      target: {
        closest: vi.fn().mockReturnValue(true)
      }
    } as any;

    act(() => {
      result.current.handlePlaybarTap(mockEvent);
    });

    expect(result.current.isManuallyCollapsed).toBe(true);
  });

  it("adds and removes wheel event listener", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() =>
      usePlaybarInteractions(playbarMock)
    );

    expect(addSpy).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function),
      { passive: false }
    );

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function)
    );
  });

  it("prevents default when wheel is inside playbar", () => {
    const preventDefaultMock = vi.fn();

    let capturedHandler: any;

    vi.spyOn(window, "addEventListener").mockImplementation(
      (_event, handler: any) => {
        capturedHandler = handler;
      }
    );

    playbarMock.current.contains.mockReturnValue(true);

    renderHook(() =>
      usePlaybarInteractions(playbarMock)
    );

    const fakeEvent = {
      target: {},
      preventDefault: preventDefaultMock
    };

    act(() => {
      capturedHandler(fakeEvent);
    });

    expect(preventDefaultMock).toHaveBeenCalled();
  });
});