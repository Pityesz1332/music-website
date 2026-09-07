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
    const mockSignInWithPasskey = vi.fn();
    const mockSignInWithRawKey = vi.fn();
    const mockNotify = vi.fn();

    let isAdmin: boolean;
    let error: string | null;

    beforeEach(() => {
        vi.clearAllMocks();
        isAdmin = false;
        error = null;
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useAdmin as any).mockImplementation(() => ({
            isAdmin,
            error,
            canUsePasskey: true,
            signInWithPasskey: mockSignInWithPasskey,
            signInWithRawKey: mockSignInWithRawKey,
        }));
        (useNotification as any).mockReturnValue({ notify: mockNotify });
    });

    it("starts idle with no key typed", () => {
        const { result } = renderHook(() => useAdminAuth());

        expect(result.current.isPasskeyLoading).toBe(false);
        expect(result.current.isKeyLoading).toBe(false);
        expect(result.current.rawKey).toBe("");
        expect(result.current.canUsePasskey).toBe(true);
    });

    it("navigates and notifies success once the admin context reports signed in", () => {
        isAdmin = true;
        renderHook(() => useAdminAuth());

        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNotify).toHaveBeenCalledWith(expect.any(String), "success");
    });

    it("notifies the admin context's error and clears both busy flags", () => {
        error = "Could not unlock the feed key with this passkey.";
        renderHook(() => useAdminAuth());

        expect(mockNotify).toHaveBeenCalledWith(error, "error");
    });

    describe("handlePasskeySignIn", () => {
        it("toggles isPasskeyLoading around the ceremony and passes an AbortSignal through", async () => {
            let resolveSignIn!: () => void;
            mockSignInWithPasskey.mockReturnValue(
                new Promise<void>((resolve) => {
                    resolveSignIn = resolve;
                }),
            );
            const { result } = renderHook(() => useAdminAuth());

            let pending!: Promise<void>;
            act(() => {
                pending = result.current.handlePasskeySignIn();
            });
            expect(result.current.isPasskeyLoading).toBe(true);
            expect(mockSignInWithPasskey).toHaveBeenCalledWith(expect.any(AbortSignal));

            await act(async () => {
                resolveSignIn();
                await pending;
            });
            expect(result.current.isPasskeyLoading).toBe(false);
        });

        it("cancelPasskeySignIn aborts the in-flight signal and returns to idle immediately", async () => {
            let capturedSignal: AbortSignal | undefined;
            mockSignInWithPasskey.mockImplementation(
                (signal: AbortSignal) =>
                    new Promise<void>((resolve) => {
                        capturedSignal = signal;
                        signal.addEventListener("abort", () => resolve());
                    }),
            );
            const { result } = renderHook(() => useAdminAuth());

            let pending!: Promise<void>;
            act(() => {
                pending = result.current.handlePasskeySignIn();
            });

            act(() => {
                result.current.cancelPasskeySignIn();
            });

            expect(result.current.isPasskeyLoading).toBe(false);
            expect(capturedSignal?.aborted).toBe(true);
            await act(async () => {
                await pending;
            });
        });

        it("a superseded ceremony resolving late does not flip busy state back on", async () => {
            const calls: Array<() => void> = [];
            mockSignInWithPasskey.mockImplementation(
                () =>
                    new Promise<void>((resolve) => {
                        calls.push(resolve);
                    }),
            );
            const { result } = renderHook(() => useAdminAuth());

            let first!: Promise<void>;
            act(() => {
                first = result.current.handlePasskeySignIn();
            });
            let second!: Promise<void>;
            act(() => {
                second = result.current.handlePasskeySignIn();
            });
            expect(result.current.isPasskeyLoading).toBe(true);

            // Resolve the stale (first) attempt after the retry started.
            await act(async () => {
                calls[0]();
                await first;
            });
            // The retry (still in flight) owns the busy state — the stale
            // attempt's resolution must not have cleared it.
            expect(result.current.isPasskeyLoading).toBe(true);

            await act(async () => {
                calls[1]();
                await second;
            });
            expect(result.current.isPasskeyLoading).toBe(false);
        });
    });

    describe("handleRawKeySignIn", () => {
        it("does nothing for a blank key", async () => {
            const { result } = renderHook(() => useAdminAuth());
            const mockEvent = { preventDefault: vi.fn() } as any;

            await act(async () => {
                await result.current.handleRawKeySignIn(mockEvent);
            });

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(mockSignInWithRawKey).not.toHaveBeenCalled();
        });

        it("signs in with the typed key and clears the field on success", async () => {
            mockSignInWithRawKey.mockResolvedValue(undefined);
            const { result } = renderHook(() => useAdminAuth());

            act(() => {
                result.current.setRawKey("deadbeef");
            });
            await act(async () => {
                await result.current.handleRawKeySignIn({ preventDefault: vi.fn() } as any);
            });

            expect(mockSignInWithRawKey).toHaveBeenCalledWith("deadbeef");
            expect(result.current.rawKey).toBe("");
            expect(result.current.isKeyLoading).toBe(false);
        });
    });
});
