export const SONGS_STRINGS = {
    LOADING: "Loading songs...",
    ERROR: {
        TITLE: "Failed to load songs",
        BTN: "Try Again",
    },
    TITLE: "Sounds for Every Moment",
    FILTER: {
        LABEL: "Filter",
        GENRE_PREFIX: "Genre: ",
        SORT_PREFIX: "Sort: ",
        SORT_BY: "Sort By",
        SORT_ORDER: "Sort Order",
        ASC: "Ascending",
        DESC: "Descending",
        BY_NAME: "By Name",
        BY_DURATION: "By Duration",
        GENRES_TITLE: "Genres",
        ACTIONS: {
            CLEAR: "Clear",
            DONE: "Done"
        }
    },
    NO_RESULTS: {
        MESSAGE: (query: string) => `No song or mix found with this word: "${query}". Reset the page`,
        RESET_BTN: "Reset page",
    },
    PAGINATION: {
        PREV: "Prev",
        NEXT: "Next",
        PAGE_INFO: (current: number, total: number) => `Page ${current} / ${total}`,
    },
    FOOTER: {
        RIGHTS: `All rights reserved`,
        FOLLOW: "Follow",
        ON_SOUNDCLOUD: "on SoundCloud",
    }
} as const;