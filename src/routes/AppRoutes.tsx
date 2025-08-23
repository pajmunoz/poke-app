import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '../pages/LoginPage/LoginPage';
import MainPage from '../pages/MainPage/MainPage';
import Header from '../components/layout/Header';
import RouteGuard from '../components/common/RouteGuard/RouteGuard';
import { ROUTES } from './routes.config';
import "./AppRoutes.css";

// Layout Component with Header
const AppLayout = () => {
    return (
        <div className="app-layout">
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.LOGIN} element={
                <RouteGuard requireAuth={false}>
                    <LoginPage />
                </RouteGuard>
            } />
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />

            {/* Protected Routes */}
            <Route element={<AppLayout />}>
                <Route path={ROUTES.MAIN} element={
                    <RouteGuard requireAuth={true}>
                        <MainPage />
                    </RouteGuard>
                } />


            </Route>

            {/* Catch all route - redirect to login */}
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
    );
};

export default AppRoutes;
