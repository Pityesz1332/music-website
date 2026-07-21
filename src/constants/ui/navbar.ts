import { Music } from "lucide-react";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { NAVBAR_STRINGS } from "@i18n/ui/navbar";

export const NAV_CONFIG = [
    {
        path: MainRoutes.SONGS,
        label: NAVBAR_STRINGS.MENU.SONGS_MIXES,
        Icon: Music,
        isProtected: false,
    }
] as const;