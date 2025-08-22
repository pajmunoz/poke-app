import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock usePokemon hook con datos básicos
vi.mock('../../../hooks/usePokemon', () => ({
    usePokemon: vi.fn(() => ({
        pokemons: [
            { id: 1, name: 'bulbasaur', image: 'bulbasaur.png' },
            { id: 2, name: 'ivysaur', image: 'ivysaur.png' }
        ],
        loading: false,
        error: null,
        pagination: { total: 100, limit: 5, offset: 0 },
        isSearchActive: false,
        searchQuery: '',
        loadNextPage: vi.fn(),
        loadPreviousPage: vi.fn(),
        changeLimit: vi.fn(),
        goToPage: vi.fn(),
        searchPokemon: vi.fn(),
        refreshPokemons: vi.fn(),
        clearSearch: vi.fn(),
        clearError: vi.fn(),
        hasPokemons: true,
        currentPage: 1,
        totalPages: 20
    }))
}));

// Mock componentes hijos para simplificar



import PokemonList from './PokemonList';

describe('PokemonList', () => {
    it('should render the main container', () => {
        render(<PokemonList />);
        expect(screen.getByTestId('pokemon-list')).toBeInTheDocument();
        expect(screen.getByTestId('search-container')).toBeInTheDocument();
        expect(screen.getByTestId('pokemon-search')).toBeInTheDocument();
    });

    it('should render pokemon cards', () => {
        render(<PokemonList />);
        expect(screen.getByTestId('pokemon-grid')).toBeInTheDocument();
        // Buscar por el texto del nombre del pokemon
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
        expect(screen.getByText('Ivysaur')).toBeInTheDocument();
    });

    it('should render pagination component', () => {
        render(<PokemonList />);
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('should render refresh button', () => {
        render(<PokemonList />);
        expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
        expect(screen.getByText('Refresh Pokemon List')).toBeInTheDocument();
    });
});
