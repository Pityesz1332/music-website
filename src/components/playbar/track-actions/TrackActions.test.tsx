import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TrackActions } from "./TrackActions";
import { NotificationType } from "../../../context/NotificationContext";
import { PLAYBAR_STRINGS } from "../../../i18n/ui/playbar";

describe("TrackActions", () => {
  const mockProps = {
    volume: 50,
    volumeWrapperRef: { current: null },
    handleVolumeDragStart: vi.fn(),
    handleVolumeChanger: vi.fn(),
    adjustVolume: vi.fn(),
    resetSong: vi.fn(),
    isLooping: false,
    setIsLooping: vi.fn(),
    isConnected: true,
    isSaved: false,
    song: { id: "1", title: "Test Song" } as any,
    removeSavedSong: vi.fn(),
    saveSong: vi.fn(),
    notify: vi.fn(),
  };

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it("should render volume control and basic action buttons", () => {
    renderWithRouter(<TrackActions {...mockProps} />);
    
    expect(screen.getByRole("slider")).toBeDefined();
  });

  it("should call resetSong when reset button is clicked", () => {
    renderWithRouter(<TrackActions {...mockProps} />);
    
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    
    expect(mockProps.resetSong).toHaveBeenCalledTimes(1);
  });

  it("should toggle looping state when repeat button is clicked", () => {
    renderWithRouter(<TrackActions {...mockProps} />);
    
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);
    
    expect(mockProps.setIsLooping).toHaveBeenCalledWith(true);
  });

  it("should not render connected buttons when isConnected is false", () => {
    renderWithRouter(<TrackActions {...mockProps} isConnected={false} />);
    
    const buttons = screen.queryAllByRole("button");
    expect(buttons.length).toBe(2);
  });

  it("should call saveSong and notify when heart button is clicked and song is not saved", () => {
    renderWithRouter(<TrackActions {...mockProps} isSaved={false} />);
    
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[2]);
    
    expect(mockProps.saveSong).toHaveBeenCalledWith(mockProps.song);
    expect(mockProps.notify).toHaveBeenCalledWith(
      PLAYBAR_STRINGS.MESSAGES.SAVED,
      NotificationType.SUCCESS
    );
  });

  it("should call removeSavedSong and notify when heart button is clicked and song is already saved", () => {
    renderWithRouter(<TrackActions {...mockProps} isSaved={true} />);
    
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[2]);
    
    expect(mockProps.removeSavedSong).toHaveBeenCalledWith(mockProps.song.id);
    expect(mockProps.notify).toHaveBeenCalledWith(
      PLAYBAR_STRINGS.MESSAGES.DELETED,
      NotificationType.SUCCESS
    );
  });

  it("should apply active class to repeat button when isLooping is true", () => {
    renderWithRouter(<TrackActions {...mockProps} isLooping={true} />);
    
    const buttons = screen.getAllByRole("button");
    expect(buttons[1].className).toContain("playbar__extra-button--active");
  });
});