import { Music, Heart, User } from "lucide-react";
import { MainRoutes } from "../../routes/constants/MainRoutes";
import { NAVBAR_STRINGS } from "../../i18n/ui/navbar";

export const PUBLIC_NAV_ITEMS = [
    {
        path: MainRoutes.SONGS,
        label: NAVBAR_STRINGS.MENU.SONGS_MIXES,
        Icon: Music,
    }
];

export const PROTECTED_NAV_ITEMS = [
    {
        path: MainRoutes.SAVED,
        label: NAVBAR_STRINGS.MENU.FAVORITES,
        Icon: Heart,
    },
    {
        path: MainRoutes.MY_ACCOUNT,
        label: NAVBAR_STRINGS.MENU.ACCOUNT,
        Icon: User,
    }
];