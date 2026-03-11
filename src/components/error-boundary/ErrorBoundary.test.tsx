import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ErrorFallback } from "./ErrorBoundary";
import { ERROR_BOUNDARY_STRINGS } from "../../constant-strings/ui/errorBoundary";

describe("ErrorFallback Component", () => {
  beforeEach(() => {
    vi.stubGlobal("location", { reload: vi.fn() });
  });

  it("should render the error boundary texts correctly", () => {
    render(
      <MemoryRouter>
        <ErrorFallback />
      </MemoryRouter>
    );

    expect(screen.getByText(ERROR_BOUNDARY_STRINGS.TITLE)).toBeDefined();
    expect(screen.getByText(ERROR_BOUNDARY_STRINGS.SUBTITLE)).toBeDefined();
    expect(screen.getByRole("button", { name: ERROR_BOUNDARY_STRINGS.BUTTON })).toBeDefined();
  });

  it("should call window.location.reload when the button is clicked", () => {
    render(
      <MemoryRouter>
        <ErrorFallback />
      </MemoryRouter>
    );
    
    const button = screen.getByRole("button", { name: ERROR_BOUNDARY_STRINGS.BUTTON });
    fireEvent.click(button);

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it("should have the correct container class name", () => {
    const { container } = render(
      <MemoryRouter>
        <ErrorFallback />
      </MemoryRouter>
    );
    const div = container.querySelector(".error-boundary__container");
    
    expect(div).not.toBeNull();
  });
});