import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('should render the header component', () => {
    render(<Header />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
