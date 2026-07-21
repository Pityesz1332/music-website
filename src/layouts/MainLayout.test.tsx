import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import MainLayout from "./MainLayout";

vi.mock("../components/Navbar/Navbar", () => ({
  default: () => <nav data-testid="navbar-mock" />
}));

vi.mock("../components/Playbar/Playbar", () => ({
  default: () => <div data-testid="playbar-mock" />
}));

vi.mock("../context/MusicContext", () => ({
  useMusic: () => ({
    currentSong: null,
    isPlaying: false,
    togglePlay: vi.fn(),
    nextSong: vi.fn(),
    prevSong: vi.fn()
  })
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet-mock" />
  };
});

describe("MainLayout", () => {
  it("should render all layout sections correctly", () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId("navbar-mock")).toBeInTheDocument();
    expect(screen.getByTestId("outlet-mock")).toBeInTheDocument();
    expect(screen.getByTestId("playbar-mock")).toBeInTheDocument();
  });

  it("should have the correct semantic structure", () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    );

    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement.contains(screen.getByTestId("outlet-mock"))).toBe(true);
    expect(mainElement.contains(screen.getByTestId("playbar-mock"))).toBe(true);
  });
});