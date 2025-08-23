import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import MainPage from './MainPage';

// Mock the PokemonList component to avoid complex dependencies
vi.mock('../../components/pokemon/PokemonList/PokemonList', () => ({
    default: () => <div data-testid="pokemon-list">Pokemon List</div>
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('MainPage', () => {
    it('should render the main page with close session button', () => {
        render(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );
        
        // The close session button should be present (it's an icon-only button)
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByTestId('pokemon-list')).toBeInTheDocument();
    });
});