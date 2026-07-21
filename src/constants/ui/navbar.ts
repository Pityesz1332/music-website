import { Music } from "lucide-react";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { NAVBAR_STRINGS } from "@i18n/ui/navbar";

// Public navigation items, rendered by the Navbar (mapped to <NavLink>).
// Add an entry here to add a menu link — no Navbar markup changes needed.
export const NAV_CONFIG = [
    {
        path: MainRoutes.SONGS,
        label: NAVBAR_STRINGS.MENU.SONGS_MIXES,
        Icon: Music,
    },
] as const;