import { Music, Heart, User } from "lucide-react";
import { MainRoutes } from "@routes/constants/MainRoutes";
import { NAVBAR_STRINGS } from "@i18n/ui/navbar";

// a navbar listaelemei
export const NAV_CONFIG = [
    {
        path: MainRoutes.SONGS,
        label: NAVBAR_STRINGS.MENU.SONGS_MIXES,
        Icon: Music,
        isProtected: false,
    },
    {
        path: MainRoutes.SAVED,
        label: NAVBAR_STRINGS.MENU.FAVORITES,
        Icon: Heart,
        isProtected: true,
    },
    {
        path: MainRoutes.MY_ACCOUNT,
        label: NAVBAR_STRINGS.MENU.ACCOUNT,
        Icon: User,
        isProtected: true,
    }
] as const;