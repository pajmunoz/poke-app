import { useState, useCallback } from 'react';
import { searchPokemons } from '../api/pokemonAPI';

export const useSearch = () => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const performSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchQuery('');
            setIsSearchActive(false);
            return null;
        }

        setIsSearchActive(true);
        setSearchQuery(query);

        try {
            const pokemonResult = await searchPokemons(query);
            
            if (pokemonResult && pokemonResult.id && pokemonResult.name) {
                // Convertir el resultado único en una lista para mantener consistencia
                const pokemonList = [pokemonResult];
                return {
                    pokemons: pokemonList,
                    total: 1,
                    isSearchActive: true
                };
            } else {
                return {
                    pokemons: [],
                    total: 0,
                    isSearchActive: true
                };
            }
        } catch (err) {
            // En lugar de lanzar error, retornar null para que el hook principal lo maneje
            console.error('Search error:', err);
            return null;
        }
    }, []);

    const clearSearch = useCallback(() => {
        setIsSearchActive(false);
        setSearchQuery('');
        // Asegurar que el estado se limpie completamente
        setTimeout(() => {
            setIsSearchActive(false);
            setSearchQuery('');
        }, 0);
    }, []);

    const setSearchActive = useCallback((active: boolean) => {
        setIsSearchActive(active);
    }, []);

    return {
        isSearchActive,
        searchQuery,
        performSearch,
        clearSearch,
        setSearchActive,
        setSearchQuery
    };
};
