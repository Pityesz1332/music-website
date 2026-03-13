import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { CONFIRM_MODAL_STRINGS } from "../../i18n/ui/confirmModal";

describe("ConfirmModal", () => {
    const defaultProps = {
        isOpen: true,
        title: "Delete Item",
        message: "Are you sure you want to proceed?",
        onConfirm: vi.fn(),
        onCancel: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithRouter = (ui: React.ReactElement) => {
        return render(<MemoryRouter>{ui}</MemoryRouter>);
    };

    it("should render nothing when isOpen is false", () => {
        const { container } = renderWithRouter(<ConfirmModal {...defaultProps} isOpen={false} />);
        expect(container.firstChild).toBeNull();
    });

    it("should render correctly with provided title and message", () => {
        renderWithRouter(<ConfirmModal {...defaultProps} />);

        expect(screen.getByText(defaultProps.title)).toBeDefined();
        expect(screen.getByText(defaultProps.message)).toBeDefined();
        expect(screen.getByText(CONFIRM_MODAL_STRINGS.CONFIRM)).toBeDefined();
        expect(screen.getByText(CONFIRM_MODAL_STRINGS.CANCEL)).toBeDefined();
    });

    it("should call onConfirm when confirm button is clicked", () => {
        renderWithRouter(<ConfirmModal {...defaultProps} />);

        const confirmButton = screen.getByText(CONFIRM_MODAL_STRINGS.CONFIRM);
        fireEvent.click(confirmButton);

        expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it("should call onCancel when cancel button is clicked", () => {
        renderWithRouter(<ConfirmModal {...defaultProps} />);

        const cancelButton = screen.getByText(CONFIRM_MODAL_STRINGS.CANCEL);
        fireEvent.click(cancelButton);

        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it("should call onCancel when overlay is clicked", () => {
        const { container } = renderWithRouter(<ConfirmModal {...defaultProps} />);

        const overlay = container.querySelector(".confirm-modal__overlay");
        if (overlay) {
            fireEvent.click(overlay);
        }

        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it("should have visibility class when open", () => {
        const { container } = renderWithRouter(<ConfirmModal {...defaultProps} />);
        const modalDiv = container.firstChild as HTMLElement;
        
        expect(modalDiv.classList.contains("confirm-modal--visible")).toBe(true);
    });
});