import "./ErrorState.scss";

interface ErrorStateProps {
    title: string;
    txt?: string;
    btnTxt?: string;
    onBtnClick?: () => void;
}

// eetleges hiba kezelése
export const ErrorState = ({ title, txt, btnTxt, onBtnClick }: ErrorStateProps) => {
    return (
        <div className="songs__status-container">
            <h2 className="songs__error-title">{title}</h2>
            <p className="songs__error-text">{txt}</p>
            <button className="songs__retry-button" onClick={onBtnClick}>{btnTxt}</button>
        </div>
    );
};