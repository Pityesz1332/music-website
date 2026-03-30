interface VolumeControlProps {
    volume: number;
    volumeWrapperRef: React.RefObject<HTMLDivElement | null>;
    handleVolumeDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
    handleVolumeChanger: (e: React.ChangeEvent<HTMLInputElement>) => void;
    adjustVolume: (direction: number) => void;
}

// hangerőszabálízó, amely támogatja a kattintást, 
// húzást és görgővel való állítást is.
export const VolumeControl = ({
    volume,
    volumeWrapperRef,
    handleVolumeDragStart,
    handleVolumeChanger,
    adjustVolume
}: VolumeControlProps) => {
    return (
        <div
            ref={volumeWrapperRef}
            className="playbar__volume-wrapper"
            onMouseDown={handleVolumeDragStart}
            onWheel={(e) => {
                if (e.deltaY !== 0) {
                    const direction = e.deltaY > 0 ? 1 : -1;
                    adjustVolume(direction);
                }
            }}
        >
            <div className="playbar__volume-track">
                <div
                    className="playbar__volume-fill"
                    style={{ width: `${volume * 100}%` }}
                />
                <div
                    className="playbar__volume-thumb"
                    style={{ left: `${volume * 100}%` }}
                />
            </div>

            <input
                className="playbar__volume-hidden"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChanger}
            />
        </div>
    );
};