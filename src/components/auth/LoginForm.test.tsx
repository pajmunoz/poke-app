import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
    const mockOnSubmit = vi.fn();

    it('should render the login form', () => {
        render(<LoginForm onSubmit={mockOnSubmit} />);
        
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
        expect(screen.getByTestId('username-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    it('should display correct labels and button text', () => {
        render(<LoginForm onSubmit={mockOnSubmit} />);
        
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should show loading state', () => {
        render(<LoginForm onSubmit={mockOnSubmit} isLoading={true} />);
        expect(screen.getByText('Connecting to server...')).toBeInTheDocument();
    });
});