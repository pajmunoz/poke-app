import { useState, useEffect, useCallback, useRef } from 'react';
import { getPokemons, Pokemon, PokemonListParams } from '../api/pokemonAPI';
import { isArray, hasItems } from '../utils/helpers';
import { usePagination } from './usePagination';
import { useSearch } from './useSearch';

export const usePokemonList = (initialLimit: number = 8) => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const pagination = usePagination(initialLimit);
    const search = useSearch();

    // Usar refs para evitar dependencias circulares
    const searchRef = useRef(search);
    const paginationRef = useRef(pagination);

    // Actualizar refs cuando cambien los hooks
    useEffect(() => {
        searchRef.current = search;
        paginationRef.current = pagination;
    }, [search, pagination]);

    // Función para cargar la lista de Pokémon
    const fetchPokemons = useCallback(async (params: PokemonListParams = {}) => {
        console.log('fetchPokemons called with params:', params);
        // No cargar si hay una búsqueda activa
        if (searchRef.current.isSearchActive) {
            console.log('Search is active, skipping fetchPokemons');
            return;
        }
        
        setLoading(true);
        setError(null);

        try {
            const response = await getPokemons(params);
            
            if (response && isArray(response.results)) {
                setPokemons(response.results);
                
                paginationRef.current.updatePagination({
                    total: response.total || response.count || 0,
                    limit: params.limit || initialLimit,
                    offset: params.offset || 0,
                    hasNext: !!response.next,
                    hasPrevious: !!response.previous
                });
                
                // Si no hay búsqueda activa, resetear el estado de búsqueda
                if (!searchRef.current.searchQuery.trim()) {
                    searchRef.current.setSearchActive(false);
                }
            } else {
                setPokemons([]);
                paginationRef.current.updatePagination({
                    total: 0,
                    limit: params.limit || initialLimit,
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
    }, [initialLimit]); // Solo depende de initialLimit

    // Función para buscar Pokémon
    const searchPokemon = useCallback(async (query: string) => {
        if (!query.trim()) {
            searchRef.current.clearSearch();
            // Llamar fetchPokemons directamente
            return await fetchPokemons({ limit: initialLimit, offset: 0 });
        }

        setLoading(true);
        setError(null);
        searchRef.current.setSearchActive(true);

        try {
            const result = await searchRef.current.performSearch(query);
            if (result) {
                setPokemons(result.pokemons);
                paginationRef.current.updatePagination({
                    total: result.total,
                    limit: result.pokemons.length,
                    offset: 0,
                    hasNext: false,
                    hasPrevious: false
                });
            } else {
                // Si no se encontró el Pokémon, vaciar la lista
                setPokemons([]);
                paginationRef.current.updatePagination({
                    total: 0,
                    limit: 0,
                    offset: 0,
                    hasNext: false,
                    hasPrevious: false
                });
            }
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to search pokemons';
            setError(errorMessage);
            setPokemons([]);
        } finally {
            setLoading(false);
        }
    }, [fetchPokemons, initialLimit]);

    // Función para refrescar la lista
    const refreshPokemons = useCallback(() => {
        console.log('refreshPokemons called with initialLimit:', initialLimit);
        searchRef.current.clearSearch();
        paginationRef.current.resetPagination();
        fetchPokemons({
            limit: initialLimit,
            offset: 0
        });
    }, [fetchPokemons, initialLimit]);

    // Función para limpiar búsqueda y volver a la lista normal
    const clearSearch = useCallback(() => {
        searchRef.current.clearSearch();
        paginationRef.current.resetPagination();
        fetchPokemons({
            limit: initialLimit,
            offset: 0
        });
    }, [fetchPokemons, initialLimit]);

    // Cargar Pokémon al montar el componente
    useEffect(() => {
        // Verificar si hay token antes de hacer la llamada
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        
        fetchPokemons();
    }, []); // Solo se ejecuta una vez al montar

    return {
        // Estado
        pokemons,
        loading,
        error,
        pagination: pagination.pagination,
        isSearchActive: search.isSearchActive,
        searchQuery: search.searchQuery,
        
        // Funciones de paginación
        loadNextPage: () => {
            const params = pagination.loadNextPage();
            if (params) fetchPokemons(params);
        },
        loadPreviousPage: () => {
            const params = pagination.loadPreviousPage();
            if (params) fetchPokemons(params);
        },
        changeLimit: (newLimit: number) => {
            const params = pagination.changeLimit(newLimit);
            fetchPokemons(params);
        },
        goToPage: (page: number) => {
            const params = pagination.goToPage(page);
            fetchPokemons(params);
        },
        
        // Funciones de búsqueda
        searchPokemon,
        refreshPokemons,
        clearSearch,
        
        // Utilidades
        clearError: () => setError(null),
        hasPokemons: hasItems(pokemons),
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages
    };
};
