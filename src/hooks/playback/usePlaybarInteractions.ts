import { useState, useEffect, useCallback, RefObject } from "react";

// Controls the physical behavior of the playbar.
// Handles scroll collisions and the expand/collapse logic of the bar.
export const usePlaybarInteractions = (playbarRef: RefObject<HTMLDivElement | null>) => {
    const [isManuallyCollapsed, setIsManuallyCollapsed] = useState<boolean>(true);
    const [isLooping, setIsLooping] = useState<boolean>(false);

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

    // smart clickhandler
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

    const handleToggleLoop = useCallback(() => {
        setIsLooping(prev => !prev);
    }, []);

    return {
        isManuallyCollapsed,
        handlePlaybarTap,
        isLooping,
        handleToggleLoop,
    };
};