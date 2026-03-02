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