import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { loginUser } from '../../api/authAPI';

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
    it('if user has typed username and password, the login button should be enabled', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        const usernameInput = screen.getByTestId('input-username');
        const passwordInput = screen.getByTestId('input-password');
        const loginButton = screen.getByText('Login');
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'testpass' } });
        expect(loginButton).not.toBeDisabled();
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

    it('should handle input changes correctly', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        
        const usernameInput = screen.getByTestId('input-username');
        const passwordInput = screen.getByTestId('input-password');
        
        // Test username change
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        expect(usernameInput).toHaveValue('testuser');
        
        // Test password change
        fireEvent.change(passwordInput, { target: { value: 'testpass' } });
        expect(passwordInput).toHaveValue('testpass');
    });

    it('should test handleChange function behavior', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        
        const usernameInput = screen.getByTestId('input-username');
        const passwordInput = screen.getByTestId('input-password');
        const loginButton = screen.getByRole('button', { name: /login/i });
        
        // Initially button should be disabled (both fields empty)
        expect(loginButton).toBeDisabled();
        
        // Fill only username - button should still be disabled
        fireEvent.change(usernameInput, { 
            target: { name: 'username', value: 'testuser' } 
        });
        expect(usernameInput).toHaveValue('testuser');
        expect(loginButton).toBeDisabled();
        
        // Fill password - button should now be enabled
        fireEvent.change(passwordInput, { 
            target: { name: 'password', value: 'testpass' } 
        });
        expect(passwordInput).toHaveValue('testpass');
        expect(loginButton).not.toBeDisabled();
        
        // Clear username - button should be disabled again
        fireEvent.change(usernameInput, { 
            target: { name: 'username', value: '' } 
        });
        expect(usernameInput).toHaveValue('');
        expect(loginButton).toBeDisabled();
    });

    it('should test onSubmit with successful login', async () => {
        const mockLoginResponse = {
            success: true,
            token: 'mock-token',
            user: { username: 'testuser' },
            message: 'Login exitoso!'
        };
        
        (loginUser as any).mockResolvedValue(mockLoginResponse);
        
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        
        const usernameInput = screen.getByTestId('input-username');
        const passwordInput = screen.getByTestId('input-password');
        const loginButton = screen.getByText('Login');
        
        // Fill form
        fireEvent.change(usernameInput, { 
            target: { name: 'username', value: 'admin' } 
        });
        fireEvent.change(passwordInput, { 
            target: { name: 'password', value: 'password' } 
        });
        
        // Submit form
        fireEvent.click(loginButton);
        
        // Verify API was called with correct credentials
        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith({
                username: 'admin',
                password: 'password'
            });
        });
        
        // Verify API was called (this proves onSubmit worked)
        expect(loginUser).toHaveBeenCalledWith({
            username: 'admin',
            password: 'password'
        });
    });

    it('should test onSubmit with failed login', async () => {
        const mockLoginResponse = {
            success: false,
            message: 'Invalid credentials'
        };
        
        (loginUser as any).mockResolvedValue(mockLoginResponse);
        
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        
        const usernameInput = screen.getByTestId('input-username');
        const passwordInput = screen.getByTestId('input-password');
        const loginButton = screen.getByText('Login');
        
        // Fill form with wrong credentials
        fireEvent.change(usernameInput, { 
            target: { name: 'username', value: 'wronguser' } 
        });
        fireEvent.change(passwordInput, { 
            target: { name: 'password', value: 'wrongpass' } 
        });
        
        // Submit form
        fireEvent.click(loginButton);
        
        // Verify API was called
        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith({
                username: 'wronguser',
                password: 'wrongpass'
            });
        });
        
        // Verify localStorage was NOT updated for failed login
        expect(localStorage.getItem('isAuthenticated')).toBeUndefined();
        expect(localStorage.getItem('token')).toBeUndefined();
        
        // Verify navigation was NOT called
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should test onSubmit with API error', async () => {
        const errorMessage = 'Network error';
        (loginUser as any).mockRejectedValue(new Error(errorMessage));
        
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        
        const usernameInput = screen.getByTestId('input-username');
        const passwordInput = screen.getByTestId('input-password');
        const loginButton = screen.getByText('Login');
        
        // Fill form
        fireEvent.change(usernameInput, { 
            target: { name: 'username', value: 'testuser' } 
        });
        fireEvent.change(passwordInput, { 
            target: { name: 'password', value: 'testpass' } 
        });
        
        // Submit form
        fireEvent.click(loginButton);
        
        // Verify API was called
        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith({
                username: 'testuser',
                password: 'testpass'
            });
        });
        
        // Verify localStorage was NOT updated for error
        expect(localStorage.getItem('isAuthenticated')).toBeUndefined();
        expect(localStorage.getItem('token')).toBeUndefined();
        
        // Verify navigation was NOT called
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});