import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePasskey } from "./usePasskey";
import { registerPasskey, authPasskey, isWebAuthnSupported, PasskeyUser } from "@utils/passkeyHelpers";

vi.mock("@utils/passkeyHelpers", () => ({
  registerPasskey: vi.fn(),
  authPasskey: vi.fn(),
  isWebAuthnSupported: vi.fn(),
}));

describe("usePasskey", () => {
  const mockUser: PasskeyUser = { 
    id: "123",
    username: "testuser",
    displayName: "Test User"
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should return initial state correctly", () => {
    vi.mocked(isWebAuthnSupported).mockReturnValue(true);
    const { result } = renderHook(() => usePasskey());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle successful registration", async () => {
    vi.mocked(registerPasskey).mockResolvedValue(mockUser);
    const { result } = renderHook(() => usePasskey());

    let user;
    await act(async () => {
      user = await result.current.register();
    });

    expect(user).toEqual(mockUser);
    expect(localStorage.getItem("passkeyUser")).toBe(JSON.stringify(mockUser));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle registration error", async () => {
    const errorMessage = "Registration failed";
    vi.mocked(registerPasskey).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => usePasskey());

    await act(async () => {
      await expect(result.current.register()).rejects.toThrow(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });

  it("should handle successful authentication", async () => {
    vi.mocked(authPasskey).mockResolvedValue(mockUser);
    const { result } = renderHook(() => usePasskey());

    let user;
    await act(async () => {
      user = await result.current.authenticate();
    });

    expect(user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle authentication error", async () => {
    const errorMessage = "Auth failed";
    vi.mocked(authPasskey).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => usePasskey());

    await act(async () => {
      await expect(result.current.authenticate()).rejects.toThrow(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });

  it("should handle non-Error objects in catch block", async () => {
    vi.mocked(authPasskey).mockRejectedValue("String error");
    const { result } = renderHook(() => usePasskey());

    await act(async () => {
      await expect(result.current.authenticate()).rejects.toBe("String error");
    });

    expect(result.current.error).toBe("Unknown error");
  });
});