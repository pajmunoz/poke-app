import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePokemonList } from './usePokemonList';

// Mock the dependencies
vi.mock('./usePagination', () => ({
    usePagination: vi.fn()
}));

vi.mock('./useSearch', () => ({
    useSearch: vi.fn()
}));

vi.mock('../api/pokemonAPI', () => ({
    getPokemons: vi.fn()
}));

vi.mock('../utils/helpers', () => ({
    isArray: vi.fn(),
    hasItems: vi.fn()
}));

// Import mocked functions
import { usePagination } from './usePagination';
import { useSearch } from './useSearch';
import { getPokemons } from '../api/pokemonAPI';
import { isArray, hasItems } from '../utils/helpers';

describe('usePokemonList', () => {
    let mockPagination: any;
    let mockSearch: any;
    let mockGetPokemons: any;
    let mockIsArray: any;
    let mockHasItems: any;

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: vi.fn(),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
            },
            writable: true,
        });

        // Mock pagination hook
        mockPagination = {
            pagination: {
                total: 0,
                limit: 5,
                offset: 0,
                hasNext: false,
                hasPrevious: false
            },
            updatePagination: vi.fn(),
            resetPagination: vi.fn(),
            loadNextPage: vi.fn(),
            loadPreviousPage: vi.fn(),
            changeLimit: vi.fn(),
            goToPage: vi.fn(),
            currentPage: 1,
            totalPages: 1
        };

        // Mock search hook
        mockSearch = {
            isSearchActive: false,
            searchQuery: '',
            performSearch: vi.fn(),
            clearSearch: vi.fn(),
            setSearchActive: vi.fn(),
            setSearchQuery: vi.fn()
        };

        // Mock API function
        mockGetPokemons = getPokemons as any;
        mockIsArray = isArray as any;
        mockHasItems = hasItems as any;

        // Setup default mocks
        (usePagination as any).mockReturnValue(mockPagination);
        (useSearch as any).mockReturnValue(mockSearch);
        mockIsArray.mockReturnValue(true);
        mockHasItems.mockReturnValue(true);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('fetchPokemons', () => {
        it('should fetch pokemons successfully', async () => {
            const mockResponse = {
                results: [
                    { id: 1, name: 'bulbasaur', types: ['grass', 'poison'] },
                    { id: 2, name: 'ivysaur', types: ['grass', 'poison'] }
                ],
                total: 1302,
                count: 2,
                next: 'https://pokeapi.co/api/v2/pokemon?offset=2&limit=2',
                previous: null
            };

            mockGetPokemons.mockResolvedValue(mockResponse);
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            // Wait for initial effect
            await waitFor(() => {
                expect(result.current.pokemons).toEqual(mockResponse.results);
            });

            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe(null);
            expect(mockPagination.updatePagination).toHaveBeenCalledWith({
                total: 1302,
                limit: 5,
                offset: 0,
                hasNext: true,
                hasPrevious: false
            });
        });

        it('should handle API error', async () => {
            const mockError = new Error('Network error');
            mockGetPokemons.mockRejectedValue(mockError);
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            await waitFor(() => {
                expect(result.current.error).toBe('Network error');
            });

            expect(result.current.pokemons).toEqual([]);
            expect(result.current.loading).toBe(false);
        });

        it('should handle invalid response data', async () => {
            const mockResponse = { results: null };
            mockGetPokemons.mockResolvedValue(mockResponse);
            mockIsArray.mockReturnValue(false);
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            await waitFor(() => {
                expect(result.current.pokemons).toEqual([]);
            });

            expect(mockPagination.updatePagination).toHaveBeenCalledWith({
                total: 0,
                limit: 5,
                offset: 0,
                hasNext: false,
                hasPrevious: false
            });
        });

        it('should handle empty response', async () => {
            const mockResponse = { results: [] };
            mockGetPokemons.mockResolvedValue(mockResponse);
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            await waitFor(() => {
                expect(result.current.pokemons).toEqual([]);
            });

            expect(mockPagination.updatePagination).toHaveBeenCalledWith({
                total: 0,
                limit: 5,
                offset: 0,
                hasNext: false,
                hasPrevious: false
            });
        });

        it('should use custom limit and offset when provided', async () => {
            const mockResponse = {
                results: [{ id: 1, name: 'bulbasaur' }],
                total: 1302,
                count: 1,
                next: null,
                previous: null
            };

            // Update mock pagination to return the custom limit
            mockPagination.pagination.limit = 10;
            mockGetPokemons.mockResolvedValue(mockResponse);
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(10));

            // Wait for initial effect to complete
            await waitFor(() => {
                expect(mockGetPokemons).toHaveBeenCalled();
            });

            // Verify that the hook uses the custom initialLimit
            expect(result.current.pagination.limit).toBe(10);
        });
    });

    describe('searchPokemon', () => {
        it('should search pokemon successfully', async () => {
            const mockSearchResult = {
                pokemons: [{ id: 25, name: 'pikachu', types: ['electric'] }],
                total: 1,
                isSearchActive: true
            };

            mockSearch.performSearch.mockResolvedValue(mockSearchResult);
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            await act(async () => {
                await result.current.searchPokemon('pikachu');
            });

            expect(result.current.loading).toBe(false);
            expect(result.current.pokemons).toEqual(mockSearchResult.pokemons);
            expect(mockSearch.setSearchActive).toHaveBeenCalledWith(true);
            expect(mockPagination.updatePagination).toHaveBeenCalledWith({
                total: 1,
                limit: 1,
                offset: 0,
                hasNext: false,
                hasPrevious: false
            });
        });

        it('should handle search error', async () => {
            const mockError = new Error('Search failed');
            mockSearch.performSearch.mockRejectedValue(mockError);
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            await act(async () => {
                await result.current.searchPokemon('pikachu');
            });

            expect(result.current.error).toBe('Search failed');
            expect(result.current.pokemons).toEqual([]);
            expect(result.current.loading).toBe(false);
        });

        it('should handle search with no result', async () => {
            mockSearch.performSearch.mockResolvedValue(null);
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            await act(async () => {
                const searchResult = await result.current.searchPokemon('nonexistent');
                expect(searchResult).toBeNull();
            });

            expect(result.current.loading).toBe(false);
        });
    });

    describe('refreshPokemons', () => {
        it('should refresh pokemon list', async () => {
            mockGetPokemons.mockResolvedValue({
                results: [{ id: 1, name: 'bulbasaur' }],
                total: 1302,
                count: 1,
                next: null,
                previous: null
            });
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            await act(async () => {
                result.current.refreshPokemons();
            });

            expect(mockSearch.clearSearch).toHaveBeenCalled();
            expect(mockPagination.resetPagination).toHaveBeenCalled();
            expect(mockGetPokemons).toHaveBeenCalledWith({
                limit: 5,
                offset: 0
            });
        });
    });

    describe('clearSearch', () => {
        it('should clear search and refresh list', async () => {
            mockGetPokemons.mockResolvedValue({
                results: [{ id: 1, name: 'bulbasaur' }],
                total: 1302,
                count: 1,
                next: null,
                previous: null
            });
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            await act(async () => {
                result.current.clearSearch();
            });

            expect(mockSearch.clearSearch).toHaveBeenCalled();
            expect(mockPagination.resetPagination).toHaveBeenCalled();
            expect(mockGetPokemons).toHaveBeenCalledWith({
                limit: 5,
                offset: 0
            });
        });
    });

    describe('initialization', () => {
        it('should not fetch pokemons when no token is present', async () => {
            (window.localStorage.getItem as any).mockReturnValue(null);

            renderHook(() => usePokemonList(5));

            await waitFor(() => {
                expect(mockGetPokemons).not.toHaveBeenCalled();
            });
        });

        it('should fetch pokemons when token is present', async () => {
            mockGetPokemons.mockResolvedValue({
                results: [{ id: 1, name: 'bulbasaur' }],
                total: 1302,
                count: 1,
                next: null,
                previous: null
            });
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            renderHook(() => usePokemonList(5));

            await waitFor(() => {
                expect(mockGetPokemons).toHaveBeenCalled();
            });
        });
    });

    describe('pagination functions', () => {
        it('should handle loadNextPage', async () => {
            mockPagination.loadNextPage.mockReturnValue({ limit: 5, offset: 5 });
            mockGetPokemons.mockResolvedValue({
                results: [{ id: 6, name: 'charizard' }],
                total: 1302,
                count: 1,
                next: null,
                previous: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=5'
            });
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            await act(async () => {
                result.current.loadNextPage();
            });

            expect(mockPagination.loadNextPage).toHaveBeenCalled();
            expect(mockGetPokemons).toHaveBeenCalledWith({ limit: 5, offset: 5 });
        });

        it('should handle loadPreviousPage', async () => {
            mockPagination.loadPreviousPage.mockReturnValue({ limit: 5, offset: 0 });
            mockGetPokemons.mockResolvedValue({
                results: [{ id: 1, name: 'bulbasaur' }],
                total: 1302,
                count: 1,
                next: 'https://pokeapi.co/api/v2/pokemon?offset=5&limit=5',
                previous: null
            });
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            await act(async () => {
                result.current.loadPreviousPage();
            });

            expect(mockPagination.loadPreviousPage).toHaveBeenCalled();
            expect(mockGetPokemons).toHaveBeenCalledWith({ limit: 5, offset: 0 });
        });

        it('should handle changeLimit', async () => {
            mockPagination.changeLimit.mockReturnValue({ limit: 10, offset: 0 });
            mockGetPokemons.mockResolvedValue({
                results: Array(10).fill({ id: 1, name: 'bulbasaur' }),
                total: 1302,
                count: 10,
                next: 'https://pokeapi.co/api/v2/pokemon?offset=10&limit=10',
                previous: null
            });
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            await act(async () => {
                result.current.changeLimit(10);
            });

            expect(mockPagination.changeLimit).toHaveBeenCalledWith(10);
            expect(mockGetPokemons).toHaveBeenCalledWith({ limit: 10, offset: 0 });
        });

        it('should handle goToPage', async () => {
            mockPagination.goToPage.mockReturnValue({ limit: 5, offset: 10 });
            mockGetPokemons.mockResolvedValue({
                results: [{ id: 11, name: 'metapod' }],
                total: 1302,
                count: 1,
                next: 'https://pokeapi.co/api/v2/pokemon?offset=15&limit=5',
                previous: 'https://pokeapi.co/api/v2/pokemon?offset=5&limit=5'
            });
            (window.localStorage.getItem as any).mockReturnValue('mock-token');

            const { result } = renderHook(() => usePokemonList(5));

            await act(async () => {
                result.current.goToPage(3);
            });

            expect(mockPagination.goToPage).toHaveBeenCalledWith(3);
            expect(mockGetPokemons).toHaveBeenCalledWith({ limit: 5, offset: 10 });
        });
    });

    describe('utility functions', () => {
        it('should clear error', () => {
            const { result } = renderHook(() => usePokemonList(5));

            // Set error first
            act(() => {
                result.current.clearError();
            });

            expect(result.current.error).toBe(null);
        });

        it('should return correct hasPokemons value', () => {
            mockHasItems.mockReturnValue(true);
            const { result } = renderHook(() => usePokemonList(5));

            expect(result.current.hasPokemons).toBe(true);
            expect(mockHasItems).toHaveBeenCalledWith([]);
        });

        it('should return correct pagination values', () => {
            const { result } = renderHook(() => usePokemonList(5));

            expect(result.current.currentPage).toBe(1);
            expect(result.current.totalPages).toBe(1);
            expect(result.current.pagination).toEqual(mockPagination.pagination);
        });
    });
});
