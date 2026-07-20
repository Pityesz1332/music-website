import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Outlet } from "react-router-dom";
import { EndpointRouter } from "./EndpointRouter";
import { useAdmin } from "../context/AdminContext";
import { MainRoutes } from "./constants/MainRoutes";

vi.mock("../context/AdminContext", () => ({
  useAdmin: vi.fn(),
}));

vi.mock("./AdminRoute", () => ({
  AdminRoute: ({ children }: { children: React.ReactNode }) => {
    const { isAdmin } = useAdmin();
    return isAdmin ? <>{children}</> : <div data-testid="redirected">Admin Connect</div>
  }
}))

vi.mock("../layouts/MainLayout", () => ({ default: () => <div data-testid="main-layout"><Outlet /></div> }));
vi.mock("../layouts/admin-layout/AdminLayout", () => ({ default: () => <div data-testid="admin-layout"><Outlet /></div> }));
vi.mock("../pages/home/Home", () => ({ Home: () => <div>Home Page</div> }));
vi.mock("../pages/admin/admin-connect/AdminConnect", () => ({ AdminConnect: () => <div>Admin Connect</div> }));
vi.mock("../pages/admin/admin-dashboard/AdminDashboard", () => ({ AdminDashboard: () => <div>Admin Dashboard</div> }));
vi.mock("../pages/not-found-fallback/NotFound", () => ({ NotFound: () => <div>Not Found</div> }));

describe("EndpointRouter", () => {
  it("renders home page within main layout", () => {
    render(
      <MemoryRouter initialEntries={[MainRoutes.HOME]}>
        <EndpointRouter />
      </MemoryRouter>
    );

    expect(screen.getByTestId("main-layout")).toBeInTheDocument();
  });

  it("renders admin connect page without admin restriction", () => {
    render(
      <MemoryRouter initialEntries={[MainRoutes.ADMIN_CONNECT]}>
        <EndpointRouter />
      </MemoryRouter>
    );

    expect(screen.getByText("Admin Connect")).toBeInTheDocument();
  });

  it("renders admin dashboard when user is admin", () => {
    vi.mocked(useAdmin).mockReturnValue({ isAdmin: true, error: null, connectAsAdmin: vi.fn(), disconnectAdmin: vi.fn(), });

    render(
      <MemoryRouter initialEntries={[MainRoutes.ADMIN_DASHBOARD]}>
        <EndpointRouter />
      </MemoryRouter>
    );

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  it("redirects to connect from dashboard when user is not admin", () => {
    vi.mocked(useAdmin).mockReturnValue({ isAdmin: false, error: null, connectAsAdmin: vi.fn(), disconnectAdmin: vi.fn(), });

    render(
      <MemoryRouter initialEntries={[MainRoutes.ADMIN_DASHBOARD]}>
        <EndpointRouter />
      </MemoryRouter>
    );

    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
    expect(screen.getByText("Admin Connect")).toBeInTheDocument();
  });

  it("renders not found page for invalid routes", () => {
    render(
      <MemoryRouter initialEntries={["/invalid-route"]}>
        <EndpointRouter />
      </MemoryRouter>
    );

    expect(screen.getByText("Not Found")).toBeInTheDocument();
  });
});