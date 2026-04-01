import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Song } from "@interfaces/music";
import type { SortField, SortOrder } from "@interfaces/sort";
import songsData from "@data/songs.json";

export const useFilteringSongs = (itemsPerPage: number = 15) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortField, setSortField] = useState<SortField>("none");
    const [sortOrder, setSortOrder] = useState<SortOrder>("none");

    const location = useLocation();
    const navigate = useNavigate();

    // zenék betöltése új fájlból és localstorage-ból
    const loadSongs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const baseSongs = songsData as Song[];
            const savedToLocal = localStorage.getItem("admin_songs");
            const uploadedSongs: Song[] = savedToLocal ? JSON.parse(savedToLocal) : [];
            
            // listák összefűzése
            const allSongs = [...uploadedSongs, ...baseSongs];
            const uniqueSongs = Array.from(new Map(allSongs.map(s => [s.id, s])).values());
            
            setSongs(uniqueSongs);
        } catch (err) {
            setError("Failed to load songs");
        } finally {
            setLoading(false);
        }
    }, []);

    // betöltés indítása az első futáskor
    useEffect(() => {
        loadSongs();
    }, [loadSongs]);

    // keresés kinyerése az url-ből
    const searchQuery = useMemo(() => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get("search")?.toLowerCase() ?? "";
    }, [location.search]);

    // genre kigyűjtése a listából
    const genres = useMemo(() => {
        return ["All", ...new Set(songs.map(song => song.genre))];
    }, [songs]);

    // duration számmá alakítása a sorting-hoz
    const parseDuration = (duration: string) => {
        const parts = duration.split(":").map(Number);
        if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        }
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        return 0;
    };

    const clearFilters = useCallback(() => {
        setSelectedGenre("All");
        setSortField("none");
        setSortOrder("none");
        setCurrentPage(1);

        if (location.search) {
            navigate(location.pathname, { replace: true });
        }
    }, [location.pathname, location.search, navigate]);
    
    // szűrés alapján
    const filteredSongs = useMemo(() => {
        let result = songs.filter(song => 
            (selectedGenre === "All" ? true : song.genre === selectedGenre) &&
            (searchQuery === "" ? true : song.title.toLowerCase().includes(searchQuery))
        );
            
        if (sortField !== "none") {
            result.sort((a, b) => {
                let valueA: string | number;
                let valueB: string | number;
        
                if (sortField === "name") {
                    valueA = a.title.toLowerCase();
                    valueB = b.title.toLowerCase();
                } else {
                    valueA = parseDuration(a.duration);
                    valueB = parseDuration(b.duration);
                }
        
                if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
                if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
        }

        return result
    }, [songs, selectedGenre, searchQuery, sortField, sortOrder]);

    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

    // csak az aktuális oldalra eső dalok (lapozás)
    const currentSongs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredSongs.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredSongs, currentPage, itemsPerPage]);

    // ha változik a szűrés, ugorjunk vissza az első oldalra
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGenre, searchQuery, sortField, sortOrder]);

    // műfajváltás kezelője
    const handleGenreChange = (genre: string) => setSelectedGenre(genre);

    // sorting kezelése
    const handleSort = (field: SortField, order: SortOrder) => {
        setSortField(field);
        setSortOrder(order);
    };

    return {
        songs, setSongs, // ha manuálisan kellene frissíteni később
        filteredSongs,
        currentSongs,
        genres,
        selectedGenre,
        searchQuery,
        sortField,
        sortOrder,
        currentPage, setCurrentPage,
        totalPages,
        loading,
        error,
        handleGenreChange,
        handleSort,
        clearFilters,
        retry: loadSongs
    };
};