import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes.config';
import Loader from '../Loader/Loader';
import './RouteGuard.css';

interface RouteGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    fallbackPath?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
    children,
    requireAuth = true,
    fallbackPath = ROUTES.LOGIN
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Simulate authentication check
        const checkAuth = async () => {
            
            try {
                // You can implement your actual auth check here
                // For now, we'll use localStorage
               
                const authStatus = localStorage.getItem('isAuthenticated') === 'true';
                setIsAuthenticated(authStatus);
             
            } catch (error) {
                console.error('Authentication check failed:', error);
                setIsAuthenticated(false);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 500)

            }
        };

        checkAuth();
    }, [location.pathname]);

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="container-loader">
                <Loader />
            </div>
        );
    }

    // Redirect if authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
        return <Navigate to={fallbackPath} state={{ from: location }} replace />;
    }

    // Redirect if user is authenticated but trying to access public routes
    if (!requireAuth && isAuthenticated && location.pathname === ROUTES.LOGIN) {
        return <Navigate to={ROUTES.MAIN} replace />;
    }

    return <>{children}</>;
};

export default RouteGuard;
