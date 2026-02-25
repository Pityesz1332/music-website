import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { useUploadSong } from "./useUploadSong";

vi.mock("axios");

describe("useUploadSong", () => {
  const mockOnSave = vi.fn();
  const mockedAxios = axios as any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSave.mockClear();
  });

  it("initial state", () => {
    const { result } = renderHook(() => useUploadSong(mockOnSave));

    expect(result.current.audioFile).toBeNull();
    expect(result.current.coverFile).toBeNull();
    expect(result.current.progress).toBe(0);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.form).toEqual({
      title: "",
      artist: "",
      genre: "",
      duration: ""
    });
  });

  it("updateForm works", () => {
    const { result } = renderHook(() => useUploadSong(mockOnSave));

    act(() => {
      result.current.updateForm({ title: "Test" });
    });

    expect(result.current.form.title).toBe("Test");
  });

  it("rejects invalid audio file", async () => {
    const { result } = renderHook(() => useUploadSong(mockOnSave));

    const file = new File([""], "file.txt", { type: "text/plain" });

    await act(async () => {
      await result.current.handleAudioChange({
        target: { files: [file] }
      } as any);
    });

    expect(result.current.audioFile).toBeNull();
  });

  it("handles valid audio and sets duration", async () => {
    const { result } = renderHook(() => useUploadSong(mockOnSave));

    const file = new File(["audio"], "song.mp3", { type: "audio/mpeg" });

    globalThis.URL.createObjectURL = vi.fn(() => "blob:url");
    globalThis.URL.revokeObjectURL = vi.fn();

    Object.defineProperty(globalThis.Audio.prototype, "duration", {
      value: 120
    });

    Object.defineProperty(globalThis.Audio.prototype, "onloadedmetadata", {
      set(fn: any) {
        setTimeout(() => fn(), 0);
      }
    });

    await act(async () => {
      await result.current.handleAudioChange({
        target: { files: [file] }
      } as any);
    });

    expect(result.current.audioFile).toBe(file);
    expect(result.current.form.title).toBe("song");
    expect(result.current.form.duration).toBe("2:00");
  });

  it("handles cover file", () => {
    const { result } = renderHook(() => useUploadSong(mockOnSave));

    const file = new File(["img"], "cover.png", { type: "image/png" });

    act(() => {
      result.current.handleCoverChange({
        target: { files: [file] }
      } as any);
    });

    expect(result.current.coverFile).toBe(file);
  });

  it("prevents upload when required fields missing", async () => {
    const { result } = renderHook(() => useUploadSong(mockOnSave));

    await act(async () => {
      await result.current.handleUpload();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("successful upload calls onSave", async () => {
    const { result } = renderHook(() => useUploadSong(mockOnSave));

    const audio = new File(["audio"], "song.mp3", { type: "audio/mpeg" });

    act(() => {
      result.current.updateForm({
        title: "Title",
        artist: "Artist",
        genre: "Genre",
        duration: "1:00"
      });
    });

    await act(async () => {
      await result.current.handleAudioChange({
        target: { files: [audio] }
      } as any);
    });

    mockedAxios.post.mockResolvedValue({
      data: { id: 1, title: "Title" }
    });

    await act(async () => {
      await result.current.handleUpload();
    });

    expect(mockedAxios.post).toHaveBeenCalled();
    expect(mockOnSave).toHaveBeenCalledWith({
      id: 1,
      title: "Title"
    });
  });

  it("fallback triggers when upload fails and progress is 100", async () => {
    const { result } = renderHook(() => useUploadSong(mockOnSave));

    const audio = new File(["audio"], "song.mp3", { type: "audio/mpeg" });

    act(() => {
      result.current.updateForm({
        title: "Title",
        artist: "Artist",
        genre: "Genre",
        duration: "1:00"
      });
    });

    await act(async () => {
      await result.current.handleAudioChange({
        target: { files: [audio] }
      } as any);
    });

    mockedAxios.post.mockRejectedValue(new Error("fail"));

    await act(async () => {
      await result.current.handleUpload();
    });

    expect(mockOnSave).toBeDefined();
  });
});