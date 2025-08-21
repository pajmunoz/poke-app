# App Routing System

This directory contains the routing configuration and components for the Pokemon app.

## Files

### `AppRoutes.tsx`
Main routing component that defines all application routes. It uses the `RouteGuard` component for authentication and the `AppLayout` for consistent page structure.

### `routes.config.ts`
Configuration file containing route constants, types, and metadata. This centralizes all route definitions and makes them easy to maintain.

### `useNavigation.ts`
Custom hook that provides navigation utilities and route information throughout the app.

## Route Structure

### Public Routes
- `/login` - Login page (redirects authenticated users to main)
- `/` - Home route (redirects to login)

### Protected Routes
- `/main` - Main Pokemon list page
- `/pokemon` - Pokemon overview page
- `/pokemon/:id` - Individual Pokemon detail page
- `/favorites` - User's favorite Pokemon
- `/profile` - User profile page

## Usage

### Basic Navigation
```tsx
import { useNavigation } from '../hooks/useNavigation';

const MyComponent = () => {
  const { goToMain, goToPokemonDetail } = useNavigation();
  
  return (
    <div>
      <button onClick={goToMain}>Go to Main</button>
      <button onClick={() => goToPokemonDetail(25)}>View Pikachu</button>
    </div>
  );
};
```

### Route Information
```tsx
const { currentPath, isCurrentRoute, isCurrentRouteProtected } = useNavigation();

if (isCurrentRoute('/pokemon')) {
  // Handle Pokemon route specific logic
}
```

### Route Constants
```tsx
import { ROUTES } from '../routes/routes.config';

// Use route constants instead of hardcoded strings
navigate(ROUTES.FAVORITES);
```

## Authentication

The routing system uses `RouteGuard` components to protect routes. Authentication is currently handled via localStorage, but you can modify the `RouteGuard` component to integrate with your authentication system.

## Adding New Routes

1. Add the route constant to `routes.config.ts`
2. Add route metadata including title, auth requirements, and navigation settings
3. Add the route to `AppRoutes.tsx`
4. Update the `useNavigation` hook if needed

## Layout

All protected routes use the `AppLayout` component which includes the header and main content area. Public routes (like login) are rendered without the layout.
