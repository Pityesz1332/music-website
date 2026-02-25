import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNavbarUI } from "./useNavbarUI";

describe("useNavbarUI", () => {
    beforeEach(() => {
        window.scrollY = 0;
        vi.clearAllMocks();
    });

    it("should initialize with default states", () => {
        const { result } = renderHook(() => useNavbarUI());

        expect(result.current.isShrunk).toBe(false);
        expect(result.current.isMenuOpen).toBe(false);
    });

    it("should set isShrunk to true when scrolling past limit", () => {
        const { result } = renderHook(() => useNavbarUI(50));

        act(() => {
            window.scrollY = 100;
            window.dispatchEvent(new Event("scroll"));
        });

        expect(result.current.isShrunk).toBe(true);
    });

    it("should set isShrunk to false when scrolling back above limit", () => {
        const { result } = renderHook(() => useNavbarUI(50));

        act(() => {
            window.scrollY = 100;
            window.dispatchEvent(new Event("scroll"));
        });
        expect(result.current.isShrunk).toBe(true);

        act(() => {
            window.scrollY = 10;
            window.dispatchEvent(new Event("scroll"));
        });
        expect(result.current.isShrunk).toBe(false);
    });

    it("should toggle menu state", () => {
        const { result } = renderHook(() => useNavbarUI());

        act(() => {
            result.current.toggleMenu();
        });
        expect(result.current.isMenuOpen).toBe(true);

        act(() => {
            result.current.toggleMenu();
        });
        expect(result.current.isMenuOpen).toBe(false);
    });

    it("should close menu explicitly", () => {
        const { result } = renderHook(() => useNavbarUI());

        act(() => {
            result.current.toggleMenu();
        });
        expect(result.current.isMenuOpen).toBe(true);

        act(() => {
            result.current.closeMenu();
        });
        expect(result.current.isMenuOpen).toBe(false);
    });

    it("should remove scroll event listener on unmount", () => {
        const removeSpy = vi.spyOn(window, "removeEventListener");
        const { unmount } = renderHook(() => useNavbarUI());

        unmount();

        expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    });
});