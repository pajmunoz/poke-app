import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ROUTES, ROUTE_META, getNavigationRoutes } from '../routes/routes.config';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Navigation functions
  const goToLogin = () => navigate(ROUTES.LOGIN);
  const goToMain = () => navigate(ROUTES.MAIN);

  const goToPokemonDetail = (id: string | number) => navigate(`/pokemon/${id}`);
  
  const goBack = () => navigate(-1);

  // Route information
  const currentPath = location.pathname;
  const isCurrentRoute = (path: string) => currentPath === path;
  const isCurrentRouteStartsWith = (path: string) => currentPath.startsWith(path);
  
  // Get current route metadata
  const getCurrentRouteMeta = () => {
    return Object.values(ROUTE_META).find(route => 
      route.path === currentPath || 
      (route.path.includes(':') && isCurrentRouteStartsWith(route.path.split(':')[0]))
    );
  };

  // Check if current route requires authentication
  const isCurrentRouteProtected = () => {
    const currentMeta = getCurrentRouteMeta();
    return currentMeta?.requiresAuth ?? false;
  };

  // Get navigation routes for the header
  const navigationRoutes = getNavigationRoutes();

  return {
    // Navigation functions
    goToLogin,
    goToMain,
    goToPokemonDetail,
    goBack,
    
    // Route information
    currentPath,
    isCurrentRoute,
    isCurrentRouteStartsWith,
    getCurrentRouteMeta,
    isCurrentRouteProtected,
    
    // Navigation data
    navigationRoutes,
    
    // URL params
    params,
  };
};
