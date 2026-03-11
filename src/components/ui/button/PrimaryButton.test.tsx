import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { PrimaryButton } from "./PrimaryButton";

const useNavigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => useNavigateMock,
  };
});

describe("PrimaryButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <BrowserRouter>
        <PrimaryButton>Click Me</PrimaryButton>
      </BrowserRouter>
    );

    expect(screen.getByText("Click Me")).toBeDefined();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(
      <BrowserRouter>
        <PrimaryButton onClick={handleClick}>Click Me</PrimaryButton>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("navigates to the correct path when 'to' prop is provided", () => {
    render(
      <BrowserRouter>
        <PrimaryButton to="/dashboard">Go to Dashboard</PrimaryButton>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Go to Dashboard"));
    expect(useNavigateMock).toHaveBeenCalledWith("/dashboard");
  });

  it("does not call onClick or navigate when disabled", () => {
    const handleClick = vi.fn();
    render(
      <BrowserRouter>
        <PrimaryButton disabled onClick={handleClick} to="/test">
          Disabled Button
        </PrimaryButton>
      </BrowserRouter>
    );

    const button = screen.getByText("Disabled Button");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
    expect(useNavigateMock).not.toHaveBeenCalled();
  });

  it("applies the provided className", () => {
    const customClass = "custom-btn-style";
    render(
      <BrowserRouter>
        <PrimaryButton className={customClass}>Styled Button</PrimaryButton>
      </BrowserRouter>
    );

    expect(screen.getByText("Styled Button").className).toContain(customClass);
  });
});