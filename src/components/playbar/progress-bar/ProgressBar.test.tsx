import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

vi.mock("../../../utils/formatTime", () => ({
  formatTime: vi.fn((time: number) => `formatted-${time}`),
}));

describe("ProgressBar Component", () => {
  const defaultProps = {
    progressBarRef: { current: null } as React.RefObject<HTMLDivElement | null>,
    progress: 45,
    hoverTime: null,
    hoverPos: 0,
    startSeek: vi.fn(),
    handleMouseMove: vi.fn(),
    handleMouseLeave: vi.fn(),
  };

  it("should render the progress bar with correct width", () => {
    const { container } = render(<ProgressBar {...defaultProps} />);
    
    const filledBar = container.querySelector(".playbar__progress-filled");
    expect(filledBar).toHaveStyle({ width: "45%" });
  });

  it("should not show tooltip when hoverTime is null", () => {
    const { container } = render(<ProgressBar {...defaultProps} />);
    
    const tooltip = container.querySelector(".playbar__tooltip");
    expect(tooltip).not.toBeInTheDocument();
  });

  it("should show tooltip and format time when hoverTime is provided", () => {
    const { container } = render(
      <ProgressBar {...defaultProps} hoverTime={120} hoverPos={150} />
    );
    
    const tooltip = screen.getByText("formatted-120");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveStyle({ left: "150px" });
  });

  it("should call startSeek on mouse down", () => {
    const { container } = render(<ProgressBar {...defaultProps} />);
    const mainBar = container.querySelector(".playbar__progress");
    
    if (mainBar) fireEvent.mouseDown(mainBar);
    
    expect(defaultProps.startSeek).toHaveBeenCalled();
  });

  it("should call handleMouseMove on mouse move", () => {
    const { container } = render(<ProgressBar {...defaultProps} />);
    const mainBar = container.querySelector(".playbar__progress");
    
    if (mainBar) fireEvent.mouseMove(mainBar);
    
    expect(defaultProps.handleMouseMove).toHaveBeenCalled();
  });

  it("should call handleMouseLeave on mouse leave", () => {
    const { container } = render(<ProgressBar {...defaultProps} />);
    const mainBar = container.querySelector(".playbar__progress");
    
    if (mainBar) fireEvent.mouseLeave(mainBar);
    
    expect(defaultProps.handleMouseLeave).toHaveBeenCalled();
  });

  it("should stop propagation on click", () => {
    const { container } = render(<ProgressBar {...defaultProps} />);
    const mainBar = container.querySelector(".playbar__progress");
    
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    const spy = vi.spyOn(event, "stopPropagation");
    
    if (mainBar) fireEvent(mainBar, event);
    
    expect(spy).toHaveBeenCalled();
  });
});