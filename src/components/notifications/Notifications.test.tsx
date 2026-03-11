import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useNotification } from "../../context/NotificationContext";
import Notifications from "./Notifications";

vi.mock("../../context/NotificationContext", () => ({
  useNotification: vi.fn(),
}));

vi.mock("./NotificationItem", () => ({
  NotificationItem: ({ notification }: { notification: any }) => (
    <div data-testid="notification-item">{notification.message}</div>
  ),
}));

describe("Notifications Component", () => {
  it("renders a list of notifications", () => {
    const mockNotifications = [
      { id: "1", message: "First Notification" },
      { id: "2", message: "Second Notification" },
    ];

    (useNotification as any).mockReturnValue({
      notifications: mockNotifications,
    });

    render(<Notifications />);

    const items = screen.getAllByTestId("notification-item");
    expect(items).toHaveLength(2);
    expect(screen.getByText("First Notification")).toBeDefined();
    expect(screen.getByText("Second Notification")).toBeDefined();
  });

  it("renders an empty container when there are no notifications", () => {
    (useNotification as any).mockReturnValue({
      notifications: [],
    });

    const { container } = render(<Notifications />);
    
    const notificationContainer = container.querySelector(".notifications");
    expect(notificationContainer).toBeDefined();
    expect(screen.queryByTestId("notification-item")).toBeNull();
  });
});