import { memo } from "react";
import { Background } from "@interfaces/background";
import "./BackgroundItem.scss"

interface BackgroundItemProps {
    bg: Background;
    isActive: boolean;
}

// ez a kód felel a háttérelemek rendereléséért.
// a memo itt fontos. megakadályozza, hogy háttérelem
// újrarenderelődjön, ha a szülő koponens állapota változik, 
// de ez az adott háttér nem érintett.
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