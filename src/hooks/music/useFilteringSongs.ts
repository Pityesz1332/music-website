import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import type { Song } from "../../types/music";
import songsData from "../../data/songs.json";

export const useFilteringSongs = (itemsPerPage: number = 15) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const location = useLocation();

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
    
    // szűrés műfaj/keresőszó alapján
    const filteredSongs = useMemo(() => {
        return songs.filter(song => selectedGenre === "All" ? true : song.genre === selectedGenre)
                    .filter(song => searchQuery === "" ? true : song.title.toLowerCase().includes(searchQuery));
    }, [songs, selectedGenre, searchQuery]);

    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

    // csak az aktuális oldalra eső dalok (lapozás)
    const currentSongs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredSongs.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredSongs, currentPage, itemsPerPage]);

    // ha változik a szűrés, ugorjunk vissza az első oldalra
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGenre, searchQuery]);

    // műfajváltás kezelője
    const handleGenreChange = (genre: string) => {
        setSelectedGenre(genre);
    };

    return {
        songs, setSongs, // ha manuálisan kellene frissíteni később
        filteredSongs,
        currentSongs,
        genres,
        selectedGenre,
        searchQuery,
        currentPage, setCurrentPage,
        totalPages,
        loading,
        error,
        handleGenreChange,
        retry: loadSongs
    };
};