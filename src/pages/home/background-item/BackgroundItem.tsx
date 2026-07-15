import { memo } from "react";
import { Background } from "@interfaces/background";
import "./BackgroundItem.scss"

interface BackgroundItemProps {
    bg: Background;
    isActive: boolean;
}

// Responsible for rendering background elements.
// Memo is crucial here to prevent the background from re-rendering 
// when the parent component updates, unless this specific element is affected.
export const BackgroundItem = memo(({ bg, isActive }: BackgroundItemProps) => {
    const bgClass = `background-item ${isActive ? "background-item--active" : ""}`;

    if (bg.type === "image") {
        return (
            <div
                className={bgClass}
                style={{ backgroundImage: `url(${bg.src})` }}
                aria-hidden="true"
            />
        );
    }
        
        return (
            <video
            className={bgClass}
            src={bg.src}
            autoPlay
            muted={true}
            loop
            playsInline
            aria-hidden="true"
        />
    );
});