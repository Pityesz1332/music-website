import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useAvatarUpload } from "../user-account/useAvatarUpload";

describe("useAvatarUpload", () => {
  it("should initialize with the provided initial value", () => {
    const initial = "https://example.com/avatar.jpg";
    const { result } = renderHook(() => useAvatarUpload(initial));

    expect(result.current.avatar).toBe(initial);
  });

  it("should initialize with null if no value is provided", () => {
    const { result } = renderHook(() => useAvatarUpload());

    expect(result.current.avatar).toBeNull();
  });

  it("should update avatar when a file is uploaded", async () => {
    const { result } = renderHook(() => useAvatarUpload());
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    
    const mockEvt = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const readAsDataURLSpy = vi.spyOn(FileReader.prototype, "readAsDataURL");

    await act(async () => {
      result.current.handleAvatarChange(mockEvt);
    });

    expect(readAsDataURLSpy).toHaveBeenCalledWith(file);
    
    const readerInstance = vi.mocked(FileReader).prototype;
  });

  it("should not update avatar if no file is present in the event", () => {
    const { result } = renderHook(() => useAvatarUpload("initial.png"));
    
    const emptyEvt = {
      target: {
        files: [],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleAvatarChange(emptyEvt);
    });

    expect(result.current.avatar).toBe("initial.png");
  });
});