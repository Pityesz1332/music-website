export const SAVED_STRINGS = {
    LOADING: "Loading saved songs...",
    TITLE: "Your Favorite Songs",
    EMPTY_STATE: {
        NO_SAVED: "You have no saved songs.",
        BROWSE_BTN: "Browse songs",
    },
    SEARCH: {
        NOT_FOUND: (query: string) => `No song found with "${query}"`,
        RESET_BTN: "Reset search",
    },
    PAGINATION: {
        PREV: "Prev",
        NEXT: "Next",
        PAGE_INFO: (current: number, total: number) => `Page ${current} / ${Math.max(total, 1)}`,
    }
} as const;