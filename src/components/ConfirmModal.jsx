import React from "react";
import "../styles/components/ConfirmModal.css";

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? "open" : "close"}`}>
            <div className={`modal-content ${isOpen ? "open" : "close"}`}>
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button type="button" className="modal-btn modal-confirm" onClick={onConfirm}>Confirm</button>
                    <button type="button" className="modal-btn modal-cancel" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;