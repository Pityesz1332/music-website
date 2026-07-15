import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRef } from "react";
import { AudioElement } from "./AudioElement";

describe("AudioElement", () => {
    const defaultProps = {
        audioRef: createRef<HTMLAudioElement>(),
        songSrc: "test-song.mp3",
        isLooping: false,
        isPlaying: false,
        onTimeUpdate: vi.fn(),
        resetSong: vi.fn(),
        setIsLoading: vi.fn(),
        onPlayPause: vi.fn(),
        onNext: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders with correct attributes", () => {
        render(<AudioElement {...defaultProps} />);
        const audio = document.querySelector("audio");

        expect(audio).toBeInTheDocument();
        expect(audio).toHaveAttribute("src", "test-song.mp3");
        expect(audio).not.toHaveAttribute("loop");
        expect(audio).toHaveAttribute("preload", "metadata");
    });

    it("handles looping attribute correctly", () => {
        render(<AudioElement {...defaultProps} isLooping={true} />);
        const audio = document.querySelector("audio");
        expect(audio).toHaveAttribute("loop");
    });

    it("calls onTimeUpdate when time changes", () => {
        render(<AudioElement {...defaultProps} />);
        const audio = document.querySelector("audio")!;
        fireEvent.timeUpdate(audio);
        expect(defaultProps.onTimeUpdate).toHaveBeenCalled();
    });

    it("calls resetSong when metadata is loaded", () => {
        render(<AudioElement {...defaultProps} />);
        const audio = document.querySelector("audio")!;
        fireEvent.loadedMetadata(audio);
        expect(defaultProps.resetSong).toHaveBeenCalled();
    });

    it("calls setIsLoading(false) when data is loaded", () => {
        render(<AudioElement {...defaultProps} />);
        const audio = document.querySelector("audio")!;
        fireEvent.loadedData(audio);
        expect(defaultProps.setIsLoading).toHaveBeenCalledWith(false);
    });

    it("handles onPlay event and updates state if not playing", () => {
        render(<AudioElement {...defaultProps} isPlaying={false} />);
        const audio = document.querySelector("audio")!;
        fireEvent.play(audio);
        
        expect(defaultProps.setIsLoading).toHaveBeenCalledWith(false);
        expect(defaultProps.onPlayPause).toHaveBeenCalled();
    });

    it("handles onPause event and updates state if playing", () => {
        render(<AudioElement {...defaultProps} isPlaying={true} />);
        const audio = document.querySelector("audio")!;
        fireEvent.pause(audio);
        
        expect(defaultProps.onPlayPause).toHaveBeenCalled();
    });

    it("calls onNext when the song ends", () => {
        render(<AudioElement {...defaultProps} />);
        const audio = document.querySelector("audio")!;
        fireEvent.ended(audio);
        expect(defaultProps.onNext).toHaveBeenCalled();
    });
});