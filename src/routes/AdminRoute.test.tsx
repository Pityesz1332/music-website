import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AdminRoute } from "./AdminRoute";
import { useAdmin } from "../context/AdminContext";

vi.mock("../context/AdminContext", () => ({
  useAdmin: vi.fn(),
}));

describe("AdminRoute", () => {
  it("redirects to connect page when user is not an admin", () => {
    vi.mocked(useAdmin).mockReturnValue({ isAdmin: false, error: null, connectAsAdmin: vi.fn(), disconnectAdmin: vi.fn(), });

    render(
      <MemoryRouter initialEntries={["/admin/protected"]}>
        <Routes>
          <Route
            path="/admin/protected"
            element={
              <AdminRoute>
                <div data-testid="protected-content">Protected</div>
              </AdminRoute>
            }
          />
          <Route path="/admin/connect" element={<div data-testid="connect-page">Connect Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(screen.getByTestId("connect-page")).toBeInTheDocument();
  });

  it("renders children when user is an admin", () => {
    vi.mocked(useAdmin).mockReturnValue({ isAdmin: true, error: null, connectAsAdmin: vi.fn(), disconnectAdmin: vi.fn(), });

    render(
      <MemoryRouter>
        <AdminRoute>
          <div data-testid="protected-content">Protected</div>
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(screen.getByText("Protected")).toBeInTheDocument();
  });
});