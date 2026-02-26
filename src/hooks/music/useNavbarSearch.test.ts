import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNavigate } from "react-router-dom";
import { useNavbarSearch } from "./useNavbarSearch";
import { MainRoutes } from "../../routes/constants/MainRoutes";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("useNavbarSearch", () => {
  const mockNavigate = vi.fn();
  const mockCloseMenu = vi.fn();
  
  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useNavbarSearch(mockCloseMenu));

    expect(result.current.searchTerm).toBe("");
    expect(result.current.isFocused).toBe(false);
  });

  it("should update searchTerm when setSearchTerm is called", () => {
    const { result } = renderHook(() => useNavbarSearch(mockCloseMenu));

    act(() => {
      result.current.setSearchTerm("test query");
    });

    expect(result.current.searchTerm).toBe("test query");
  });

  it("should navigate and reset state when executeSearch is called with valid term", () => {
    const { result } = renderHook(() => useNavbarSearch(mockCloseMenu));

    act(() => {
      result.current.setSearchTerm("  Heavy Metal  ");
      result.current.setIsFocused(true);
    });

    act(() => {
      result.current.executeSearch();
    });

    const expectedPath = `${MainRoutes.SONGS}?search=Heavy%20Metal`;
    expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.isFocused).toBe(false);
    expect(mockCloseMenu).toHaveBeenCalled();
  });

  it("should not execute search if searchTerm is only whitespace", () => {
    const { result } = renderHook(() => useNavbarSearch(mockCloseMenu));

    act(() => {
      result.current.setSearchTerm("   ");
      result.current.executeSearch();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockCloseMenu).not.toHaveBeenCalled();
  });

  it("should call executeSearch when Enter key is pressed", () => {
    const { result } = renderHook(() => useNavbarSearch(mockCloseMenu));

    act(() => {
      result.current.setSearchTerm("Rock");
    });

    const enterEvent = { key: "Enter" } as React.KeyboardEvent<HTMLInputElement>;
    
    act(() => {
      result.current.handleKeyDown(enterEvent);
    });

    expect(mockNavigate).toHaveBeenCalled();
  });

  it("should not call executeSearch when other keys are pressed", () => {
    const { result } = renderHook(() => useNavbarSearch(mockCloseMenu));

    const otherEvent = { key: "Escape" } as React.KeyboardEvent<HTMLInputElement>;
    
    act(() => {
      result.current.handleKeyDown(otherEvent);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should set isFocused to false after a timeout on handleBlur", () => {
    const { result } = renderHook(() => useNavbarSearch(mockCloseMenu));

    act(() => {
      result.current.setIsFocused(true);
    });

    act(() => {
      result.current.handleBlur();
    });

    expect(result.current.isFocused).toBe(true);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.isFocused).toBe(false);
  });
});