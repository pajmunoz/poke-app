import { renderHook, act } from '@testing-library/react';
import { useNavigation } from './useNavigation';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// Mock React Router hooks
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
    useParams: vi.fn(),
}));

// Mock routes config
vi.mock('../routes/routes.config', () => ({
    ROUTES: {
        LOGIN: '/login',
        HOME: '/',
        MAIN: '/main',
    },
    ROUTE_META: {
        LOGIN: {
            path: '/login',
            title: 'Login',
            requiresAuth: false,
            showInNav: false,
        },
        HOME: {
            path: '/',
            title: 'Home',
            requiresAuth: false,
            showInNav: false,
        },
        MAIN: {
            path: '/main',
            title: 'Pokemon List',
            requiresAuth: true,
            showInNav: true,
            icon: 'pokeball',
        },
    },
    getNavigationRoutes: vi.fn(() => [
        {
            path: '/main',
            title: 'Pokemon List',
            requiresAuth: true,
            showInNav: true,
            icon: 'pokeball',
        }
    ]),
}));

describe('useNavigation', () => {
    const mockNavigate = vi.fn();
    const mockLocation = { pathname: '/' };
    const mockParams = {};

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default mocks
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useLocation as any).mockReturnValue(mockLocation);
        (useParams as any).mockReturnValue(mockParams);
    });

    it('should return correct initial values', () => {
        const { result } = renderHook(() => useNavigation());

        expect(result.current.currentPath).toBe('/');
        expect(result.current.isCurrentRoute('/')).toBe(true);
        expect(result.current.isCurrentRouteStartsWith('/')).toBe(true);
        expect(result.current.params).toEqual({});
    });

    it('should navigate to login', () => {
        const { result } = renderHook(() => useNavigation());

        act(() => {
            result.current.goToLogin();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should navigate to main', () => {
        const { result } = renderHook(() => useNavigation());

        act(() => {
            result.current.goToMain();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/main');
    });

    it('should navigate to pokemon detail', () => {
        const { result } = renderHook(() => useNavigation());

        act(() => {
            result.current.goToPokemonDetail(1);
        });

        expect(mockNavigate).toHaveBeenCalledWith('/pokemon/1');
    });

    it('should navigate to pokemon detail with string id', () => {
        const { result } = renderHook(() => useNavigation());

        act(() => {
            result.current.goToPokemonDetail('bulbasaur');
        });

        expect(mockNavigate).toHaveBeenCalledWith('/pokemon/bulbasaur');
    });

    it('should go back', () => {
        const { result } = renderHook(() => useNavigation());

        act(() => {
            result.current.goBack();
        });

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('should check if current route is protected', () => {
        const { result } = renderHook(() => useNavigation());

        // Current path is '/' (HOME) which is not protected
        expect(result.current.isCurrentRouteProtected()).toBe(false);
    });

    it('should check if protected route is protected', () => {
        // Mock location to be on a protected route
        (useLocation as any).mockReturnValue({ pathname: '/main' });

        const { result } = renderHook(() => useNavigation());

        expect(result.current.isCurrentRouteProtected()).toBe(true);
    });

    it('should get current route meta for home route', () => {
        const { result } = renderHook(() => useNavigation());

        const meta = result.current.getCurrentRouteMeta();
        expect(meta).toEqual({
            path: '/',
            title: 'Home',
            requiresAuth: false,
            showInNav: false,
        });
    });

    it('should get current route meta for main route', () => {
        // Mock location to be on main route
        (useLocation as any).mockReturnValue({ pathname: '/main' });

        const { result } = renderHook(() => useNavigation());

        const meta = result.current.getCurrentRouteMeta();
        expect(meta).toEqual({
            path: '/main',
            title: 'Pokemon List',
            requiresAuth: true,
            showInNav: true,
            icon: 'pokeball',
        });
    });

    it('should get current route meta for dynamic route', () => {
        // Mock location to be on a dynamic route
        (useLocation as any).mockReturnValue({ pathname: '/pokemon/1' });

        const { result } = renderHook(() => useNavigation());

        // Should return undefined for dynamic routes not in ROUTE_META
        expect(result.current.getCurrentRouteMeta()).toBe(undefined);
    });

    it('should get navigation routes', () => {
        const { result } = renderHook(() => useNavigation());

        expect(result.current.navigationRoutes).toEqual([
            {
                path: '/main',
                title: 'Pokemon List',
                requiresAuth: true,
                showInNav: true,
                icon: 'pokeball',
            }
        ]);
    });

    it('should handle route checking correctly', () => {
        const { result } = renderHook(() => useNavigation());

        // Test exact route matching
        expect(result.current.isCurrentRoute('/')).toBe(true);
        expect(result.current.isCurrentRoute('/login')).toBe(false);
        expect(result.current.isCurrentRoute('/main')).toBe(false);

        // Test route starts with
        expect(result.current.isCurrentRouteStartsWith('/')).toBe(true);
        expect(result.current.isCurrentRouteStartsWith('/pokemon')).toBe(false);
    });

    it('should handle different current paths', () => {
        // Mock location to be on login route
        (useLocation as any).mockReturnValue({ pathname: '/login' });

        const { result } = renderHook(() => useNavigation());

        expect(result.current.currentPath).toBe('/login');
        expect(result.current.isCurrentRoute('/login')).toBe(true);
        expect(result.current.isCurrentRoute('/')).toBe(false);
        expect(result.current.isCurrentRouteProtected()).toBe(false);
    });

    it('should return params correctly', () => {
        const mockParamsWithId = { id: '25' };
        (useParams as any).mockReturnValue(mockParamsWithId);

        const { result } = renderHook(() => useNavigation());

        expect(result.current.params).toEqual(mockParamsWithId);
    });
}); 