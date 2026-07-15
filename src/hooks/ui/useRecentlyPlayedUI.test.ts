import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useRecentlyPlayedUI } from "./useRecentlyPlayedUI";

describe("useRecentlyPlayedUI", () => {
    const mockList = [
        { id: 1, title: "Song 1" },
        { id: 2, title: "Song 2" },
        { id: 3, title: "Song 3" }
    ];

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should initialize with first item and fade true", () => {
        const { result } = renderHook(() => useRecentlyPlayedUI(mockList, false));

        expect(result.current.currentIndex).toBe(0);
        expect(result.current.currentItem).toEqual(mockList[0]);
        expect(result.current.fade).toBe(true);
    });

    it("should handle rotation and fade transitions", () => {
        const { result } = renderHook(() => useRecentlyPlayedUI(mockList, false));

        act(() => {
            vi.advanceTimersByTime(3000);
        });
        expect(result.current.fade).toBe(false);

        act(() => {
            vi.advanceTimersByTime(300);
        });
        expect(result.current.currentIndex).toBe(1);
        expect(result.current.fade).toBe(true);
    });

    it("should reset index to 0 if recentlyPlayed length decreases below current index", () => {
        const { result, rerender } = renderHook(
            ({ list }) => useRecentlyPlayedUI(list, false),
            { initialProps: { list: mockList } }
        );

        act(() => {
            result.current.setCurrentIndex(2);
        });

        rerender({ list: [mockList[0]] });
        expect(result.current.currentIndex).toBe(0);
    });

    it("should not start interval if isProfilePage is true", () => {
        const { result } = renderHook(() => useRecentlyPlayedUI(mockList, true));

        act(() => {
            vi.advanceTimersByTime(3300);
        });

        expect(result.current.currentIndex).toBe(0);
    });

    it("should not start interval if list has 1 or fewer items", () => {
        const shortList = [{ id: 1 }];
        const { result } = renderHook(() => useRecentlyPlayedUI(shortList, false));

        act(() => {
            vi.advanceTimersByTime(3300);
        });

        expect(result.current.currentIndex).toBe(0);
    });

    it("should loop back to start after reaching last item", () => {
        const { result } = renderHook(() => useRecentlyPlayedUI(mockList, false));

        act(() => {
            result.current.setCurrentIndex(2);
        });

        act(() => {
            vi.advanceTimersByTime(3300);
        });

        expect(result.current.currentIndex).toBe(0);
    });
});