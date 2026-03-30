import { useEffect, useRef, RefObject } from "react";

interface useClickOutsideProps {
    ref: RefObject<HTMLElement | null>;
    callback: () => void;
    enabled?: boolean;
}

// figyeli a dokumentumon belüli kattintásokat
// és jelzi, ha azok a megadott elemen kívül történnek
export const useClickOutside = ({ ref, callback, enabled = true }: useClickOutsideProps) => {
    const savedCallback = useRef(callback);
    
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            const el = ref.current;
            if (el && !el.contains(e.target as Node)) {
                savedCallback.current();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [ref, enabled]);
};