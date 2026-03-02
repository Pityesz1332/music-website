import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useConnect } from "./useConnect";
import { useAuth } from "../../context/AuthContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";
import { useLoading } from "../../context/LoadingContext";
import { WALLET_AUTH_STRINGS } from "../../constant-strings/hooks/walletConnect";

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../context/NotificationContext", () => ({
  useNotification: vi.fn(),
  NotificationType: {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
  },
}));

vi.mock("../../context/LoadingContext", () => ({
  useLoading: vi.fn(),
}));

describe("useConnect", () => {
  const mockConnect = vi.fn();
  const mockNotify = vi.fn();
  const mockShowLoading = vi.fn();
  const mockHideLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuth as any).mockReturnValue({
      connect: mockConnect,
    });

    (useNotification as any).mockReturnValue({
      notify: mockNotify,
    });

    (useLoading as any).mockReturnValue({
      showLoading: mockShowLoading,
      hideLoading: mockHideLoading,
    });
  });

  it("should handle successful connection", async () => {
    mockConnect.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useConnect());

    await act(async () => {
      await result.current.handleDemoConnect();
    });

    expect(mockShowLoading).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockHideLoading).toHaveBeenCalledTimes(1);
    expect(mockNotify).toHaveBeenCalledWith(
      WALLET_AUTH_STRINGS.CONNECT_MESSAGES.CONNECT,
      "SUCCESS"
    );
  });

  it("should handle connection error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Connection failed");
    mockConnect.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useConnect());

    await act(async () => {
      await result.current.handleDemoConnect();
    });

    expect(mockShowLoading).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockHideLoading).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(error);
    expect(mockNotify).toHaveBeenCalledWith(
      WALLET_AUTH_STRINGS.ERROR,
      "ERROR"
    );

    consoleSpy.mockRestore();
  });
});