import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePlaylistScroll } from "./usePlaylistScroll";
import type { Song } from "../../types/music";

describe("usePlaylistScroll", () => {
    const mockSong = { 
        id: "123", 
        title: "Test Title", 
        artist: "Test Artist",
        genre: "",
        duration: "",
        cover: "",
        src: "",
        defaultBgVideo: "",
        playingBgVideo: ""
    };
    
    const mockPlaylist: Song[] = [mockSong];

    const createMockElement = (offsetTop: number, clientHeight: number) => ({
        offsetTop,
        clientHeight,
    } as HTMLElement);

    const createMockContainer = (clientHeight: number) => {
        const container = {
            clientHeight,
            scrollTo: vi.fn(),
        } as unknown as HTMLDivElement;
        return container;
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should register and unregister item refs correctly", () => {
        const { result } = renderHook(() => usePlaylistScroll({ 
            currentSong: null, 
            playlist: [], 
            editingSongId: null 
        }));

        const mockEl = createMockElement(0, 0);
        
        result.current.setItemRef("1", mockEl);
        result.current.setItemRef("2", null);

        expect(result.current.playlistRef.current).toBeNull();
    });

    it("should scroll to the current song when it changes", () => {
        const { result, rerender } = renderHook(
            (props) => usePlaylistScroll(props),
            {
                initialProps: { currentSong: null, playlist: mockPlaylist, editingSongId: null }
            }
        );

        const container = createMockContainer(500);
        result.current.playlistRef.current = container;

        const activeCard = createMockElement(1000, 100);
        result.current.setItemRef("123", activeCard);

        rerender({ currentSong: mockSong, playlist: mockPlaylist, editingSongId: null });

        expect(container.scrollTo).toHaveBeenCalledWith({
            top: 1000 - (500 / 2) + (100 / 2),
            behavior: "smooth"
        });
    });

    it("should prioritize editingSongId over currentSong", () => {
        const editingSong = { id: "edit-1", title: "Editing", artist: "Artist" };
        const { result, rerender } = renderHook(
            (props) => usePlaylistScroll(props),
            {
                initialProps: { currentSong: mockSong, playlist: mockPlaylist, editingSongId: null }
            }
        );

        const container = createMockContainer(600);
        result.current.playlistRef.current = container;

        const songCard = createMockElement(200, 100);
        const editCard = createMockElement(800, 100);
        
        result.current.setItemRef("123", songCard);
        result.current.setItemRef("edit-1", editCard);

        rerender({ currentSong: mockSong, playlist: mockPlaylist, editingSongId: "edit-1" });

        expect(container.scrollTo).toHaveBeenCalledWith({
            top: 800 - (600 / 2) + (100 / 2),
            behavior: "smooth"
        });
    });

    it("should do nothing if container ref is not set", () => {
        const { result, rerender } = renderHook(
            (props) => usePlaylistScroll(props),
            {
                initialProps: { currentSong: null, playlist: mockPlaylist, editingSongId: null }
            }
        );

        const activeCard = createMockElement(100, 50);
        result.current.setItemRef("123", activeCard);

        rerender({ currentSong: mockSong, playlist: mockPlaylist, editingSongId: null });
        
        expect(result.current.playlistRef.current).toBeNull();
    });
});