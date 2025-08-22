import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock the Header component
vi.mock('../../components/layout/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

// Mock the Input component
vi.mock('../../components/common/Input/Input', () => ({
    default: ({ name, type, disabled, value, onChange }: any) => (
        <input
            data-testid={`input-${name}`}
            name={name}
            type={type || 'text'}
            disabled={disabled}
            value={value}
            onChange={onChange}
        />
    )
}));

// Mock the Button component
vi.mock('../../components/common/Button/Button', () => ({
    default: ({ children, disabled, onClick }: any) => (
        <button data-testid="login-button" disabled={disabled} onClick={onClick}>
            {children}
        </button>
    )
}));

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
    });

    it('should render the login page with all elements', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        
        // Check if Header is rendered
        expect(screen.getByTestId('header')).toBeInTheDocument();
        
        // Check if form elements are rendered
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        
        // Check if inputs are rendered
        expect(screen.getByTestId('input-username')).toBeInTheDocument();
        expect(screen.getByTestId('input-password')).toBeInTheDocument();
        
        // Check if login button is rendered
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should have password input with correct type', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        
        const passwordInput = screen.getByTestId('input-password');
        expect(passwordInput).toHaveAttribute('type', 'password');
    });
});