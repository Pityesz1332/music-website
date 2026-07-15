import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

const TestComponent = () => {
  const { isConnected, loading, connect, disconnect } = useAuth();
  return (
    <div>
      <div data-testid="status">{isConnected ? "connected" : "disconnected"}</div>
      <div data-testid="loading">{loading ? "loading" : "ready"}</div>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it("should provide initial state and finish loading", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading").textContent).toBe("ready");
    expect(screen.getByTestId("status").textContent).toBe("disconnected");
  });

  it("should restore connection state from localStorage on mount", () => {
    localStorage.setItem("isConnected", "true");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("status").textContent).toBe("connected");
  });

  it("should connect and save to localStorage after timeout", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const connectBtn = screen.getByText("Connect");
    
    act(() => {
      connectBtn.click();
    });

    expect(screen.getByTestId("status").textContent).toBe("disconnected");

    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByTestId("status").textContent).toBe("connected");
    expect(localStorage.getItem("isConnected")).toBe("true");
  });

  it("should disconnect and remove from localStorage after timeout", async () => {
    localStorage.setItem("isConnected", "true");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const disconnectBtn = screen.getByText("Disconnect");

    act(() => {
      disconnectBtn.click();
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByTestId("status").textContent).toBe("disconnected");
    expect(localStorage.getItem("isConnected")).toBeNull();
  });

  it("should throw error when used outside of AuthProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow("useAuth must be used within an AuthProvider");
    
    consoleSpy.mockRestore();
  });
});