import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PokemonCard from './PokemonCard';

// Mock the helpers module
vi.mock('../../../utils/helpers', () => ({
    formatPokemonName: vi.fn((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
}));

describe('PokemonCard', () => {
    const mockPokemon = {
        id: 1,
        name: 'bulbasaur',
        image: 'https://example.com/bulbasaur.png'
    };

    it('should render pokemon information', () => {
        render(<PokemonCard pokemon={mockPokemon} />);

        expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
        expect(screen.getByAltText('bulbasaur')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<PokemonCard pokemon={mockPokemon} onClick={handleClick} />);

        const card = screen.getByText('Bulbasaur').closest('.ant-card');
        fireEvent.click(card!);

        expect(handleClick).toHaveBeenCalledWith(mockPokemon);
    });



    it('should display formatted pokemon name', () => {
        render(<PokemonCard pokemon={mockPokemon} />);

        expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });

    it('should display pokemon image with correct attributes', () => {
        render(<PokemonCard pokemon={mockPokemon} />);

        const image = screen.getByAltText('bulbasaur');
        expect(image).toHaveAttribute('src', 'https://example.com/bulbasaur.png');
        expect(image).toHaveAttribute('alt', 'bulbasaur');
    });

    it('should have hoverable card when onClick is provided', () => {
        render(<PokemonCard pokemon={mockPokemon} onClick={() => { }} />);

        const card = screen.getByText('Bulbasaur').closest('.ant-card');
        expect(card).toHaveClass('ant-card');
    });

    it('should have pointer cursor when onClick is provided', () => {
        render(<PokemonCard pokemon={mockPokemon} onClick={() => { }} />);

        const card = screen.getByText('Bulbasaur').closest('.ant-card');
        expect(card).toHaveStyle({ cursor: 'pointer' });
    });

    it('should have default cursor when no onClick is provided', () => {
        render(<PokemonCard pokemon={mockPokemon} />);

        const card = screen.getByText('Bulbasaur').closest('.ant-card');
        expect(card).toHaveStyle({ cursor: 'default' });
    });

    it('should handle different pokemon names', () => {
        const charizard = { ...mockPokemon, name: 'charizard' };
        render(<PokemonCard pokemon={charizard} />);

        expect(screen.getByText('Charizard')).toBeInTheDocument();
    });

    it('should handle different pokemon images', () => {
        const pikachu = { ...mockPokemon, name: 'pikachu', image: 'https://example.com/pikachu.png' };
        render(<PokemonCard pokemon={pikachu} />);

        const image = screen.getByAltText('pikachu');
        expect(image).toHaveAttribute('src', 'https://example.com/pikachu.png');
    });

    it('should handle pokemon with different IDs', () => {
        const mewtwo = { ...mockPokemon, id: 150, name: 'mewtwo' };
        render(<PokemonCard pokemon={mewtwo} />);

        expect(screen.getByText('Mewtwo')).toBeInTheDocument();
    });

});
