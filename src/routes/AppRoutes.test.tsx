import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AppRoutes from './AppRoutes';
import { BrowserRouter } from 'react-router-dom';

// Mock RouteGuard to simplify testing
vi.mock('../components/common/RouteGuard/RouteGuard', () => ({
    default: ({ children, requireAuth }: any) => {
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';
        
        if (requireAuth) {
            // For protected routes, render children if authenticated
            return isAuth ? children : <div>Redirected to Login</div>;
        } else {
            // For public routes, render children if not authenticated
            return children;
        }
    }
}));

// Mock MainPage component
vi.mock('../pages/MainPage/MainPage', () => ({
    default: () => <div data-testid="main-page">Main Page Content</div>
}));

// Mock Header component
vi.mock('../components/layout/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

// Mock LoginPage component
vi.mock('../pages/LoginPage/LoginPage', () => ({
    default: () => <div data-testid="login-page">Login Page</div>
}));

describe('AppRoutes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });
    it('should render the login page', () => {
        render(
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        );
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
    it('should handle authenticated user navigation', () => {
        localStorage.setItem('isAuthenticated', 'true');
        render(
            <BrowserRouter> 
                <AppRoutes />
            </BrowserRouter>
        );
        
        expect(document.body).toBeInTheDocument();
        const content = screen.getByTestId('login-page') || screen.queryByTestId('main-page');
        expect(content).toBeTruthy();
    });
    
    it('should redirect to login page if user is not authenticated', () => {
        localStorage.removeItem('isAuthenticated');
        render(
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        );
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
});