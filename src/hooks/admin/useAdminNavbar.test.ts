import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminNavbar } from "./useAdminNavbar";
import { MainRoutes } from "../../routes/constants/Main_Routes";

vi.mock("react-router-dom", () => ({
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
}));

describe("useAdminNavbar", () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useLocation as any).mockReturnValue({ pathname: "/admin" });
        window.scrollY = 0;
    });

    it("should initialize with default values", () => {
        const { result } = renderHook(() => useAdminNavbar());

        expect(result.current.shrink).toBe(false);
        expect(result.current.isMenuOpen).toBe(false);
    });

    it("should set shrink to true when scrolling past 30px", () => {
        renderHook(() => useAdminNavbar());

        const { result } = renderHook(() => useAdminNavbar());
        
        act(() => {
            window.scrollY = 50;
            window.dispatchEvent(new Event("scroll"));
        });

        expect(result.current.shrink).toBe(true);
    });

    it("should correctly identify active path", () => {
        (useLocation as any).mockReturnValue({ pathname: "/admin/dashboard" });
        const { result } = renderHook(() => useAdminNavbar());

        expect(result.current.isActive("/admin/dashboard")).toBe(true);
        expect(result.current.isActive("/admin/settings")).toBe(false);
    });

    it("should toggle menu state", () => {
        const { result } = renderHook(() => useAdminNavbar());

        act(() => {
            result.current.toggleMenu();
        });
        expect(result.current.isMenuOpen).toBe(true);

        act(() => {
            result.current.toggleMenu();
        });
        expect(result.current.isMenuOpen).toBe(false);
    });

    it("should close menu when location changes", () => {
        const { result, rerender } = renderHook(() => useAdminNavbar());

        act(() => {
            result.current.toggleMenu();
        });
        expect(result.current.isMenuOpen).toBe(true);

        (useLocation as any).mockReturnValue({ pathname: "/admin/new-page" });
        rerender();

        expect(result.current.isMenuOpen).toBe(false);
    });

    it("should navigate to home on disconnect", () => {
        const { result } = renderHook(() => useAdminNavbar());

        act(() => {
            result.current.handleDisconnect();
        });

        expect(mockNavigate).toHaveBeenCalledWith(MainRoutes.HOME);
    });

    it("should remove scroll listener on unmount", () => {
        const removeSpy = vi.spyOn(window, "removeEventListener");
        const { unmount } = renderHook(() => useAdminNavbar());

        unmount();

        expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    });
});