import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSongManager } from "./useSongManager";
import songsData from "../../data/songs.json";

describe("useSongManager", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("should initialize songs from songsData if localStorage is empty", () => {
        const { result } = renderHook(() => useSongManager());
        expect(result.current.songs).toEqual(songsData);
    });

    it("should initialize songs from localStorage if data exists", () => {
        const mockSavedSongs = [{ id: "99", title: "Saved" }];
        localStorage.setItem("admin_songs", JSON.stringify(mockSavedSongs));
        
        const { result } = renderHook(() => useSongManager());
        expect(result.current.songs).toEqual(mockSavedSongs);
    });

    it("should sync songs to localStorage when songs change", () => {
        const { result } = renderHook(() => useSongManager());
        const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

        act(() => {
            result.current.deleteSong(songsData[0].id);
        });

        expect(setItemSpy).toHaveBeenCalledWith("admin_songs", expect.any(String));
        const savedData = JSON.parse(localStorage.getItem("admin_songs") || "[]");
        expect(savedData.length).toBe(songsData.length - 1);
    });

    it("should add a new song with an incremented ID", () => {
        const { result } = renderHook(() => useSongManager());
        const newSongData = { title: "New", artist: "Artist", genre: "Rock", duration: "3:00" };

        act(() => {
            result.current.saveNewSong(newSongData);
        });

        const addedSong = result.current.songs.find(s => s.title === "New");
        expect(addedSong).toBeDefined();
        expect(Number(addedSong?.id)).toBeGreaterThan(0);
        expect(result.current.isUploadOpen).toBe(false);
    });

    it("should delete a song by ID", () => {
        const { result } = renderHook(() => useSongManager());
        const targetId = songsData[0].id;

        act(() => {
            result.current.deleteSong(targetId);
        });

        expect(result.current.songs.find(s => s.id === targetId)).toBeUndefined();
    });

    it("should handle song editing flow", () => {
        const { result } = renderHook(() => useSongManager());
        const songToEdit = songsData[0];

        act(() => {
            result.current.openEditModal(songToEdit);
        });
        expect(result.current.editSong).toEqual(songToEdit);

        act(() => {
            result.current.handleEditChange("title", "Updated Title");
        });
        expect(result.current.editSong?.title).toBe("Updated Title");

        act(() => {
            result.current.saveEdit();
        });

        expect(result.current.songs[0].title).toBe("Updated Title");
        expect(result.current.editSong).toBeNull();
    });

    it("should toggle upload modal state", () => {
        const { result } = renderHook(() => useSongManager());

        act(() => {
            result.current.openUploadModal();
        });
        expect(result.current.isUploadOpen).toBe(true);

        act(() => {
            result.current.closeUploadModal();
        });
        expect(result.current.isUploadOpen).toBe(false);
    });

    it("should close edit modal", () => {
        const { result } = renderHook(() => useSongManager());

        act(() => {
            result.current.openEditModal(songsData[0]);
            result.current.closeEditModal();
        });

        expect(result.current.editSong).toBeNull();
    });
});