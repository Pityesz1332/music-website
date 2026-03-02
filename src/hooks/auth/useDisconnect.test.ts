import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNavigate } from "react-router-dom";
import { useDisconnect } from "./useDisconnect";
import { useAuth } from "../../context/AuthContext";
import { useNotification, NotificationType } from "../../context/NotificationContext";
import { useLoading } from "../../context/LoadingContext";
import { MainRoutes } from "../../routes/constants/MainRoutes";
import { WALLET_AUTH_STRINGS } from "../../constant-strings/hooks/walletConnect";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

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

describe("useDisconnect", () => {
  const mockNavigate = vi.fn();
  const mockDisconnect = vi.fn();
  const mockNotify = vi.fn();
  const mockShowLoading = vi.fn();
  const mockHideLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useNavigate as any).mockReturnValue(mockNavigate);
    
    (useAuth as any).mockReturnValue({
      disconnect: mockDisconnect,
    });

    (useNotification as any).mockReturnValue({
      notify: mockNotify,
    });

    (useLoading as any).mockReturnValue({
      showLoading: mockShowLoading,
      hideLoading: mockHideLoading,
    });
  });

  it("should handle successful disconnect and navigate home", async () => {
    mockDisconnect.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDisconnect());

    await act(async () => {
      await result.current.handleDisconnect();
    });

    expect(mockShowLoading).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
    expect(mockHideLoading).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(MainRoutes.HOME);
    expect(mockNotify).toHaveBeenCalledWith(
      WALLET_AUTH_STRINGS.DISCONNECT_MESSAGES.DISCONNECT,
      "SUCCESS"
    );
  });

  it("should handle disconnect error", async () => {
    mockDisconnect.mockRejectedValueOnce(new Error("Disconnect failed"));

    const { result } = renderHook(() => useDisconnect());

    await act(async () => {
      await result.current.handleDisconnect();
    });

    expect(mockShowLoading).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
    expect(mockHideLoading).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockNotify).toHaveBeenCalledWith(
      WALLET_AUTH_STRINGS.ERROR,
      "ERROR"
    );
  });
});