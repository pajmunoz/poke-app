import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe("App", () => {
    it("renders react app", () => {
        render(<App />);
        const linkElement = screen.getByText(/PokeDex/i);
        expect(linkElement).toBeInTheDocument();
    });
});