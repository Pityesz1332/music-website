import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { NotificationProvider, useNotification, NotificationType } from "./NotificationContext";

const TestComponent = () => {
  const { notifications, notify } = useNotification();
  return (
    <div>
      <div data-testid="count">{notifications.length}</div>
      {notifications.map((n) => (
        <div key={n.id} data-testid="notification">
          {n.message} - {n.type}
        </div>
      ))}
      <button onClick={() => notify("Success Message", NotificationType.SUCCESS, 1000)}>
        Notify
      </button>
    </div>
  );
};

describe("NotificationProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should start with an empty notifications array", () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("should add a notification when notify is called", () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    const button = screen.getByText("Notify");
    
    act(() => {
      button.click();
    });

    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("notification").textContent).toContain("Success Message");
  });

  it("should automatically remove notification after duration", () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    act(() => {
      screen.getByText("Notify").click();
    });

    expect(screen.getByTestId("count").textContent).toBe("1");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("should clear all timeouts on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    
    const { unmount } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    act(() => {
      screen.getByText("Notify").click();
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("should throw error when used outside of NotificationProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow(
      "useNotification must be used within a NotificationProvider"
    );
    
    consoleSpy.mockRestore();
  });
});