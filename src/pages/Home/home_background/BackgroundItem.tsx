import { memo } from "react";
import { Background } from "../../../types/background";

interface BackgroundItemProps {
    bg: Background;
    isActive: boolean;
}

export const BackgroundItem = memo(({ bg, isActive }: BackgroundItemProps) => {
    const bgClass = `home__background ${isActive ? "home__background--active" : ""}`;

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