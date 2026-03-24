import { MainRoutes } from "@routes/constants/MainRoutes";
import { SONGS_STRINGS } from "@i18n/ui/songs";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";

interface SongsNoResultsProps {
    searchQuery: string;
}

export const SongsNoResults = ({ searchQuery }: SongsNoResultsProps) => {
    return (
        <div className="songs__no-results">
            <h2 className="songs__no-results-title">{SONGS_STRINGS.NO_RESULTS.MESSAGE(searchQuery)}</h2>
            <PrimaryButton 
                className="songs__reset-button"
                to={MainRoutes.SONGS}
            >
                {SONGS_STRINGS.NO_RESULTS.RESET_BTN}
            </PrimaryButton>
        </div>
    );
};