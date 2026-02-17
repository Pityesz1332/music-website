import { useState, useEffect, RefObject } from "react";

export const usePlaybarInteractions = (playbarRef: RefObject<HTMLDivElement | null>) => {
    const [isManuallyCollapsed, setIsManuallyCollapsed] = useState<boolean>(true);

    useEffect(() => {
        const handleGlobalWheel = (e: WheelEvent) => {
            const playbarElement = playbarRef.current;
            if (!playbarElement) return;

            const isOverPlaybar = playbarElement.contains(e.target as Node);

            if (isOverPlaybar) {
                e.preventDefault();
            }
        };

        window.addEventListener("wheel", handleGlobalWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleGlobalWheel);
        }
    }, [playbarRef]);

    const handlePlaybarTap = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;

        const isInteractiveClick =
            target.closest("button") ||
            target.closest("input") ||
            target.closest(".playbar__volume-wrapper") ||
            target.closest(".playbar__progress");

        if (!isInteractiveClick) {
            setIsManuallyCollapsed(prev => !prev);
        }
    };

    return {
        isManuallyCollapsed,
        handlePlaybarTap
    };
};