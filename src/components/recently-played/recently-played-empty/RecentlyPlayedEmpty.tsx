import "./RecentlyPlayedEmpty.scss"
import { useNavigate } from "react-router-dom";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { RECENTLY_PLAYED_EMPTY_STRINGS } from "@i18n/ui/recently-played-empty";

export const RecentlyPlayedEmpty = () => {
    const navigate = useNavigate();

    const handleCTAClick = () => {
        navigate(MainRoutes.SONGS);
    }

    return (
        <div className="recently-played-empty-container">
            <div className="recently-played-empty-content">
                <h3>{RECENTLY_PLAYED_EMPTY_STRINGS.TITLE}</h3>
                <p>{RECENTLY_PLAYED_EMPTY_STRINGS.DESCRIPTION}</p>
                <PrimaryButton
                    className="recently-played-empty-cta-btn"
                    onClick={handleCTAClick}
                >
                    {RECENTLY_PLAYED_EMPTY_STRINGS.BUTTONS.LISTEN_NOW}
                </PrimaryButton>
            </div>
        </div>
    );
};