import { Modal } from "@components/ui/modal/Modal";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { HISTORY_MODAL_STRINGS } from "@i18n/modal/history-modal";
import "./HistoryModal.scss";

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

// modal az előzmény törlések megerősítéséhez
export const HistoryModal = ({ isOpen, onClose, onConfirm }: HistoryModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={HISTORY_MODAL_STRINGS.TITLE}
            description={HISTORY_MODAL_STRINGS.DESCRIPTION}
            buttons={
                <>
                    <PrimaryButton 
                        className="modal__cancel-btn"
                        onClick={onClose}
                    >
                        {HISTORY_MODAL_STRINGS.BUTTONS.CANCEL}
                    </PrimaryButton>
                    <PrimaryButton onClick={onConfirm}>
                        {HISTORY_MODAL_STRINGS.BUTTONS.CONFIRM}
                    </PrimaryButton>
                </>
            }
        />
    );
};