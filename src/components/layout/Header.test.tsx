import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('should render the header component', () => {
    render(<Header />);
    
    expect(screen.getByText('PokeDex')).toBeInTheDocument();
  });

  it('should render the title as an h1 element', () => {
    render(<Header />);
    
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('PokeDex');
  });

  it('should have correct structure', () => {
    const { container } = render(<Header />);
    
    const divElement = container.querySelector('div');
    const h1Element = divElement?.querySelector('h1');
    
    expect(divElement).toBeInTheDocument();
    expect(h1Element).toBeInTheDocument();
    expect(h1Element).toHaveTextContent('PokeDex');
  });
});
