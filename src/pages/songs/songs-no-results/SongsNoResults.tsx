import { MainRoutes } from "@routes/constants/MainRoutes";
import { SONGS_STRINGS } from "@i18n/ui/songs";
import { EmptyState } from "@components/ui/empty-state/EmptyState";

interface SongsNoResultsProps {
    searchQuery: string;
}

export const SongsNoResults = ({ searchQuery }: SongsNoResultsProps) => {
    return (
        <EmptyState
            title={SONGS_STRINGS.NO_RESULTS.MESSAGE(searchQuery)}
            buttonText={SONGS_STRINGS.NO_RESULTS.RESET_BTN}
            to={MainRoutes.SONGS}
        />
    );
};
