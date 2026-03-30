import { Modal } from "@components/ui/modal/Modal";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { CONNECT_MODAL_STRINGS } from "@i18n/modal/connect-modal";

interface ConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmDemo: () => void;
    onConfirmDev: () => void;
}

// modal, hogy kiválaszthassa a user a login módját
export const ConnectModal = ({ isOpen, onClose, onConfirmDemo, onConfirmDev }: ConnectModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={CONNECT_MODAL_STRINGS.TITLE}
            description={CONNECT_MODAL_STRINGS.DESCRIPTION}
            buttons={
                <>
                    <PrimaryButton onClick={onConfirmDemo}>
                        {CONNECT_MODAL_STRINGS.BUTTONS.USEPASSKEY}
                    </PrimaryButton>
                    <PrimaryButton onClick={onConfirmDev}>
                        {CONNECT_MODAL_STRINGS.BUTTONS.USEDEVCONNECT}
                    </PrimaryButton>
                    <button
                        className="modal__cancel-btn"
                        onClick={onClose}
                    >
                        {CONNECT_MODAL_STRINGS.BUTTONS.CANCEL}
                    </button>
                </>
            }
        />
    );
};