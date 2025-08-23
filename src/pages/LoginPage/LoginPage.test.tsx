import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock the Header component
vi.mock('../../components/layout/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

// Mock the LoginForm component
vi.mock('../../components/auth/LoginForm', () => ({
    default: () => <div data-testid="login-form">Login Form</div>
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn()
    };
});

// Mock antd message
vi.mock('antd', () => ({
    message: {
        useMessage: () => [vi.fn(), vi.fn()]
    },
    Divider: () => <div />
}));

describe('LoginPage', () => {
    it('should render the login page with header and login form', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
});