import { ErrorState } from "../error-state/ErrorState";
import { SONGS_STRINGS } from "@i18n/ui/songs";
import "./SongsStatus.scss";

interface SongsStatusProps {
    loading?: boolean;
    error?: string | null;
    retry?: () => void;
}

export const SongsStatus = ({ loading, error, retry }: SongsStatusProps) => {
    if (loading) {
        return (
            <div className="songs songs--loading">
                <div className="songs__status-container">
                    <div className="songs__spinner"></div>
                    <p className="songs__status-text">{SONGS_STRINGS.LOADING}</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="songs songs--error">
                <ErrorState 
                    title={SONGS_STRINGS.ERROR.TITLE}
                    txt={error}
                    btnTxt={SONGS_STRINGS.ERROR.BTN}
                    onBtnClick={retry}
                />
            </div>
        );
    }

    return null;
}