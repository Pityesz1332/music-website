export enum MainRoutes {
    HOME = "/",
    SONGS = '/songs',
    SPECIFIC_SONG = '/songs/:id',
    SAVED = '/saved',
    MY_ACCOUNT = '/myaccount',
    ADMIN_CONNECT = '/admin/connect',
    ADMIN_DASHBOARD = '/admin',
    ADMIN_SONGS = '/admin/songs',
    ADMIN_USERS = '/admin/users',
    NOT_FOUND = '*'
}

export const getSongPath = (id: string | number) => MainRoutes.SPECIFIC_SONG.replace(':id', String(id));