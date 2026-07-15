import { SONGS_STRINGS } from "@i18n/ui/songs";
import { EmptyState } from "@components/ui/empty-state/EmptyState";

interface SongsEmptyProps {
    onRetry?: () => void;
}

// Shown when the Swarm catalog itself is empty (nothing published / couldn't load),
// as opposed to a search or filter that simply matched no results.
export const SongsEmpty = ({ onRetry }: SongsEmptyProps) => {
    return (
        <EmptyState
            title={SONGS_STRINGS.EMPTY.TITLE}
            description={SONGS_STRINGS.EMPTY.MESSAGE}
            buttonText={SONGS_STRINGS.EMPTY.RETRY_BTN}
            onButtonClick={onRetry}
        />
    );
};
