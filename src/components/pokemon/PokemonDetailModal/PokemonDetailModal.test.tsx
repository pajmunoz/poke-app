import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PokemonDetailModal from './PokemonDetailModal';

// Mock dependencies
vi.mock('../../../utils/helpers', () => ({
    formatPokemonName: vi.fn((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
}));

// Usar el componente Modal real con data-testid

describe('PokemonDetailModal', () => {
    const mockPokemon = {
        id: 25,
        name: 'pikachu',
        types: ['electric'],
        image: 'https://example.com/pikachu.png',
        abilities: ['static', 'lightning-rod'],
        moves: [
            { name: 'thunder-shock', type: 'electric', power: 40, accuracy: 100 },
            { name: 'quick-attack', type: 'normal', power: 40, accuracy: 100 },
            { name: 'thunderbolt', type: 'electric', power: 90, accuracy: 100 }
        ],
        forms: [
            { name: 'pikachu', url: 'https://example.com/pikachu' },
            { name: 'pikachu-gmax', url: 'https://example.com/pikachu-gmax' }
        ]
    };

    it('should not render when pokemon is null', () => {
        render(<PokemonDetailModal pokemon={null} open={true} onClose={() => { }} />);

        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should not render when open is false', () => {
        render(<PokemonDetailModal pokemon={mockPokemon} open={false} onClose={() => { }} />);

        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should render when pokemon exists and open is true', () => {
        render(<PokemonDetailModal pokemon={mockPokemon} open={true} onClose={() => { }} />);

        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getAllByText('Pikachu')).toHaveLength(2); // Title + form
        expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });

    it('should display pokemon ID correctly', () => {
        render(<PokemonDetailModal pokemon={mockPokemon} open={true} onClose={() => { }} />);

        expect(screen.getByText('#025')).toBeInTheDocument();
    });

    it('should display pokemon types', () => {
        render(<PokemonDetailModal pokemon={mockPokemon} open={true} onClose={() => { }} />);

        expect(screen.getByText('Types:')).toBeInTheDocument();
        // Electric appears multiple times, so use getAllByText
        expect(screen.getAllByText('Electric')).toHaveLength(3); // 1 in types + 2 in moves
        
    });

    it('should display pokemon abilities', () => {
        render(<PokemonDetailModal pokemon={mockPokemon} open={true} onClose={() => { }} />);

        expect(screen.getByText('Abilities:')).toBeInTheDocument();
        expect(screen.getByText('Static')).toBeInTheDocument();
        expect(screen.getByText('Lightning-rod')).toBeInTheDocument();
    });

    it('should display pokemon moves', () => {
        render(<PokemonDetailModal pokemon={mockPokemon} open={true} onClose={() => { }} />);

        expect(screen.getByText('Moves:')).toBeInTheDocument();
        // The component only shows move types, not names
        expect(screen.getAllByText('Electric')).toHaveLength(3); // 1 in types + 2 in moves
        expect(screen.getByText('Normal')).toBeInTheDocument(); // From moves
    });

    it('should display pokemon forms', () => {
        render(<PokemonDetailModal pokemon={mockPokemon} open={true} onClose={() => { }} />);

        expect(screen.getByText('Forms:')).toBeInTheDocument();
        // Use getAllByText for Pikachu since it appears in both title and forms
        expect(screen.getAllByText('Pikachu')).toHaveLength(2);
        expect(screen.getByText('Pikachu-gmax')).toBeInTheDocument();
    });

    it('should handle pokemon without types', () => {
        const pokemonWithoutTypes = { ...mockPokemon, types: undefined };
        render(<PokemonDetailModal pokemon={pokemonWithoutTypes} open={true} onClose={() => { }} />);

        expect(screen.getByText('No types available')).toBeInTheDocument();
    });

    it('should handle pokemon without abilities', () => {
        const pokemonWithoutAbilities = { ...mockPokemon, abilities: undefined };
        render(<PokemonDetailModal pokemon={pokemonWithoutAbilities} open={true} onClose={() => { }} />);

        expect(screen.getByText('No abilities available')).toBeInTheDocument();
    });

    it('should handle pokemon without moves', () => {
        const pokemonWithoutMoves = { ...mockPokemon, moves: undefined };
        render(<PokemonDetailModal pokemon={pokemonWithoutMoves} open={true} onClose={() => { }} />);

        expect(screen.queryByText('Moves:')).not.toBeInTheDocument();
    });

    it('should handle pokemon without forms', () => {
        const pokemonWithoutForms = { ...mockPokemon, forms: undefined };
        render(<PokemonDetailModal pokemon={pokemonWithoutForms} open={true} onClose={() => { }} />);

        expect(screen.queryByText('Forms:')).not.toBeInTheDocument();
    });

    it('should handle empty moves array', () => {
        const pokemonWithEmptyMoves = { ...mockPokemon, moves: [] };
        render(<PokemonDetailModal pokemon={pokemonWithEmptyMoves} open={true} onClose={() => { }} />);

        expect(screen.queryByText('Moves:')).not.toBeInTheDocument();
    });

    it('should handle empty forms array', () => {
        const pokemonWithEmptyForms = { ...mockPokemon, forms: [] };
        render(<PokemonDetailModal pokemon={pokemonWithEmptyForms} open={true} onClose={() => { }} />);

        expect(screen.queryByText('Forms:')).not.toBeInTheDocument();
    });

    it('should handle moves with missing properties', () => {
        const pokemonWithIncompleteMoves = {
            ...mockPokemon,
            moves: [
                { name: 'thunder-shock', type: 'electric', power: null, accuracy: null },
                { name: 'quick-attack', type: 'normal', power: 40, accuracy: 100 }
            ]
        };

        render(<PokemonDetailModal pokemon={pokemonWithIncompleteMoves} open={true} onClose={() => { }} />);

        // The component only shows move types, not names
        expect(screen.getAllByText('Electric')).toHaveLength(2); // 1 in types + 1 in moves
        expect(screen.getByText('Normal')).toBeInTheDocument();

        // Power and accuracy should not be displayed for null values
        expect(screen.queryByText('Power: null')).not.toBeInTheDocument();
        expect(screen.queryByText('Acc: null%')).not.toBeInTheDocument();
    });

    it('should handle forms with missing properties', () => {
        const pokemonWithIncompleteForms = {
            ...mockPokemon,
            forms: [
                { name: 'pikachu', url: 'https://example.com/pikachu' },
                { name: 'empty', url: 'https://example.com/empty' },
                { name: 'no-name', url: 'https://example.com/no-name' }
            ]
        };

        render(<PokemonDetailModal pokemon={pokemonWithIncompleteForms} open={true} onClose={() => { }} />);

        // Use getAllByText for Pikachu since it appears in both title and forms
        expect(screen.getAllByText('Pikachu')).toHaveLength(2); // 1 in title + 1 in forms
        // Forms without names should not be rendered - just check that we have the expected form
        expect(screen.getByText('Forms:')).toBeInTheDocument();
    });

    it('should call onClose when modal close button is clicked', () => {
        const handleClose = vi.fn();
        render(<PokemonDetailModal pokemon={mockPokemon} open={true} onClose={handleClose} />);

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should handle pokemon with different ID lengths', () => {
        const pokemonWithSingleDigitId = { ...mockPokemon, id: 1 };
        render(<PokemonDetailModal pokemon={pokemonWithSingleDigitId} open={true} onClose={() => { }} />);

        expect(screen.getByText('#001')).toBeInTheDocument();
    });

    it('should handle pokemon with multiple types', () => {
        const pokemonWithMultipleTypes = { ...mockPokemon, types: ['fire', 'flying'] };
        render(<PokemonDetailModal pokemon={pokemonWithMultipleTypes} open={true} onClose={() => { }} />);

        expect(screen.getByText('Fire')).toBeInTheDocument();
        expect(screen.getByText('Flying')).toBeInTheDocument();
    });

    it('should handle pokemon with many abilities', () => {
        const pokemonWithManyAbilities = {
            ...mockPokemon,
            abilities: ['ability1', 'ability2', 'ability3', 'ability4']
        };
        render(<PokemonDetailModal pokemon={pokemonWithManyAbilities} open={true} onClose={() => { }} />);

        expect(screen.getByText('Ability1')).toBeInTheDocument();
        expect(screen.getByText('Ability2')).toBeInTheDocument();
        expect(screen.getByText('Ability3')).toBeInTheDocument();
        expect(screen.getByText('Ability4')).toBeInTheDocument();
    });
});
