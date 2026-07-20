export const SONG_PAGE_STRINGS = {
    ERROR: {
        NOT_FOUND: "Song not found",
    },
    INFO: {
        GENRE: "Genre:",
        DURATION: "Duration:",
    },
    CONTROLS: {
        PLAY: "PLAY",
        STOP: "STOP",
    },
    PLAYLIST: {
        TITLE: "Following up songs",
        EMPTY_MESSAGE: "Your playlist is empty",
        EMPTY_BTN: "Listen now"
    },
    CONTEXT_MENU: {
        EDIT: "Edit",
        DELETE: "Delete",
    },
    MODAL: {
        DELETE_TITLE: "Delete Song",
        DELETE_DESCRIPTION: (songTitle: string) => `Are you sure you want to remove "${songTitle}" from the playlist?`,
        CONFIRM: "Confirm",
        CANCEL: "Cancel",
    }
} as const;