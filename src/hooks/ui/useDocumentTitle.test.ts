import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useDocumentTitle } from "./useDocumentTitle";
import type { Song } from "../../types/music";

describe("useDocumentTitle", () => {
    const defaultTitle = "DJ Enez";
    const mockSong: Song = {
        id: "",
        title: "Test Track",
        artist: "Test Artist",
        genre: "",
        duration: "",
        cover: "",
        src: "",
        defaultBgVideo: "",
        playingBgVideo: ""
    };

    beforeEach(() => {
        document.title = defaultTitle;
    });

    afterEach(() => {
        document.title = defaultTitle;
    });

    it("should set title with play emoji when a song is playing", () => {
        renderHook(() => useDocumentTitle(mockSong, true));
        expect(document.title).toBe("▶ Test Track - Test Artist");
    });

    it("should set title with pause emoji when a song is paused", () => {
        renderHook(() => useDocumentTitle(mockSong, false));
        expect(document.title).toBe("⏸ Test Track - Test Artist");
    });

    it("should set title to default when currentSong is null", () => {
        renderHook(() => useDocumentTitle(null, true));
        expect(document.title).toBe(defaultTitle);
    });

    it("should update title when isPlaying status changes", () => {
        const { rerender } = renderHook(
            ({ song, playing }) => useDocumentTitle(song, playing),
            {
                initialProps: { song: mockSong, playing: true }
            }
        );

        expect(document.title).toBe("▶ Test Track - Test Artist");

        rerender({ song: mockSong, playing: false });
        expect(document.title).toBe("⏸ Test Track - Test Artist");
    });
});