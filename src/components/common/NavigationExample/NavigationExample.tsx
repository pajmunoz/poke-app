import React from 'react';
import { useNavigation } from '../../../hooks/useNavigation';
import { ROUTES } from '../../../routes/routes.config';
import './NavigationExample.css';

const NavigationExample: React.FC = () => {
  const {
    currentPath,
    isCurrentRoute,
    goToMain,
    goToLogin,
    navigationRoutes
  } = useNavigation();

  return (
    <div className="navigation-example">
      <h3>Navigation Example</h3>

      <div className="current-route">
        <strong>Current Route:</strong> {currentPath}
      </div>

      <div className="navigation-buttons">
        <button
          onClick={goToLogin}
          className={isCurrentRoute(ROUTES.LOGIN) ? 'active' : ''}
        >
          Login
        </button>
        <button
          onClick={goToMain}
          className={isCurrentRoute(ROUTES.MAIN) ? 'active' : ''}
        >
          Main Page
        </button>


      </div>

      <div className="available-routes">
        <h4>Available Navigation Routes:</h4>
        <ul>
          {navigationRoutes.map((route) => (
            <li key={route.path}>
              <strong>{route.title}</strong> - {route.path}
              {route.icon && <span className="icon"> [{route.icon}]</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavigationExample;
