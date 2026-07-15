import { useEffect, useRef, RefObject } from "react";

interface useClickOutsideProps {
    ref: RefObject<HTMLElement | null>;
    callback: () => void;
    enabled?: boolean;
}

// triggers when the click is outside the specified element
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