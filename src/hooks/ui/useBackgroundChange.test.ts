import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useBackgroundChange } from "./useBackgroundChange";
import type { Background } from "../../types/background";

describe("useBackgroundChange", () => {
    const mockBackgrounds: Background[] = [
        { type: "image", src: "test1.jpg" },
        { type: "video", src: "test2.mp4" },
        { type: "image", src: "test3.jpg" }
    ];

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should initialize with default values", () => {
        const { result } = renderHook(() => useBackgroundChange(mockBackgrounds));

        expect(result.current.bgIndex).toBe(0);
        expect(result.current.backgrounds).toEqual(mockBackgrounds);
    });

    it("should increment index after specified interval", () => {
        const interval = 3000;
        const { result } = renderHook(() => useBackgroundChange(mockBackgrounds, interval));

        act(() => {
            vi.advanceTimersByTime(interval);
        });
        expect(result.current.bgIndex).toBe(1);

        act(() => {
            vi.advanceTimersByTime(interval);
        });
        expect(result.current.bgIndex).toBe(2);
    });

    it("should reset index to 0 when reaching the end of the array", () => {
        const { result } = renderHook(() => useBackgroundChange(mockBackgrounds, 5000));

        act(() => {
            vi.advanceTimersByTime(5000 * 3);
        });

        expect(result.current.bgIndex).toBe(0);
    });

    it("should not start interval if backgrounds length is 1 or less", () => {
        const singleBg: Background[] = [{ type: "image", src: "only-one.jpg" }];
        const { result } = renderHook(() => useBackgroundChange(singleBg));

        act(() => {
            vi.advanceTimersByTime(10000);
        });

        expect(result.current.bgIndex).toBe(0);
    });

    it("should cleanup interval on unmount", () => {
        const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
        const { unmount } = renderHook(() => useBackgroundChange(mockBackgrounds));

        unmount();

        expect(clearIntervalSpy).toHaveBeenCalled();
    });
});