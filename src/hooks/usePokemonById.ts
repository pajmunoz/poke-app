import { useState, useEffect, useCallback } from 'react';
import { getPokemonById, Pokemon } from '../api/pokemonAPI';
import { useAsyncState } from './useAsyncState';

export const usePokemonById = (id: number | string | null) => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const asyncState = useAsyncState();

    const fetchPokemon = useCallback(async () => {
        if (!id) return;

        const result = await asyncState.executeAsync(
            async () => {
                const data = await getPokemonById(id);
                setPokemon(data);
                return data;
            },
            'Failed to fetch pokemon'
        );

        return result;
    }, [id, asyncState]);

    useEffect(() => {
        fetchPokemon();
    }, [fetchPokemon]);

    return {
        pokemon,
        loading: asyncState.loading,
        error: asyncState.error,
        refetch: fetchPokemon,
        clearError: asyncState.clearError
    };
};
