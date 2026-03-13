import { ErrorState } from "./ErrorState";
import { SONGS_STRINGS } from "../../../i18n/ui/songs";

interface SongsStatusProps {
    loading: boolean;
    error: string | null;
    retry: () => void;
}

export const SongsStatus = ({ loading, error, retry }: SongsStatusProps) => {
    // töltési logika
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
    
    // hibakezelés, fallback oldal
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