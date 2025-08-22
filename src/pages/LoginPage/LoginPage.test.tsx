import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { loginUser } from '../../api/authAPI';

// Mock the Header component
vi.mock('../../components/layout/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

// Usar el componente LoginForm real con data-testid

// Mock the authAPI
vi.mock('../../api/authAPI', () => ({
    loginUser: vi.fn()
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should render the login page with header and login form', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
        expect(screen.getByTestId('username-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    it('should display correct form labels', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
    });
});