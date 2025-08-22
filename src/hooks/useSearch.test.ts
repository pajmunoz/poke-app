import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSearch } from './useSearch';

// Mock the pokemonAPI
vi.mock('../api/pokemonAPI', () => ({
    searchPokemons: vi.fn()
}));

// Import the mocked function
import { searchPokemons } from '../api/pokemonAPI';

describe('useSearch', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('performSearch', () => {
        it('should return null and reset search state when query is empty', async () => {
            const { result } = renderHook(() => useSearch());

            // Set initial state
            act(() => {
                result.current.setSearchQuery('test');
                result.current.setSearchActive(true);
            });

            expect(result.current.searchQuery).toBe('test');
            expect(result.current.isSearchActive).toBe(true);

            // Perform search with empty query
            let searchResult;
            await act(async () => {
                searchResult = await result.current.performSearch('');
            });

            expect(searchResult).toBeNull();
            expect(result.current.searchQuery).toBe('');
            expect(result.current.isSearchActive).toBe(false);
        });

        it('should return null and reset search state when query is only whitespace', async () => {
            const { result } = renderHook(() => useSearch());

            // Set initial state
            act(() => {
                result.current.setSearchQuery('test');
                result.current.setSearchActive(true);
            });

            // Perform search with whitespace query
            let searchResult;
            await act(async () => {
                searchResult = await result.current.performSearch('   ');
            });

            expect(searchResult).toBeNull();
            expect(result.current.searchQuery).toBe('');
            expect(result.current.isSearchActive).toBe(false);
        });

        it('should set search active and query when performing search', async () => {
            const { result } = renderHook(() => useSearch());
            const mockPokemon = {
                id: 1,
                name: 'pikachu',
                types: ['electric'],
                image: 'pikachu.jpg'
            };

            (searchPokemons as any).mockResolvedValue(mockPokemon);

            // Perform search
            let searchResult;
            await act(async () => {
                searchResult = await result.current.performSearch('pikachu');
            });

            expect(result.current.isSearchActive).toBe(true);
            expect(result.current.searchQuery).toBe('pikachu');
            expect(searchResult).toEqual({
                pokemons: [mockPokemon],
                total: 1,
                isSearchActive: true
            });
        });

        it('should return valid result when search is successful', async () => {
            const { result } = renderHook(() => useSearch());
            const mockPokemon = {
                id: 25,
                name: 'pikachu',
                types: ['electric'],
                image: 'pikachu.jpg'
            };

            (searchPokemons as any).mockResolvedValue(mockPokemon);

            let searchResult;
            await act(async () => {
                searchResult = await result.current.performSearch('pikachu');
            });

            expect(searchPokemons).toHaveBeenCalledWith('pikachu');
            expect(searchResult).toEqual({
                pokemons: [mockPokemon],
                total: 1,
                isSearchActive: true
            });
        });

        it('should return empty result when search returns invalid data', async () => {
            const { result } = renderHook(() => useSearch());

            // Mock invalid response (missing id or name)
            (searchPokemons as any).mockResolvedValue({
                types: ['electric'],
                image: 'pikachu.jpg'
                // Missing id and name
            });

            let searchResult;
            await act(async () => {
                searchResult = await result.current.performSearch('pikachu');
            });

            expect(searchResult).toEqual({
                pokemons: [],
                total: 0,
                isSearchActive: true
            });
        });

        it('should return null when search API throws error', async () => {
            const { result } = renderHook(() => useSearch());
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            // Mock API error
            (searchPokemons as any).mockRejectedValue(new Error('Network error'));

            let searchResult;
            await act(async () => {
                searchResult = await result.current.performSearch('pikachu');
            });

            expect(searchResult).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith('Search error:', expect.any(Error));
            expect(result.current.isSearchActive).toBe(true);
            expect(result.current.searchQuery).toBe('pikachu');

            consoleSpy.mockRestore();
        });

        it('should handle search with special characters', async () => {
            const { result } = renderHook(() => useSearch());
            const mockPokemon = {
                id: 1,
                name: 'mr-mime',
                types: ['psychic', 'fairy'],
                image: 'mr-mime.jpg'
            };

            (searchPokemons as any).mockResolvedValue(mockPokemon);

            let searchResult;
            await act(async () => {
                searchResult = await result.current.performSearch('mr-mime');
            });

            expect(searchPokemons).toHaveBeenCalledWith('mr-mime');
            expect(searchResult).toEqual({
                pokemons: [mockPokemon],
                total: 1,
                isSearchActive: true
            });
        });
    });

    describe('clearSearch', () => {
        it('should reset search state to initial values', () => {
            const { result } = renderHook(() => useSearch());

            // Set search state
            act(() => {
                result.current.setSearchQuery('pikachu');
                result.current.setSearchActive(true);
            });

            expect(result.current.searchQuery).toBe('pikachu');
            expect(result.current.isSearchActive).toBe(true);

            // Clear search
            act(() => {
                result.current.clearSearch();
            });

            expect(result.current.searchQuery).toBe('');
            expect(result.current.isSearchActive).toBe(false);
        });

        it('should work when called multiple times', () => {
            const { result } = renderHook(() => useSearch());

            // Set search state
            act(() => {
                result.current.setSearchQuery('pikachu');
                result.current.setSearchActive(true);
            });

            // Clear search multiple times
            act(() => {
                result.current.clearSearch();
                result.current.clearSearch();
                result.current.clearSearch();
            });

            expect(result.current.searchQuery).toBe('');
            expect(result.current.isSearchActive).toBe(false);
        });
    });

    describe('setSearchActive', () => {
        it('should set search active to true', () => {
            const { result } = renderHook(() => useSearch());

            expect(result.current.isSearchActive).toBe(false);

            act(() => {
                result.current.setSearchActive(true);
            });

            expect(result.current.isSearchActive).toBe(true);
        });

        it('should set search active to false', () => {
            const { result } = renderHook(() => useSearch());

            // Set to true first
            act(() => {
                result.current.setSearchActive(true);
            });

            expect(result.current.isSearchActive).toBe(true);

            // Set to false
            act(() => {
                result.current.setSearchActive(false);
            });

            expect(result.current.isSearchActive).toBe(false);
        });

        it('should toggle search active state', () => {
            const { result } = renderHook(() => useSearch());

            expect(result.current.isSearchActive).toBe(false);

            // Toggle to true
            act(() => {
                result.current.setSearchActive(true);
            });

            expect(result.current.isSearchActive).toBe(true);

            // Toggle to false
            act(() => {
                result.current.setSearchActive(false);
            });

            expect(result.current.isSearchActive).toBe(false);

            // Toggle back to true
            act(() => {
                result.current.setSearchActive(true);
            });

            expect(result.current.isSearchActive).toBe(true);
        });
    });

    describe('setSearchQuery', () => {
        it('should update search query', () => {
            const { result } = renderHook(() => useSearch());

            expect(result.current.searchQuery).toBe('');

            act(() => {
                result.current.setSearchQuery('pikachu');
            });

            expect(result.current.searchQuery).toBe('pikachu');
        });

        it('should update search query multiple times', () => {
            const { result } = renderHook(() => useSearch());

            act(() => {
                result.current.setSearchQuery('pikachu');
            });

            expect(result.current.searchQuery).toBe('pikachu');

            act(() => {
                result.current.setSearchQuery('charizard');
            });

            expect(result.current.searchQuery).toBe('charizard');

            act(() => {
                result.current.setSearchQuery('bulbasaur');
            });

            expect(result.current.searchQuery).toBe('bulbasaur');
        });

        it('should handle empty string query', () => {
            const { result } = renderHook(() => useSearch());

            act(() => {
                result.current.setSearchQuery('pikachu');
            });

            expect(result.current.searchQuery).toBe('pikachu');

            act(() => {
                result.current.setSearchQuery('');
            });

            expect(result.current.searchQuery).toBe('');
        });
    });
}); 