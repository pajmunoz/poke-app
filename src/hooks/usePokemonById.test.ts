import { renderHook, act, waitFor } from '@testing-library/react';
import { usePokemonById } from './usePokemonById';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the pokemonAPI
vi.mock('../api/pokemonAPI', () => ({
    getPokemonById: vi.fn()
}));

// Import the mocked function 
import { getPokemonById } from '../api/pokemonAPI';

describe('getPokemonById', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch pokemon successfully', async () => {
        const mockPokemon = { id: 1, name: 'bulbasaur' };
        (getPokemonById as any).mockResolvedValue(mockPokemon);

        const { result } = renderHook(() => usePokemonById(1));

        await waitFor(() => {
            expect(result.current.pokemon).toEqual(mockPokemon);
        });
    });
});