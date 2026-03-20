interface LoadingStateProps {
    message?: string;
    className?: string;
}

export const LoadingState = ({ message = "Loading...", className = "" }: LoadingStateProps) => {
    return (
        <div className={`songs ${className}`}>
            <div className="songs__status-container loading-container">
                <div className="loading-spinner"></div>
                <p>{message}</p>
            </div>
        </div>
    );
};