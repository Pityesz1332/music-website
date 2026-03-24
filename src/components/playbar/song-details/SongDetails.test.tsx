import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SongDetails } from "./SongDetails";
import type { Song } from "../../../types/music";

vi.mock("../../../utils/formatTime", () => ({
  formatTime: vi.fn((time) => `0:${time}`),
}));

describe("SongDetails", () => {
  const mockSong: Song = {
    id: "1",
    title: "Mix123",
    artist: "DJ Enez",
    genre: "Mix",
    src: "",
    cover: "cover",
    duration: "4:03",
    defaultBgVideo: "/video/default.mp4",
    playingBgVideo: "/video/playing.mp4",
  };

  it("should render all song details based on the Song type", () => {
    render(<SongDetails song={mockSong} currentTime={30} />);

    const cover = screen.getByAltText(mockSong.title);
    expect(cover).toHaveAttribute("src", mockSong.cover);
    
    expect(screen.getByText(mockSong.title)).toBeInTheDocument();
    expect(screen.getByText(mockSong.artist)).toBeInTheDocument();
    
    const timeDisplay = screen.getByText(`0:30 / ${mockSong.duration}`);
    expect(timeDisplay).toBeInTheDocument();
  });

  it("should maintain the correct layout structure", () => {
    const { container } = render(<SongDetails song={mockSong} currentTime={0} />);
    
    expect(container.querySelector(".playbar__left")).toBeInTheDocument();
    expect(container.querySelector(".playbar__info")).toBeInTheDocument();
    expect(container.querySelector(".playbar__time-container")).toBeInTheDocument();
  });
});