import { formatTime } from "../../../utils/formatTime"

interface ProgressBarProps {
    progressBarRef: React.RefObject<HTMLDivElement | null>;
    progress: number;
    hoverTime: number | null;
    hoverPos: number;
    startSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
    handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
    handleMouseLeave: () => void;
}

export const ProgressBar = ({
    progress,
    hoverTime, hoverPos,
    progressBarRef,
    startSeek,
    handleMouseMove, handleMouseLeave
}: ProgressBarProps) => {
    return (
        <div
            ref={progressBarRef}
            className="playbar__progress"
            onMouseDown={startSeek}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => e.stopPropagation()}
        >
            {hoverTime !== null && (
                <div
                    className="playbar__tooltip"
                    style={{ left: `${hoverPos}px` }}
                >
                    {formatTime(hoverTime)}
                </div>
            )}

            <div
                className="playbar__progress-filled"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};