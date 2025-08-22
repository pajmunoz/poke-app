import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import MainPage from './MainPage';

// Mock the PokemonList component to avoid complex dependencies
vi.mock('../../components/pokemon/PokemonList/PokemonList', () => ({
    default: () => <div data-testid="pokemon-list">Pokemon List</div>
}));

describe('MainPage', () => {
    it('should render the main page with close session button', () => {
        render(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );
        
        expect(screen.getByText('Close Session')).toBeInTheDocument();
        expect(screen.getByTestId('pokemon-list')).toBeInTheDocument();
    });
});