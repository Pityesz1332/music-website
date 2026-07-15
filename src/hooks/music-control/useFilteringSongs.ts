import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Song } from "@interfaces/music";
import type { SortField, SortOrder } from "@interfaces/sort";
import { useSongsFromSwarm } from "@hooks/swarm/useSongsFromSwarm";

export const useFilteringSongs = (itemsPerPage: number = 15) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortField, setSortField] = useState<SortField>("none");
    const [sortOrder, setSortOrder] = useState<SortOrder>("none");
    const [maxDuration, setMaxDuration] = useState<number | null>(null);

    const location = useLocation();
    const navigate = useNavigate();

    const { songs: swarmSongs, loading: swarmLoading, error: swarmError } = useSongsFromSwarm();
    
    // duration to number for sorting
    const parseDuration = (duration: string) => {
        const parts = duration.split(":").map(Number);
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        return 0;
    };

    // The Swarm catalog is the single source of truth for songs.
    const loadSongs = useCallback(() => {
        setSongs(swarmSongs);
        setError(swarmError);
        setLoading(false);
    }, [swarmSongs, swarmError]);

    // Mirror the Swarm catalog into local state once it has loaded.
    useEffect(() => {
        if (!swarmLoading) {
            loadSongs();
        }
    }, [swarmLoading, loadSongs]);

    // Extracting search query from the URL.
    const searchQuery = useMemo(() => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get("search")?.toLowerCase() ?? "";
    }, [location.search]);

    // Extracting genre from lists
    const genres = useMemo(() => {
        return ["All", ...new Set(songs.map(song => song.genre))];
    }, [songs]);

    // Min/Max bounds from full song list
    const durationBounds = useMemo(() => {
        if (songs.length === 0) return { min: 0, max: 0 };
        const durations = songs.map(s => parseDuration(s.duration));
        return {
            min: Math.min(...durations),
            max: Math.max(...durations)
        };
    }, [songs]);

    const isDurationActive = maxDuration !== null && maxDuration !== durationBounds.max;

    const clearFilters = useCallback(() => {
        setSelectedGenre("All");
        setSortField("none");
        setSortOrder("none");
        setMaxDuration(null);
        setCurrentPage(1);

        if (location.search) {
            navigate(location.pathname, { replace: true });
        }
    }, [durationBounds, location.pathname, location.search, navigate]);
    
    // based on filtering
    const filteredSongs = useMemo(() => {
        const effectiveMax = maxDuration ?? durationBounds.max;
        
        let result = songs.filter(song => {
            const duration = parseDuration(song.duration);
            const matchesGenre = selectedGenre === "All" || song.genre === selectedGenre;
            const matchesSearch = searchQuery === "" || song.title.toLowerCase().includes(searchQuery);
            const matchesDuration = duration <= effectiveMax;
            return matchesGenre && matchesSearch && matchesDuration;
        });
        
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
    }, [songs, selectedGenre, searchQuery, sortField, sortOrder, maxDuration]);

    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

    const currentSongs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredSongs.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredSongs, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGenre, searchQuery, sortField, sortOrder, maxDuration]);

    // genre handling
    const handleGenreChange = (genre: string) => setSelectedGenre(genre);

    // sorting
    const handleSort = (field: SortField, order: SortOrder) => {
        if (sortField === field && sortOrder === order) {
            setSortField("none");
            setSortOrder("none");
        } else {
            setSortField(field);
            setSortOrder(order);
        }
    };

    const handleDurationChange = (max: number) => {
        setMaxDuration(max);
    };

    return {
        songs, setSongs,
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
        maxDuration,
        durationBounds,
        isDurationActive,
        handleGenreChange,
        handleSort,
        handleDurationChange,
        clearFilters,
        retry: loadSongs
    };
};