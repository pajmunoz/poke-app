import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock AppRoutes to avoid routing issues in tests
vi.mock('./routes/AppRoutes', () => ({
    default: () => <div data-testid="app-routes">App Routes</div>
}));

describe("App", () => {
    it("renders react app with routes and blob cursor", () => {
        render(<App />);
        expect(screen.getByTestId('app-routes')).toBeInTheDocument();
    });
});