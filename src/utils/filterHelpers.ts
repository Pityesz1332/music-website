import { SONGS_STRINGS } from "@i18n/ui/songs";
import { SortField, SortOrder } from "@interfaces/sort"

export const getFilterLabel = (
    selectedGenre: string,
    sortField: SortField,
    sortOrder: SortOrder
) : string => {
    const activeFilters: string[] = [];

    if (selectedGenre !== SONGS_STRINGS.FILTER.ALL) {
        activeFilters.push(`${SONGS_STRINGS.FILTER.GENRE_PREFIX}${selectedGenre}`);
    }

    if (sortField !== SONGS_STRINGS.FILTER.NONE) {
        const fieldLabel = sortField === "name"
            ? SONGS_STRINGS.FILTER.BY_NAME
            : SONGS_STRINGS.FILTER.BY_DURATION;

        const orderLabel = sortOrder === "asc"
            ? SONGS_STRINGS.FILTER.ASC
            : SONGS_STRINGS.FILTER.DESC;

        activeFilters.push(`${SONGS_STRINGS.FILTER.SORT_PREFIX}${fieldLabel} - ${orderLabel}`);
    }

    return activeFilters.length === 0
        ? SONGS_STRINGS.FILTER.LABEL
        : activeFilters.join(" | ");
};