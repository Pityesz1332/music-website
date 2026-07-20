import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAdminAuth } from "./useAdminAuth";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";

vi.mock("react-router-dom", () => ({
    useNavigate: vi.fn(),
}));

vi.mock("../../context/AdminContext", () => ({
    useAdmin: vi.fn(),
}));

vi.mock("../../context/NotificationContext", () => ({
    useNotification: vi.fn(),
    NotificationType: {
        SUCCESS: "success",
        ERROR: "error",
        INFO: "info",
    },
}));

describe("useAdminAuth", () => {
    const mockNavigate = vi.fn();
    const mockConnectAsAdmin = vi.fn();
    const mockNotify = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useAdmin as any).mockReturnValue({ connectAsAdmin: mockConnectAsAdmin });
        (useNotification as any).mockReturnValue({ notify: mockNotify });
    });

    it("should update credentials on input change", () => {
        const { result } = renderHook(() => useAdminAuth());

        act(() => {
            result.current.handleChange({
                target: { name: "username", value: "admin" }
            } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.credentials.username).toBe("admin");
    });

    it("should notify and return if fields are empty during submit", async () => {
        const { result } = renderHook(() => useAdminAuth());
        const mockEvent = { preventDefault: vi.fn() } as any;

        await act(async () => {
            await result.current.handleSubmit(mockEvent);
        });

        expect(mockNotify).toHaveBeenCalledWith(expect.any(String), "info");
        expect(mockConnectAsAdmin).not.toHaveBeenCalled();
    });

    it("should navigate and notify success on successful login", async () => {
        mockConnectAsAdmin.mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useAdminAuth());

        act(() => {
            result.current.handleChange({ target: { name: "username", value: "user" } } as any);
            result.current.handleChange({ target: { name: "password", value: "pass" } } as any);
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(result.current.isLoading).toBe(true);
        expect(mockConnectAsAdmin).toHaveBeenCalledWith("user", "pass");
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNotify).toHaveBeenCalledWith(expect.any(String), "success");
    });

    it("should clear password and notify error on failed login", async () => {
        mockConnectAsAdmin.mockRejectedValueOnce(new Error("Unauthorized"));
        const { result } = renderHook(() => useAdminAuth());

        act(() => {
            result.current.handleChange({ target: { name: "username", value: "user" } } as any);
            result.current.handleChange({ target: { name: "password", value: "wrong" } } as any);
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.credentials.password).toBe("");
        expect(mockNotify).toHaveBeenCalledWith(expect.any(String), "error");
    });
});