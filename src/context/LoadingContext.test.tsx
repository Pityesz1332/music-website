import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { LoadingProvider, useLoading } from "./LoadingContext";

const TestComponent = () => {
  const { isLoading, showLoading, hideLoading } = useLoading();
  return (
    <div>
      <div data-testid="status">{isLoading ? "loading" : "idle"}</div>
      <button onClick={showLoading}>Show</button>
      <button onClick={hideLoading}>Hide</button>
    </div>
  );
};

describe("LoadingProvider", () => {
  it("should provide default false state", () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    );

    expect(screen.getByTestId("status").textContent).toBe("idle");
  });

  it("should set isLoading to true when showLoading is called", () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    );

    const showBtn = screen.getByText("Show");

    act(() => {
      showBtn.click();
    });

    expect(screen.getByTestId("status").textContent).toBe("loading");
  });

  it("should set isLoading to false when hideLoading is called", () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    );

    const showBtn = screen.getByText("Show");
    const hideBtn = screen.getByText("Hide");

    act(() => {
      showBtn.click();
    });
    expect(screen.getByTestId("status").textContent).toBe("loading");

    act(() => {
      hideBtn.click();
    });
    expect(screen.getByTestId("status").textContent).toBe("idle");
  });

  it("should throw error when used outside of LoadingProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useLoading must be used within a LoadingProvider"
    );

    consoleSpy.mockRestore();
  });
});