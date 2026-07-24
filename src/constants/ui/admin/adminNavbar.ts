import { MainRoutes } from "@routes/constants/MainRoutes";
import { ADMIN_NAVBAR_STRINGS } from "@i18n/ui/admin/navbar";

// admin navbar list items
export const ADMIN_NAV_ITEMS = [
    {
        path: MainRoutes.ADMIN_DASHBOARD,
        label: ADMIN_NAVBAR_STRINGS.LINKS.DASHBOARD
    },
    {
        path: MainRoutes.ADMIN_SONGS,
        label: ADMIN_NAVBAR_STRINGS.LINKS.SONGS_MIXES
    }
] as const;