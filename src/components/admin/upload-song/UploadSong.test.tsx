import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UploadSong } from "./UploadSong";
import { useUploadSong } from "../../../hooks/admin/useUploadSong";
import { ADMIN_UPLOAD_SONG_STRINGS } from "../../../constant-strings/ui/admin/uploadSong";

vi.mock("../../../hooks/admin/useUploadSong");
vi.mock("../../ui/button/PrimaryButton", () => ({
  PrimaryButton: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

describe("UploadSong Component", () => {
  const mockOnCancel = vi.fn();
  const mockOnSave = vi.fn();
  const mockUpdateForm = vi.fn();
  const mockHandleAudioChange = vi.fn();
  const mockHandleCoverChange = vi.fn();
  const mockHandleUpload = vi.fn();

  const createDefaultHookReturn = (overrides = {}) => ({
    audioFile: null,
    coverFile: null,
    progress: 0,
    isUploading: false,
    form: { title: "", artist: "", genre: "" },
    audioInputRef: { current: null },
    handleAudioChange: mockHandleAudioChange,
    handleCoverChange: mockHandleCoverChange,
    handleUpload: mockHandleUpload,
    updateForm: mockUpdateForm,
    ...overrides
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with initial state", () => {
    (useUploadSong as any).mockReturnValue(createDefaultHookReturn());
    render(<UploadSong onCancel={mockOnCancel} onSave={mockOnSave} />);

    expect(screen.getByText(ADMIN_UPLOAD_SONG_STRINGS.TITLE)).toBeDefined();
    expect(screen.getByText(ADMIN_UPLOAD_SONG_STRINGS.DROPZONE.PLACEHOLDER)).toBeDefined();
  });

  it("calls updateForm when typing in inputs", () => {
    (useUploadSong as any).mockReturnValue(createDefaultHookReturn());
    render(<UploadSong onCancel={mockOnCancel} onSave={mockOnSave} />);

    const titleInput = screen.getByPlaceholderText(ADMIN_UPLOAD_SONG_STRINGS.PLACEHOLDERS.TITLE);
    fireEvent.change(titleInput, { target: { value: "New Song" } });

    expect(mockUpdateForm).toHaveBeenCalledWith({ title: "New Song" });
  });

  it("displays audio file name when selected", () => {
    (useUploadSong as any).mockReturnValue(createDefaultHookReturn({
      audioFile: { name: "test-audio.mp3" }
    }));

    render(<UploadSong onCancel={mockOnCancel} onSave={mockOnSave} />);
    expect(screen.getByText("test-audio.mp3")).toBeDefined();
  });

  it("shows progress bar when progress is greater than 0", () => {
    (useUploadSong as any).mockReturnValue(createDefaultHookReturn({
      progress: 45
    }));

    render(<UploadSong onCancel={mockOnCancel} onSave={mockOnSave} />);
    expect(screen.getByText("45%")).toBeDefined();
  });

  it("disables save button and shows uploading status during upload", () => {
    (useUploadSong as any).mockReturnValue(createDefaultHookReturn({
      isUploading: true
    }));

    render(<UploadSong onCancel={mockOnCancel} onSave={mockOnSave} />);
    const saveButton = screen.getByText(ADMIN_UPLOAD_SONG_STRINGS.STATUS.UPLOADING);
    expect((saveButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("calls handleUpload when save button is clicked", () => {
    (useUploadSong as any).mockReturnValue(createDefaultHookReturn());
    render(<UploadSong onCancel={mockOnCancel} onSave={mockOnSave} />);
    
    const saveButton = screen.getByText(ADMIN_UPLOAD_SONG_STRINGS.STATUS.SAVE);
    fireEvent.click(saveButton);

    expect(mockHandleUpload).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button is clicked", () => {
    (useUploadSong as any).mockReturnValue(createDefaultHookReturn());
    render(<UploadSong onCancel={mockOnCancel} onSave={mockOnSave} />);
    
    const cancelButton = screen.getByRole("button", { name: "" }); 
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("triggers audio input click when dropzone is clicked", () => {
    const mockClick = vi.fn();
    const audioRef = {
        get current() { return { click: mockClick, focus: vi.fn() }; },
        set current(_v) {}
    };

    (useUploadSong as any).mockReturnValue(createDefaultHookReturn({
        audioInputRef: audioRef
    }));

    render(<UploadSong onCancel={mockOnCancel} onSave={mockOnSave} />);
    
    const dropzone = screen.getByText(ADMIN_UPLOAD_SONG_STRINGS.DROPZONE.PLACEHOLDER).parentElement;
    fireEvent.click(dropzone!);

    expect(mockClick).toHaveBeenCalled();
  });
});