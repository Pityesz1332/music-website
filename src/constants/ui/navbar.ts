import { Home, Music, Heart, User } from "lucide-react";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { NAVBAR_STRINGS } from "@i18n/ui/navbar";

// Public navigation items, rendered by the Navbar (mapped to <NavLink>).
// Add an entry here to add a menu link — no Navbar markup changes needed.
export const NAV_CONFIG = [
    {
        path: MainRoutes.HOME,
        label: NAVBAR_STRINGS.MENU.HOME,
        Icon: Home,
    },
    {
        path: MainRoutes.SONGS,
        label: NAVBAR_STRINGS.MENU.SONGS_MIXES,
        Icon: Music,
    },
    {
        path: MainRoutes.SAVED,
        label: NAVBAR_STRINGS.MENU.FAVORITES,
        Icon: Heart,
    },
    {
        path: MainRoutes.MY_ACCOUNT,
        label: NAVBAR_STRINGS.MENU.ACCOUNT,
        Icon: User,
    },
] as const;