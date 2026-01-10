import "./ConfirmModal.scss";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={`confirm-modal ${isOpen ? "confirm-modal--visible" : ""}`}>
            <div className="confirm-modal__overlay" onClick={onCancel} />
            
            <div className="confirm-modal__content">
                <h2 className="confirm-modal__title">{title}</h2>
                <p className="confirm-modal__message">{message}</p>

                <div className="confirm-modal__actions">
                    <button type="button" className="confirm-modal__button confirm-modal__button--confirm" onClick={onConfirm}>Confirm</button>
                    <button type="button" className="confirm-modal__button confirm-modal__button--cancel" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;