import "./RecentlyPlayedEmpty.scss"
import { useNavigate } from "react-router-dom";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";

export const RecentlyPlayedEmpty = () => {
    const navigate = useNavigate();

    const handleCTAClick = () => {
        navigate(MainRoutes.SONGS);
    }

    return (
        <div className="recently-played-empty-container">
            <div className="recently-played-empty-content">
                <h3>There's nothing here</h3>
                <p>
                    Your history will appear here.
                </p>
                <PrimaryButton
                    className="recently-played-empty-cta-btn"
                    onClick={handleCTAClick}
                >
                    Listen now
                </PrimaryButton>
            </div>
        </div>
    );
};