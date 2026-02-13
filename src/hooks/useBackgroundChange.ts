import { useState, useEffect } from "react";
import { Background } from "../types/background";

export const useBackgroundChange = (backgrounds: Background[], intervalMs: number = 5000) => {
    const [bgIndex, setBgIndex] = useState<number>(0);

    useEffect(() => {
        if (backgrounds.length <= 1) return;
        
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backgrounds.length);
        }, intervalMs);

        return () => clearInterval(interval);
    }, [backgrounds.length, intervalMs]);

    return { bgIndex, backgrounds };
};