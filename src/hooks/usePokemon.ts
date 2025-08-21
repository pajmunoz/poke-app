import { useState, useEffect, useCallback } from 'react';
import { getPokemons, getPokemonById, searchPokemons, PokemonListResponse, Pokemon, PokemonListParams } from '../api/pokemonAPI';
import { isArray, hasItems, calculateCurrentPage, calculateTotalPages, ensureMin } from '../utils/helpers';

export const usePokemon = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [pagination, setPagination] = useState({
        total: 0,
        limit: 5,
        offset: 0,
        hasNext: false,
        hasPrevious: false
    });

    // Función para cargar la lista de Pokémon
    const fetchPokemons = useCallback(async (params: PokemonListParams = {}) => {
        // No cargar si hay una búsqueda activa
        if (isSearchActive) return;
        
        setLoading(true);
        setError(null);

        try {
            const response = await getPokemons(params);
            
            if (response && isArray(response.results)) {
                setPokemons(response.results);
                
                const newPagination = {
                    total: response.total || response.count || 0,
                    limit: params.limit || 5,
                    offset: params.offset || 0,
                    hasNext: !!response.next,
                    hasPrevious: !!response.previous
                };
                
                setPagination(newPagination);
                
                // Si no hay búsqueda activa, resetear el estado de búsqueda
                if (!searchQuery.trim()) {
                    setIsSearchActive(false);
                }
            } else {
                setPokemons([]);
                setPagination({
                    total: 0,
                    limit: 5,
                    offset: 0,
                    hasNext: false,
                    hasPrevious: false
                });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pokemons';
            setError(errorMessage);
            setPokemons([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, isSearchActive]);

    // Función para cargar la siguiente página
    const loadNextPage = useCallback(() => {
        if (pagination.hasNext) {
            fetchPokemons({
                limit: pagination.limit,
                offset: pagination.offset + pagination.limit
            });
        }
    }, [pagination, fetchPokemons]);

    // Función para cargar la página anterior
    const loadPreviousPage = useCallback(() => {
        if (pagination.hasPrevious) {
            fetchPokemons({
                limit: pagination.limit,
                offset: ensureMin(pagination.offset - pagination.limit, 0)
            });
        }
    }, [pagination, fetchPokemons]);

    // Función para cambiar el límite de Pokémon por página
    const changeLimit = useCallback((newLimit: number) => {
        fetchPokemons({
            limit: newLimit,
            offset: 0
        });
    }, [fetchPokemons]);

    // Función para ir a una página específica
    const goToPage = useCallback((page: number) => {
        const offset = page * pagination.limit;
        fetchPokemons({
            limit: pagination.limit,
            offset
        });
    }, [pagination.limit, fetchPokemons]);

    // Función para buscar Pokémon
    const searchPokemon = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchQuery('');
            setIsSearchActive(false);
            // Llamar fetchPokemons directamente sin dependencias circulares
            const response = await getPokemons({ limit: 5, offset: 0 });
            if (response && isArray(response.results)) {
                setPokemons(response.results);
                setPagination({
                    total: response.total || response.count || 0,
                    limit: 5,
                    offset: 0,
                    hasNext: !!response.next,
                    hasPrevious: !!response.previous
                });
            }
            return;
        }

        setLoading(true);
        setError(null);
        setIsSearchActive(true);
        setSearchQuery(query);

        try {
            const pokemonResult = await searchPokemons(query);
            
            if (pokemonResult && pokemonResult.id && pokemonResult.name) {
                // Convertir el resultado único en una lista para mantener consistencia
                const pokemonList = [pokemonResult];
                setPokemons(pokemonList);
                setPagination({
                    total: 1,
                    limit: 1,
                    offset: 0,
                    hasNext: false,
                    hasPrevious: false
                });
                setError(null);
            } else {
                setPokemons([]);
                setPagination({
                    total: 0,
                    limit: 5,
                    offset: 0,
                    hasNext: false,
                    hasPrevious: false
                });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to search pokemons';
            setError(errorMessage);
            setPokemons([]);
        } finally {
            setLoading(false);
        }
    }, []); // Sin dependencias circulares

    // Función para refrescar la lista
    const refreshPokemons = useCallback(() => {
        setIsSearchActive(false);
        setSearchQuery('');
        fetchPokemons({
            limit: pagination.limit,
            offset: 0
        });
    }, [fetchPokemons, pagination.limit]);

    // Función para limpiar búsqueda y volver a la lista normal
    const clearSearch = useCallback(() => {
        setIsSearchActive(false);
        setSearchQuery('');
        fetchPokemons({
            limit: pagination.limit,
            offset: 0
        });
    }, [fetchPokemons, pagination.limit]);

    // Cargar Pokémon al montar el componente
    useEffect(() => {
        fetchPokemons();
    }, [fetchPokemons]);

    return {
        // Estado
        pokemons,
        loading,
        error,
        pagination,
        isSearchActive,
        searchQuery,
        
        // Funciones
        fetchPokemons,
        loadNextPage,
        loadPreviousPage,
        changeLimit,
        goToPage,
        searchPokemon,
        refreshPokemons,
        clearSearch,
        
        // Utilidades
        clearError: () => setError(null),
        hasPokemons: hasItems(pokemons),
        currentPage: calculateCurrentPage(pagination.offset, pagination.limit),
        totalPages: calculateTotalPages(pagination.total, pagination.limit)
    };
};

// Hook específico para un Pokémon individual
export const usePokemonById = (id: number | string | null) => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPokemon = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getPokemonById(id);
            setPokemon(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pokemon';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPokemon();
    }, [fetchPokemon]);

    return {
        pokemon,
        loading,
        error,
        refetch: fetchPokemon,
        clearError: () => setError(null)
    };
};
