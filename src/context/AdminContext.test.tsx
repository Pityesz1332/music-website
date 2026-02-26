import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AdminProvider, useAdmin } from "./AdminContext";

const mockShowLoading = vi.fn();
const mockHideLoading = vi.fn();

vi.mock("./LoadingContext", () => ({
  useLoading: () => ({
    showLoading: mockShowLoading,
    hideLoading: mockHideLoading,
  }),
}));

const TestComponent = () => {
  const { isAdmin, error, connectAsAdmin, disconnectAdmin } = useAdmin();
  return (
    <div>
      <div data-testid="status">{isAdmin ? "admin" : "guest"}</div>
      <div data-testid="error">{error}</div>
      <button onClick={() => connectAsAdmin("admin", "pass123")}>Login Success</button>
      <button onClick={() => connectAsAdmin("wrong", "wrong")}>Login Fail</button>
      <button onClick={disconnectAdmin}>Logout</button>
    </div>
  );
};

describe("AdminProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it("provides default guest state", () => {
    render(
      <AdminProvider>
        <TestComponent />
      </AdminProvider>
    );

    expect(screen.getByTestId("status").textContent).toBe("guest");
    expect(screen.getByTestId("error").textContent).toBe("");
  });

  it("authenticates automatically if token exists in localStorage", () => {
    localStorage.setItem("adminToken", "fake-token");

    render(
      <AdminProvider>
        <TestComponent />
      </AdminProvider>
    );

    expect(screen.getByTestId("status").textContent).toBe("admin");
  });

  it("handles successful login", async () => {
    render(
      <AdminProvider>
        <TestComponent />
      </AdminProvider>
    );

    const loginBtn = screen.getByText("Login Success");
    
    const loginPromise = act(async () => {
      loginBtn.click();
    });

    expect(mockShowLoading).toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    await loginPromise;

    expect(screen.getByTestId("status").textContent).toBe("admin");
    expect(localStorage.getItem("adminToken")).toBe("fake-jwt-token-123");
    expect(mockHideLoading).toHaveBeenCalled();
  });

  it("handles failed login", async () => {
    render(
      <AdminProvider>
        <TestComponent />
      </AdminProvider>
    );

    const loginBtn = screen.getByText("Login Fail");

    await act(async () => {
      loginBtn.click();
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByTestId("status").textContent).toBe("guest");
    expect(screen.getByTestId("error").textContent).toBe("Wrong username or password");
    expect(mockHideLoading).toHaveBeenCalled();
  });

  it("handles logout", () => {
    localStorage.setItem("adminToken", "fake-token");

    render(
      <AdminProvider>
        <TestComponent />
      </AdminProvider>
    );

    const logoutBtn = screen.getByText("Logout");
    
    act(() => {
      logoutBtn.click();
    });

    expect(screen.getByTestId("status").textContent).toBe("guest");
    expect(localStorage.getItem("adminToken")).toBeNull();
  });

  it("throws error if useAdmin is used outside of provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow("useAdmin must be used within an AdminProvider");
    
    consoleSpy.mockRestore();
  });
});