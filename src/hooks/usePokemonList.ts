import { useState, useEffect, useCallback, useRef } from 'react';
import { getPokemons, Pokemon, PokemonListParams } from '../api/pokemonAPI';
import { isArray, hasItems } from '../utils/helpers';
import { usePagination } from './usePagination';
import { useSearch } from './useSearch';

export const usePokemonList = (initialLimit: number = 5) => {
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
        console.log('🚀 fetchPokemons called with params:', params);
        console.log('🚀 Current loading state:', loading);
        console.log('🚀 isSearchActive:', searchRef.current.isSearchActive);
        
        // No cargar si hay una búsqueda activa
        if (searchRef.current.isSearchActive) {
            console.log('🚀 Search is active, skipping fetch');
            return;
        }
        
        console.log('🚀 Setting loading to true');
        setLoading(true);
        setError(null);

        try {
            console.log('🚀 Calling getPokemons API...');
            const response = await getPokemons(params);
            console.log('🚀 API response received:', response);
            
            if (response && isArray(response.results)) {
                console.log('🚀 Setting pokemons:', response.results.length);
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
                console.log('🚀 No valid response, setting empty pokemons');
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
            console.error('🚀 Error in fetchPokemons:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pokemons';
            setError(errorMessage);
            setPokemons([]);
        } finally {
            console.log('🚀 Setting loading to false');
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
        searchRef.current.clearSearch();
        paginationRef.current.resetPagination();
        fetchPokemons({
            limit: paginationRef.current.pagination.limit,
            offset: 0
        });
    }, [fetchPokemons]);

    // Función para limpiar búsqueda y volver a la lista normal
    const clearSearch = useCallback(() => {
        searchRef.current.clearSearch();
        paginationRef.current.resetPagination();
        fetchPokemons({
            limit: paginationRef.current.pagination.limit,
            offset: 0
        });
    }, [fetchPokemons]);

    // Cargar Pokémon al montar el componente
    useEffect(() => {
        console.log('🚀 useEffect triggered, checking authentication...');
        
        // Verificar si hay token antes de hacer la llamada
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('🚀 No token found, skipping initial fetch');
            return;
        }
        
        console.log('🚀 Token found, calling fetchPokemons');
        fetchPokemons();
    }, []); // Solo se ejecuta una vez al montar

    console.log('🚀 Hook state - loading:', loading, 'pokemons:', pokemons.length, 'error:', error);

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
