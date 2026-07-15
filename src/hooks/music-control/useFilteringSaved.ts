import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { Song } from "@interfaces/music";

export const useFilteringSaved = (savedSongs: Song[], itemsPerPage: number = 15) => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<number>(1);

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search")?.toLowerCase() ?? "";

    // Filtering saved tracks based on the search query.
    const filteredSongs = useMemo(() => {
        return savedSongs.filter(song =>
            searchQuery === "" ? true : song.title.toLowerCase().includes(searchQuery)
    );
    }, [savedSongs, searchQuery]);

    // Reset pagination to page one on new search.
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, itemsPerPage]);

    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSongs = filteredSongs.slice(startIndex, startIndex + itemsPerPage);

    const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
    const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

    return {
        searchQuery,
        filteredSongs,
        currentSongs,
        currentPage, setCurrentPage,
        itemsPerPage, totalPages,
        nextPage,
        prevPage
    };
};