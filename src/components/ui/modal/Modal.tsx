import { ReactNode } from "react";
import { createPortal } from "react-dom";
import './Modal.scss'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    description?: string;
    children?: ReactNode;
    buttons?: ReactNode;
}

// modal komponens, amit mindenhol tudunk használni 
// az aktuális igényekhez igazítva.
export const Modal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    description,
    children,
    buttons
}: ModalProps) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    // azért használunk portal-t, mert az ablaknak 
    // vizuálisan az app fölött kell lennie.
    return createPortal(
        <div className="modal" onClick={handleOverlayClick}>
            <div className="modal__content">

                <header className="modal__header">
                    {title && <h2 className="modal__title">{title}</h2>}
                    {subtitle && <h3 className="modal__subtitle">{subtitle}</h3>}
                </header>

                <main className="modal__body">
                    {description && <p className="modal__description">{description}</p>}
                    {children}
                </main>

                {buttons && (
                    <footer className="modal__footer">
                        {buttons}
                    </footer>
                )}
            </div>
        </div>,
        document.body
    );
};