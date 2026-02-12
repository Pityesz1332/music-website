import { useState, ChangeEvent } from "react";

export const useAvatarUpload = (initialAvatar: string | null = null) => {
    const [avatar, setAvatar] = useState<string | null>(initialAvatar);

    // fálfeltöltés a profilkép megváltoztatásához
    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return { avatar, handleAvatarChange };
};