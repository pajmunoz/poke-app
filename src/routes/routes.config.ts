// Route constants
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  HOME: '/',
  
  // Protected routes
  MAIN: '/main',
} as const;

// Route types
export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

// Route metadata for navigation
export interface RouteMeta {
  path: string;
  title: string;
  requiresAuth: boolean;
  showInNav?: boolean;
  icon?: string;
}

export const ROUTE_META: Record<RouteKey, RouteMeta> = {
  LOGIN: {
    path: ROUTES.LOGIN,
    title: 'Login',
    requiresAuth: false,
    showInNav: false,
  },
  HOME: {
    path: ROUTES.HOME,
    title: 'Home',
    requiresAuth: false,
    showInNav: false,
  },
  MAIN: {
    path: ROUTES.MAIN,
    title: 'Pokemon List',
    requiresAuth: true,
    showInNav: true,
    icon: 'pokeball',
  },
};

// Helper function to get navigation routes
export const getNavigationRoutes = () => {
  return Object.values(ROUTE_META).filter(route => route.showInNav);
};

// Helper function to check if route requires authentication
export const isRouteProtected = (path: string): boolean => {
  const route = Object.values(ROUTE_META).find(r => r.path === path);
  return route?.requiresAuth ?? false;
};
