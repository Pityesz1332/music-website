interface UploadProgressBarProps {
    progress: number;
}

// progress bar a feltöltéshez
export const UploadProgressBar = ({ progress }: UploadProgressBarProps) => {
    if (progress <= 0) return null;

    return (
        <div className="upload-song__progress-wrapper">
            <div className="upload-song__progress-container">
                <div className="upload-song__progress-filler" style={{ width: `${progress}%` }} />
            </div>
            <span className="upload-song__progress-text">{progress}%</span>
        </div>
    );
};