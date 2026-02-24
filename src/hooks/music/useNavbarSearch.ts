import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainRoutes } from "../../routes/constants/Main_Routes";

// a navbar keresésért felelős hook-ja
export const useNavbarSearch = (closeMenu: () => void) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const executeSearch = () => {
        const cleaned = searchTerm.trim();

        if (cleaned !== "") {
            navigate(`${MainRoutes.SONGS}?search=${encodeURIComponent(cleaned)}`);
            setSearchTerm("");
            setIsFocused(false);
            closeMenu();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            executeSearch();
        }
    };

    const handleBlur = () => {
        setTimeout(() => setIsFocused(false), 200);
    };

    return {
        searchTerm, setSearchTerm,
        isFocused, setIsFocused,
        executeSearch,
        handleKeyDown,
        handleBlur
    };
};