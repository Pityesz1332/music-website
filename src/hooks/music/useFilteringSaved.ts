import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { Song } from "../../types/music";

export const useFilteringSaved = (savedSongs: Song[]) => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 15;

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search")?.toLowerCase() ?? "";

    // mentett zenék szűrése a keresőszó alapján
    const filteredSongs = useMemo(() => {
        return savedSongs.filter(song =>
            searchQuery === "" ? true : song.title.toLowerCase().includes(searchQuery)
    );
    }, [savedSongs, searchQuery]);

    // ha új keresés indul, vissza az első oldalra
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSongs = filteredSongs.slice(startIndex, startIndex + itemsPerPage);

    // lapozás
    const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
    const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

    return {
        searchQuery,
        filteredSongs,
        currentSongs,
        currentPage, setCurrentPage,
        totalPages,
        nextPage,
        prevPage
    };
};