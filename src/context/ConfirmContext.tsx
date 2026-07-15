import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { Modal } from "../components/ui/modal/Modal";

export interface ConfirmOptions {
    title: string;
    message: string;
}

interface ConfirmContextType {
    // opens the confirm dialog and resolves to true (confirmed) or false (cancelled)
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

interface ConfirmProviderProps {
    children: ReactNode;
}

// mounts a single ConfirmModal for the whole app and exposes an async confirm()
// so any component can await a yes/no answer instead of wiring its own modal state
export const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const resolverRef = useRef<((result: boolean) => void) | null>(null);

    const confirm = useCallback((opts: ConfirmOptions) => {
        setOptions(opts);
        return new Promise<boolean>((resolve) => {
            resolverRef.current = resolve;
        });
    }, []);

    const close = useCallback((result: boolean) => {
        resolverRef.current?.(result);
        resolverRef.current = null;
        setOptions(null);
    }, []);

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <Modal
                isOpen={!!options}
                onClose={() => close(false)}
                title={options?.title ?? ""}
                description={options?.message ?? ""}
                buttons={
                    <>
                        <button type="button" onClick={() => close(false)}>
                            Cancel
                        </button>
                        <button type="button" onClick={() => close(true)}>
                            Confirm
                        </button>
                    </>
                }
            />
        </ConfirmContext.Provider>
    );
}

export function useConfirm(): ConfirmContextType {
    const context = useContext(ConfirmContext);
    if (!context) throw new Error("useConfirm must be used within a ConfirmProvider");
    return context;
}
